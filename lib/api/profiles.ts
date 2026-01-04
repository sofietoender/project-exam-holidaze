import { API_BASE, API_KEY } from "../config";
import { Profile, UpdateProfileData, ProfileResponse, ProfilesResponse } from "../../types/profiles";

/**
 * Fetch a single profile by name
 */
export async function fetchProfile(profileName: string, accessToken: string): Promise<ProfileResponse> {
	const url = `${API_BASE}/holidaze/profiles/${profileName}`;

	const response = await fetch(url, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
			"X-Noroff-API-Key": API_KEY!,
		},
		cache: "no-store",
	});

	if (!response.ok) {
		let errorData;
		try {
			errorData = await response.json();
			console.error("Fetch profile error:", JSON.stringify(errorData, null, 2));
		} catch {
			console.error("Could not parse error response");
		}

		throw new Error(errorData?.errors?.[0]?.message || `Failed to fetch profile: ${response.statusText}`);
	}

	return response.json();
}

/**
 * Update a profile
 */
export async function updateProfile(profileName: string, profileData: UpdateProfileData, accessToken: string): Promise<ProfileResponse> {
	const url = `${API_BASE}/holidaze/profiles/${profileName}`;

	const response = await fetch(url, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
			"X-Noroff-API-Key": API_KEY!,
		},
		body: JSON.stringify(profileData),
	});

	if (!response.ok) {
		let errorData;
		try {
			errorData = await response.json();
			console.error("Update profile error:", JSON.stringify(errorData, null, 2));
		} catch {
			console.error("Could not parse error response");
		}

		throw new Error(errorData?.errors?.[0]?.message || `Failed to update profile: ${response.statusText}`);
	}

	return response.json();
}

/**
 * Search profiles by name or bio
 */
export async function searchProfiles(query: string, accessToken: string): Promise<ProfilesResponse> {
	const url = `${API_BASE}/holidaze/profiles/search?q=${encodeURIComponent(query)}`;

	const response = await fetch(url, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
			"X-Noroff-API-Key": API_KEY!,
		},
		cache: "no-store",
	});

	if (!response.ok) {
		let errorData;
		try {
			errorData = await response.json();
			console.error("Search profiles error:", JSON.stringify(errorData, null, 2));
		} catch {
			console.error("Could not parse error response");
		}

		throw new Error(errorData?.errors?.[0]?.message || `Failed to search profiles: ${response.statusText}`);
	}

	return response.json();
}

/**
 * Fetch all profiles with pagination
 */
export async function fetchProfiles(
	params: {
		limit?: number;
		page?: number;
		sort?: string;
		sortOrder?: "asc" | "desc";
	} = {}
): Promise<ProfilesResponse> {
	const { limit = 20, page = 1, sort = "name", sortOrder = "asc" } = params;

	const url = `${API_BASE}/holidaze/profiles?limit=${limit}&page=${page}&sort=${sort}&sortOrder=${sortOrder}`;

	const response = await fetch(url, {
		headers: {
			"Content-Type": "application/json",
			"X-Noroff-API-Key": API_KEY!,
		},
		next: { revalidate: 3600 },
	});

	if (!response.ok) {
		let errorData;
		try {
			errorData = await response.json();
			console.error("Fetch profiles error:", JSON.stringify(errorData, null, 2));
		} catch {
			console.error("Could not parse error response");
		}

		throw new Error(errorData?.errors?.[0]?.message || `Failed to fetch profiles: ${response.statusText}`);
	}

	return response.json();
}
