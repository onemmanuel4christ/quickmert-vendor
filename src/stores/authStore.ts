import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Vendor } from "../types";

interface AuthState {
  user: Vendor | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: Vendor, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      login: (user, token) => {
        localStorage.setItem("authToken", token);
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        set({ user: null, token: null, isAuthenticated: false });
      },
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
