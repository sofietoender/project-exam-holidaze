export interface ProfileAvatar {
	url: string;
	alt: string;
}

export interface ProfileBanner {
	url: string;
	alt: string;
}

export interface Profile {
	name: string;
	email: string;
	bio?: string;
	avatar?: ProfileAvatar;
	banner?: ProfileBanner;
	venueManager: boolean;
	_count?: {
		venues: number;
		bookings: number;
	};
}

export interface UpdateProfileData {
	bio?: string;
	avatar?: ProfileAvatar;
	banner?: ProfileBanner;
	venueManager?: boolean;
}

export interface ProfileResponse {
	data: Profile;
	meta: Record<string, unknown>;
}

export interface ProfilesResponse {
	data: Profile[];
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
