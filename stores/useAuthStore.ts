import { create } from "zustand";
import { User as FirebaseUser } from "firebase/auth";
import { User as AppUser } from "@/app/(routes)/caodangnghe/types";

interface AuthState {
  user: FirebaseUser | null;
  profile: AppUser | null;
  loading: boolean;
  setAuth: (user: FirebaseUser | null, profile: AppUser | null) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setProfile: (profile: AppUser | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,
  setAuth: (user, profile) => set({ user, profile, loading: false }),
  clearAuth: () => set({ user: null, profile: null, loading: false }),
  setLoading: (loading) => set({ loading }),
  setProfile: (profile) => set({ profile }),
}));
