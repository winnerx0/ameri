import { create } from "zustand";
import { Goal, RegisterRequest, Screen } from "@/types";

interface RegisterStore {
  registerData: RegisterRequest;
  setRegisterData: (data: RegisterRequest) => void;
  updateField: (field: keyof RegisterRequest, value: string | string[] | number) => void;
  resetRegisterData: () => void;
}

const initialRegisterData: RegisterRequest = {
  username: "",
  email: "",
  password: "",
  gender: null,
  healthConditions: [],
  weight: 0,
  height: 0,
  goal: null,
  dateOfBirth: ""
};

export const useRegisterStore = create<RegisterStore>((set) => ({
  registerData: initialRegisterData,

  setRegisterData: (data) => set({ registerData: data }),

  updateField: (field, value) =>
    set((state) => ({
      registerData: {
        ...state.registerData,
        [field]: value,
      },
    })),

  resetRegisterData: () => set({ registerData: initialRegisterData }),
}));

interface ScreenStore {
  screen: Screen<string>;
  setScreen: (screen: Screen<string>) => void;
}

export const useScreen = create<ScreenStore>((set) => ({
  screen: { path: "login" },
  setScreen: (screen) => set({ screen }),
}));
