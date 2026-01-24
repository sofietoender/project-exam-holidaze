import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserData } from "@/lib/auth";

type AuthState = {
	user: UserData | null;
	accessToken: string | null;
	setAuth: (userData: UserData) => void;
	clearAuth: () => void;
	isAuthenticated: () => boolean;
	_hasHydrated: boolean;
	setHasHydrated: (state: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			user: null,
			accessToken: null,
			_hasHydrated: false,

			setAuth: (userData) =>
				set({
					user: userData,
					accessToken: userData.accessToken,
				}),

			clearAuth: () =>
				set({
					user: null,
					accessToken: null,
				}),

			isAuthenticated: () => {
				const token = get().accessToken;
				return !!token;
			},

			setHasHydrated: (state) => {
				set({
					_hasHydrated: state,
				});
			},
		}),
		{
			name: "auth-storage",
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated(true);
			},
		},
	),
);
