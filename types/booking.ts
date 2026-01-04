import { Venue } from "./venue";

export interface Booking {
	id: string;
	dateFrom: string;
	dateTo: string;
	guests: number;
	created: string;
	updated: string;
	venue?: Venue;
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
}

export interface CreateBookingData {
	dateFrom: string;
	dateTo: string;
	guests: number;
	venueId: string;
}
