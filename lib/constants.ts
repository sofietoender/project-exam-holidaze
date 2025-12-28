export const AMENITIES = [
	{ id: "wifi", label: "WiFi" },
	{ id: "parking", label: "Parking" },
	{ id: "breakfast", label: "Breakfast" },
	{ id: "pets", label: "Pets Allowed" },
] as const;

export type AmenityId = (typeof AMENITIES)[number]["id"];
