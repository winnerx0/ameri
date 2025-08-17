import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { decode } from "js-base64";

export const BACKEND_URL = "https://f835ace942c8.ngrok-free.app/api/v1";

export const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  let accessToken = await AsyncStorage.getItem("accessToken");
  let refreshToken = await AsyncStorage.getItem("refreshToken");

  if (accessToken) {
    const base64Url = accessToken.split(".")[1];
    const json = decode(base64Url.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(json);
    const expTime = payload.exp * 1000;
    const refreshTime = expTime - 5 * 60 * 1000;

    if (Date.now() >= refreshTime) {
      console.log("Access token is near expiry, refreshing...");

      try {
        const res = await axios.post(
          `${BACKEND_URL}/auth/refresh-token`,
          { refreshToken },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        if (res.status === 200) {
          accessToken = res.data.accessToken as string;
          refreshToken = res.data.refreshToken as string;
          await AsyncStorage.setItem("accessToken", accessToken!);
          await AsyncStorage.setItem("refreshToken", refreshToken!);
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
      console.log("token still valid");
      console.log("refresh token ", await AsyncStorage.getItem("refreshToken"));
    }

    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});
