import { create } from "zustand";
import { Goal, RegisterRequest } from "@/types";

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
  heathConditons: [],
  weight: 0,
  height: 0,
  goal: null,
  dateOfBirth: new Date().toISOString(),
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
