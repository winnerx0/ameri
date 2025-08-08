import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const BACKEND_URL = "https://1527c01e26f5.ngrok-free.app/api/v1";

export const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(undefined, async (error) => {
  const token = await AsyncStorage.getItem("refreshToken");
  if (error.response.status === 401) {
    const res = await axios.post(
      BACKEND_URL + "/auth/refresh-token",
      {
        refreshToken: await AsyncStorage.getItem("refreshToken"),
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 401) {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
    }
    const newAccessToken = res.data?.accessToken;
    if (newAccessToken) {
      await AsyncStorage.setItem("accessToken", newAccessToken);
      error.config.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(error.config);
    }
  }
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
