// lib/api/bookings.ts

import { API_BASE, API_KEY } from "../config";

export interface CreateBookingData {
	dateFrom: string; // ISO 8601 format: "2026-01-15"
	dateTo: string; // ISO 8601 format: "2026-01-20"
	guests: number;
	venueId: string;
}

export interface Booking {
	id: string;
	dateFrom: string;
	dateTo: string;
	guests: number;
	created: string;
	updated: string;
}

export interface BookingResponse {
	data: Booking;
	meta: Record<string, never>;
}

/**
 * Create a new booking
 * Requires authentication token
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
