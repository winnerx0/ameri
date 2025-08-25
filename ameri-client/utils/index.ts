import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { decode } from "js-base64";

export const BACKEND_URL = "https://6fe0636ea6eb.ngrok-free.app/api/v1";

// Create main API instance
export const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create separate instance for auth requests to avoid circular calls
const authApi = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token refresh state management
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;
let refreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 3;
const REFRESH_COOLDOWN = 60000; // 1 minute cooldown after max attempts
let lastFailedRefreshTime = 0;

const clearAuthData = async () => {
  await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
  refreshAttempts = 0;
};

const isTokenExpired = (token: string): boolean => {
  try {
    const base64Url = token.split(".")[1];
    const json = decode(base64Url.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(json);
    const expTime = payload.exp * 1000;
    const refreshTime = expTime - 5 * 60 * 1000; // Refresh 5 minutes before expiry
    
    return Date.now() >= refreshTime;
  } catch (error) {
    console.error("Error parsing token:", error);
    return true; // Treat invalid tokens as expired
  }
};

const refreshAccessToken = async (): Promise<string> => {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  // Check if we're in cooldown period after max attempts
  const now = Date.now();
  if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
    const timeSinceLastFailure = now - lastFailedRefreshTime;
    if (timeSinceLastFailure < REFRESH_COOLDOWN) {
      const remainingTime = Math.ceil((REFRESH_COOLDOWN - timeSinceLastFailure) / 1000);
      throw new Error(`Too many refresh attempts. Try again in ${remainingTime} seconds.`);
    } else {
      // Reset attempts after cooldown
      refreshAttempts = 0;
    }
  }

  isRefreshing = true;
  refreshAttempts++;
  
  refreshPromise = new Promise(async (resolve, reject) => {
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      console.log(`Token refresh attempt ${refreshAttempts}/${MAX_REFRESH_ATTEMPTS}`);
      
      const res = await authApi.post("/auth/refresh-token", {
        refreshToken,
      });

      if (res.status === 200 && res.data.accessToken) {
        const newAccessToken = res.data.accessToken;
        const newRefreshToken = res.data.refreshToken;
        
        await AsyncStorage.setItem("accessToken", newAccessToken);
        if (newRefreshToken) {
          await AsyncStorage.setItem("refreshToken", newRefreshToken);
        }
        
        // Reset attempts on successful refresh
        refreshAttempts = 0;
        console.log("Token refreshed successfully");
        resolve(newAccessToken);
      } else {
        throw new Error("Invalid refresh response");
      }
    } catch (error) {
      console.error(`Token refresh attempt ${refreshAttempts} failed:`, error);
      
      if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
        console.error("Max refresh attempts reached. Clearing auth data.");
        lastFailedRefreshTime = Date.now();
        await clearAuthData();
      }
      
      reject(error);
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  });

  return refreshPromise;
};

// ONLY use request interceptor for token attachment and refresh
api.interceptors.request.use(
  async (config) => {
    try {
      let accessToken = await AsyncStorage.getItem("accessToken");
      
      if (accessToken) {
        // Only refresh token in request interceptor if it's expired
        if (isTokenExpired(accessToken)) {
          console.log("Access token is near expiry, refreshing...");
          try {
            accessToken = await refreshAccessToken();
          } catch (error) {
            console.warn("Token refresh failed in request interceptor:", error);
            // Don't attach token if refresh fails
            accessToken = null;
          }
        }
        
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }
    } catch (error) {
      console.error("Error in request interceptor:", error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor ONLY handles 401 errors, doesn't refresh tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If we get 401, just clear auth data and reject
    // Don't try to refresh here to avoid infinite loops
    if (error.response?.status === 401) {
      console.warn("Received 401 error, clearing auth data");
      await clearAuthData();
      return Promise.reject(new Error("Authentication failed. Please login again."));
    }
    
    return Promise.reject(error);
  }
);

// Utility function to check auth status
export const checkAuthStatus = async () => {
  const accessToken = await AsyncStorage.getItem("accessToken");
  const refreshToken = await AsyncStorage.getItem("refreshToken");
  
  if (!accessToken || !refreshToken) {
    return { isAuthenticated: false, needsLogin: true };
  }
  
  if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
    const timeSinceLastFailure = Date.now() - lastFailedRefreshTime;
    if (timeSinceLastFailure < REFRESH_COOLDOWN) {
      return { 
        isAuthenticated: false, 
        needsLogin: true, 
        cooldownRemaining: Math.ceil((REFRESH_COOLDOWN - timeSinceLastFailure) / 1000)
      };
    }
  }
  
  try {
    if (isTokenExpired(accessToken)) {
      return { isAuthenticated: false, canRefresh: true };
    }
    return { isAuthenticated: true };
  } catch {
    return { isAuthenticated: false, needsLogin: true };
  }
};

// Manual refresh function for when you explicitly want to refresh
export const manualTokenRefresh = async (): Promise<boolean> => {
  try {
    await refreshAccessToken();
    return true;
  } catch (error) {
    console.error("Manual token refresh failed:", error);
    return false;
  }
};

export default api;