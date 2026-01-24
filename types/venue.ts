import { Booking } from "./booking";

export interface Media {
	url: string;
	alt: string;
}

export interface Location {
	address?: string;
	city?: string;
	zip?: string;
	country?: string;
	continent?: string;
	lat?: number;
	lng?: number;
}

export interface VenueMeta {
	wifi: boolean;
	parking: boolean;
	breakfast: boolean;
	pets: boolean;
}

export interface VenueOwner {
	name: string;
	email: string;
	avatar?: Media;
	bio?: string;
}

export interface Venue {
	id: string;
	name: string;
	description: string;
	media: Media[];
	price: number;
	maxGuests: number;
	rating: number;
	created: string;
	updated: string;
	meta: VenueMeta;
	location: Location;
	owner?: VenueOwner;
	bookings?: Booking[];
}

// API Response Types

export interface VenuesResponse {
	data: Venue[];
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

export interface VenueResponse {
	data: Venue;
	meta: Record<string, never>;
}

export interface CreateVenueData {
	name: string;
	description: string;
	media: Array<{
		url: string;
		alt?: string;
	}>;
	price: number;
	maxGuests: number;
	rating?: number;
	meta: {
		wifi: boolean;
		parking: boolean;
		breakfast: boolean;
		pets: boolean;
	};
	location: {
		address?: string;
		city?: string;
		zip?: string;
		country?: string;
		continent?: string;
		lat?: number;
		lng?: number;
	};
}
