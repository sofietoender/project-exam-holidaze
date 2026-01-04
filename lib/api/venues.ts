import { VenuesResponse, VenueResponse, Venue, CreateVenueData } from "@/types/venue";
import { API_BASE, API_KEY } from "../config";

interface FetchVenuesParams {
	limit?: number;
	page?: number;
	sort?: string;
	sortOrder?: "asc" | "desc";
}

export async function fetchVenues(params?: FetchVenuesParams): Promise<VenuesResponse> {
	const { limit = 9, page = 1, sort = "name", sortOrder = "asc" } = params || {};

	const url = `${API_BASE}/holidaze/venues?limit=${limit}&page=${page}&sort=${sort}&sortOrder=${sortOrder}`;

	const response = await fetch(url, {
		headers: {
			"Content-Type": "application/json",
			"X-Noroff-API-Key": API_KEY!,
		},
		next: { revalidate: 3600 },
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => null);
		console.error("Fetch venues error:", errorData);
		throw new Error(`Failed to fetch venues: ${response.statusText}`);
	}

	return response.json();
}

/**
 * Fetch a single venue by ID with owner and bookings
 */
export async function fetchVenueById(id: string): Promise<VenueResponse> {
	const url = `${API_BASE}/holidaze/venues/${id}?_owner=true&_bookings=true`;

	const response = await fetch(url, {
		headers: {
			"Content-Type": "application/json",
			"X-Noroff-API-Key": API_KEY!,
		},
		cache: "no-store",
	});

	if (!response.ok) {
		let errorData;
		try {
			errorData = await response.json();
			console.error("Error data from API:", JSON.stringify(errorData, null, 2));
		} catch {
			console.error("Could not parse error response");
		}

		throw new Error(`Failed to fetch venue (${response.status}): ${response.statusText}`);
	}

	return response.json();
}

/**
 * Fetch all venues by profile (for venue managers)
 */
export async function fetchVenuesByProfile(profileName: string, accessToken: string): Promise<VenuesResponse> {
	const url = `${API_BASE}/holidaze/profiles/${profileName}/venues?_bookings=true`;

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
			console.error("Fetch venues by profile error:", JSON.stringify(errorData, null, 2));
		} catch {
			console.error("Could not parse error response");
		}

		throw new Error(errorData?.errors?.[0]?.message || `Failed to fetch venues: ${response.statusText}`);
	}

	return response.json();
}

/**
 * Search venues by name
 */
export async function searchVenues(query: string): Promise<VenuesResponse> {
	const url = `${API_BASE}/holidaze/venues/search?q=${encodeURIComponent(query)}`;

	const response = await fetch(url, {
		headers: {
			"Content-Type": "application/json",
			"X-Noroff-API-Key": API_KEY!,
		},
		cache: "no-store",
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => null);
		console.error("Search venues error:", errorData);
		throw new Error(`Failed to search venues: ${response.statusText}`);
	}

	return response.json();
}

/**
 * Update a venue
 */
export async function updateVenue(venueId: string, venueData: Partial<Venue>, accessToken: string): Promise<VenueResponse> {
	const url = `${API_BASE}/holidaze/venues/${venueId}`;

	const response = await fetch(url, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
			"X-Noroff-API-Key": API_KEY!,
		},
		body: JSON.stringify(venueData),
	});

	if (!response.ok) {
		let errorData;
		try {
			errorData = await response.json();
			console.error("Update venue error:", JSON.stringify(errorData, null, 2));
		} catch {
			console.error("Could not parse error response");
		}

		throw new Error(errorData?.errors?.[0]?.message || `Failed to update venue: ${response.statusText}`);
	}

	return response.json();
}

/**
 * Create a new venue
 */
export async function createVenue(venueData: CreateVenueData, accessToken: string): Promise<VenueResponse> {
	const url = `${API_BASE}/holidaze/venues`;

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
			"X-Noroff-API-Key": API_KEY!,
		},
		body: JSON.stringify(venueData),
	});

	if (!response.ok) {
		let errorData;
		try {
			errorData = await response.json();
			console.error("Create venue error:", JSON.stringify(errorData, null, 2));
		} catch {
			console.error("Could not parse error response");
		}

		throw new Error(errorData?.errors?.[0]?.message || `Failed to create venue: ${response.statusText}`);
	}

	return response.json();
}

export async function deleteVenue(venueId: string, accessToken: string): Promise<void> {
	const url = `${API_BASE}/holidaze/venues/${venueId}`;

	const response = await fetch(url, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"X-Noroff-API-Key": API_KEY!,
		},
	});

	if (!response.ok) {
		let errorData;
		try {
			errorData = await response.json();
			console.error("Delete venue error:", JSON.stringify(errorData, null, 2));
		} catch {
			console.error("Could not parse delete error response");
		}

		throw new Error(errorData?.errors?.[0]?.message || `Failed to delete venue: ${response.statusText}`);
	}

	// 204 No Content - no response body
}
