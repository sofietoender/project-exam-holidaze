import Cookies from "js-cookie";

const API_BASE = "https://v2.api.noroff.dev";
const API_KEY = "b9252c6b-019e-4705-9fdd-cab4541bc61f";

interface LoginData {
	email: string;
	password: string;
}

interface RegisterData {
	name: string;
	email: string;
	password: string;
	venueManager?: boolean;
}

export interface UserData {
	name: string;
	email: string;
	avatar?: {
		url: string;
		alt: string;
	};
	banner?: {
		url: string;
		alt: string;
	};
	accessToken: string;
	venueManager?: boolean;
}

export async function login(credentials: LoginData): Promise<UserData> {
	const response = await fetch(`${API_BASE}/auth/login?_holidaze=true`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-Noroff-API-Key": API_KEY,
		},
		body: JSON.stringify(credentials),
	});

	const result = await response.json();

	if (!response.ok) {
		throw new Error(result.errors?.[0]?.message || "Login failed");
	}

	if (result.data?.accessToken) {
		// Save in local storage for components
		localStorage.setItem("accessToken", result.data.accessToken);
		localStorage.setItem("user", JSON.stringify(result.data));

		// Save as cookies for proxy
		Cookies.set("accessToken", result.data.accessToken, { expires: 7 });
		Cookies.set("user", JSON.stringify(result.data), { expires: 7 });
	}

	return result.data;
}

export async function register(userData: RegisterData): Promise<UserData> {
	const registerResponse = await fetch(`${API_BASE}/auth/register`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-Noroff-API-Key": API_KEY,
		},
		body: JSON.stringify(userData),
	});

	const registerResult = await registerResponse.json();

	if (!registerResponse.ok) {
		throw new Error(registerResult.errors?.[0]?.message || "Registration failed");
	}

	const loginData = await login({
		email: userData.email,
		password: userData.password,
	});

	return loginData;
}

export function logout() {
	//remove from local storage
	localStorage.removeItem("accessToken");
	localStorage.removeItem("user");

	//remove from cookies
	Cookies.remove("accessToken");
	Cookies.remove("user");
}

export function getToken(): string | null {
	if (typeof window === "undefined") return null;
	return localStorage.getItem("accessToken");
}

export function getUser(): UserData | null {
	if (typeof window === "undefined") return null;
	const user = localStorage.getItem("user");
	return user ? JSON.parse(user) : null;
}

export function isLoggedIn(): boolean {
	return !!getToken();
}
