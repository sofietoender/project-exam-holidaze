import { API_BASE, API_KEY } from "../config";
import { BookingsResponse, BookingResponse, CreateBookingData } from "../../types/booking";

/**
 * Fetch all bookings for a profile
 */
export async function fetchBookingsByProfile(profileName: string, accessToken: string): Promise<BookingsResponse> {
	const url = `${API_BASE}/holidaze/profiles/${profileName}/bookings?_venue=true`;

	const response = await fetch(url, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
			"X-Noroff-API-Key": API_KEY!,
		},
	});

	if (!response.ok) {
		let errorData;
		try {
			errorData = await response.json();
		} catch {}

		throw new Error(errorData?.errors?.[0]?.message || `Failed to fetch bookings: ${response.statusText}`);
	}

	return response.json();
}

/**
 * Create a new booking
 */
export async function createBooking(bookingData: CreateBookingData, accessToken: string): Promise<BookingResponse> {
	const url = `${API_BASE}/holidaze/bookings`;

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
			"X-Noroff-API-Key": API_KEY!,
		},
		body: JSON.stringify(bookingData),
	});

	if (!response.ok) {
		let errorData;
		try {
			errorData = await response.json();
		} catch {}

		throw new Error(errorData?.errors?.[0]?.message || `Failed to create booking: ${response.statusText}`);
	}

	return response.json();
}

/**
 * Delete a booking
 */
export async function deleteBooking(bookingId: string, accessToken: string): Promise<void> {
	const url = `${API_BASE}/holidaze/bookings/${bookingId}`;

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
		} catch {}

		throw new Error(errorData?.errors?.[0]?.message || `Failed to delete booking: ${response.statusText}`);
	}
}
