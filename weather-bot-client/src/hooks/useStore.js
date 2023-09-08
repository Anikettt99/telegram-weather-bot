import create from "zustand";

export const useStore = create((set) => ({
  authData: localStorage.getItem("authData")
    ? JSON.parse(localStorage.getItem("authData"))
    : {},
  setAuthData: (newAuthData) => set((state) => ({ authData: newAuthData })),
}));
