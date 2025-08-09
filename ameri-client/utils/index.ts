import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const BACKEND_URL = "https://edc57d6ef857.ngrok-free.app/api/v1";

export const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(undefined, async (error) => {
  const token = await AsyncStorage.getItem("accessToken");


  console.log("this is the error", error.response.status)
  if (error.response.status === 401) {
    console.log(await AsyncStorage.getItem("refreshToken"));
    const res = await axios.post(
      BACKEND_URL + "/auth/refresh-token",
      {
        refreshToken: await AsyncStorage.getItem("refreshToken"),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("status", res.status)

    if (res.status !== 200) {
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
