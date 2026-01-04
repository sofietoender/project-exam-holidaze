import { VenuesResponse, VenueResponse } from "@/types/venue";
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
