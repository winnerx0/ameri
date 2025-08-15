import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { decode } from "js-base64";

export const BACKEND_URL = "https://a9ae9af929e2.ngrok-free.app/api/v1";

export const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  let token = await AsyncStorage.getItem("accessToken");

  if (token) {
    const base64Url = token.split(".")[1];
    const json = decode(base64Url.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(json);
    const expTime = payload.exp * 1000;
    const refreshTime = expTime - 120 * 1000; 

  
    if (Date.now() >= refreshTime) {
      console.log("Access token is near expiry, refreshing...");
      const refreshToken = await AsyncStorage.getItem("refreshToken");

      try {
        const res = await axios.post(
          `${BACKEND_URL}/auth/refresh-token`,
          { refreshToken },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.status === 200 && res.data?.accessToken) {
          token = res.data.accessToken;
          await AsyncStorage.setItem("accessToken", token!);
          console.log("Token refreshed successfully");
        } else {
          console.warn("Refresh token failed, clearing storage");
          await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
        }
      } catch (err) {
        console.error("Error refreshing token", err);
        await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
      }
    } else {
      console.log("token still valid")
    }

    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
