// lib/api/bookings.ts

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
			console.error("Fetch bookings error:", JSON.stringify(errorData, null, 2));
		} catch {
			console.error("Could not parse bookings error response");
		}

		throw new Error(errorData?.errors?.[0]?.message || `Failed to fetch bookings: ${response.statusText}`);
	}

	return response.json();
}

/**
 * Create a new booking
 */
export async function createBooking(bookingData: CreateBookingData, accessToken: string): Promise<BookingResponse> {
	const url = `${API_BASE}/holidaze/bookings`;

	console.log("Creating booking:", bookingData);

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
			console.error("Booking error:", JSON.stringify(errorData, null, 2));
		} catch {
			console.error("Could not parse booking error response");
		}

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
			console.error("Delete booking error:", JSON.stringify(errorData, null, 2));
		} catch {
			console.error("Could not parse delete error response");
		}

		throw new Error(errorData?.errors?.[0]?.message || `Failed to delete booking: ${response.statusText}`);
	}
}
