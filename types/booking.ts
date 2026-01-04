// types/booking.ts

import { Venue } from "./venue";

export interface Booking {
	id: string;
	dateFrom: string;
	dateTo: string;
	guests: number;
	created: string;
	updated: string;
	venue?: Venue; // Optional - only included with _venue=true
}

export interface BookingsResponse {
	data: Booking[];
	meta: {
		isFirstPage: boolean;
		isLastPage: boolean;
		currentPage: number;
		previousPage: number | null;
		nextPage: number | null;
		pageCount: number;
		totalCount: number;
	};
}

export interface BookingResponse {
	data: Booking;
	meta: Record<string, never>;
}
