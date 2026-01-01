"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Users, Wifi, Car, Coffee, PawPrint, ChevronLeft, ChevronRight } from "lucide-react";
import { AMENITIES } from "@/lib/constants";

// API Response types
interface Venue {
	id: string;
	name: string;
	description: string;
	media: Array<{
		url: string;
		alt: string;
	}>;
	price: number;
	maxGuests: number;
	rating: number;
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
	};
	owner?: {
		name: string;
		email: string;
		avatar?: {
			url: string;
			alt: string;
		};
		bio?: string;
	};
	bookings?: Array<{
		id: string;
		dateFrom: string;
		dateTo: string;
	}>;
}

// Dummy venue data
const dummyVenue: Venue = {
	id: "v1",
	name: "Cozy Beach House",
	description: "Beautiful beachfront property with stunning ocean views. Perfect for families and groups looking for a relaxing getaway. Features modern amenities and direct beach access.",
	media: [
		{
			url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2",
			alt: "Beach house exterior",
		},
		{
			url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
			alt: "Beach house interior",
		},
		{
			url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
			alt: "Beach house bedroom",
		},
	],
	price: 150,
	maxGuests: 6,
	rating: 4.8,
	meta: {
		wifi: true,
		parking: true,
		breakfast: false,
		pets: true,
	},
	location: {
		address: "123 Beach Road",
		city: "Miami",
		country: "USA",
	},
	owner: {
		name: "Anna Berg",
		email: "anna@example.com",
		avatar: {
			url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
			alt: "Anna Berg",
		},
		bio: "Passionate host with 5 years of experience",
	},
	bookings: [
		{
			id: "b1",
			dateFrom: "2026-02-15T00:00:00.000Z",
			dateTo: "2026-02-20T00:00:00.000Z",
		},
	],
};

// ✅ Amenity icon mapping
const AMENITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
	wifi: Wifi,
	parking: Car,
	breakfast: Coffee,
	pets: PawPrint,
};

export default function VenueDetailPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [checkIn, setCheckIn] = useState("");
	const [checkOut, setCheckOut] = useState("");
	const [guests, setGuests] = useState(1);
	const [isBooking, setIsBooking] = useState(false);

	const venue = dummyVenue;
	const images = venue.media?.length ? venue.media : [{ url: "/placeholder.svg", alt: venue.name }];
	const location = [venue.location?.address, venue.location?.city, venue.location?.country].filter(Boolean).join(", ") || "Location not specified";

	// ✅ Use AMENITIES from constants
	const amenities = AMENITIES.map((amenity) => ({
		...amenity,
		icon: AMENITY_ICONS[amenity.id],
		available: venue.meta?.[amenity.id as keyof typeof venue.meta] || false,
	}));

	const calculateNights = () => {
		if (!checkIn || !checkOut) return 0;
		const start = new Date(checkIn);
		const end = new Date(checkOut);
		const diffTime = Math.abs(end.getTime() - start.getTime());
		return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	};

	const nights = calculateNights();
	const totalPrice = nights * venue.price;

	const handleBooking = () => {
		setIsBooking(true);
		// API call kommer senere
		setTimeout(() => {
			setIsBooking(false);
			alert("Booking confirmed (API integration kommer senere)");
			router.push("/bookings");
		}, 1000);
	};

	// Loading state
	if (isLoading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="mb-6 h-[400px] w-full animate-pulse rounded-xl bg-muted" />
				<div className="grid gap-8 lg:grid-cols-3">
					<div className="space-y-4 lg:col-span-2">
						<div className="h-10 w-3/4 animate-pulse rounded bg-muted" />
						<div className="h-6 w-1/2 animate-pulse rounded bg-muted" />
						<div className="h-32 w-full animate-pulse rounded bg-muted" />
					</div>
					<div className="h-[400px] w-full animate-pulse rounded bg-muted" />
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Image Gallery */}
			<div className="relative mb-8 overflow-hidden rounded-2xl">
				<div className="relative aspect-[16/9] md:aspect-[21/9]">
					<Image src={images[selectedImageIndex]?.url} alt={images[selectedImageIndex]?.alt || venue.name} fill unoptimized className="object-cover" />
					{images.length > 1 && (
						<>
							<button
								onClick={() => setSelectedImageIndex((i) => (i === 0 ? images.length - 1 : i - 1))}
								className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg transition-colors hover:bg-white"
							>
								<ChevronLeft className="h-5 w-5" />
							</button>
							<button
								onClick={() => setSelectedImageIndex((i) => (i === images.length - 1 ? 0 : i + 1))}
								className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg transition-colors hover:bg-white"
							>
								<ChevronRight className="h-5 w-5" />
							</button>
						</>
					)}
				</div>
				{images.length > 1 && (
					<div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
						{images.map((_, index) => (
							<button key={index} className={`h-2 w-2 rounded-full transition-colors ${index === selectedImageIndex ? "bg-white" : "bg-white/50"}`} onClick={() => setSelectedImageIndex(index)} />
						))}
					</div>
				)}
			</div>

			<div className="grid gap-8 lg:grid-cols-3">
				{/* Venue Details */}
				<div className="lg:col-span-2">
					{/* Header */}
					<div className="mb-6">
						<div className="mb-2 flex flex-wrap items-center gap-3">
							<h1 className="text-3xl font-bold md:text-4xl">{venue.name}</h1>
							{venue.rating > 0 && (
								<div className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1">
									<Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
									<span className="font-medium">{venue.rating.toFixed(1)}</span>
								</div>
							)}
						</div>
						<div className="flex items-center gap-2 text-muted-foreground">
							<MapPin className="h-4 w-4" />
							<span>{location}</span>
						</div>
					</div>

					{/* Host Info */}
					{venue.owner && (
						<div className="mb-8 flex items-center gap-4 rounded-xl border border-border bg-card p-4">
							<div className="relative h-12 w-12 overflow-hidden rounded-full bg-muted">
								{venue.owner.avatar?.url ? (
									<Image src={venue.owner.avatar.url} alt={venue.owner.avatar.alt || venue.owner.name} fill unoptimized className="object-cover" />
								) : (
									<div className="flex h-full w-full items-center justify-center text-lg font-semibold">{venue.owner.name?.charAt(0).toUpperCase()}</div>
								)}
							</div>
							<div>
								<p className="font-medium">Hosted by {venue.owner.name}</p>
								{venue.owner.bio && <p className="line-clamp-1 text-sm text-muted-foreground">{venue.owner.bio}</p>}
							</div>
						</div>
					)}

					{/* Description */}
					<div className="mb-8">
						<h2 className="mb-4 text-xl font-semibold">About this place</h2>
						<p className="whitespace-pre-wrap text-muted-foreground">{venue.description || "No description available."}</p>
					</div>

					{/* Amenities - ✅ Using AMENITIES constant */}
					<div className="mb-8">
						<h2 className="mb-4 text-xl font-semibold">What this place offers</h2>
						<div className="grid gap-3 sm:grid-cols-2">
							{amenities.map((amenity) => {
								const Icon = amenity.icon;
								return (
									<div key={amenity.id} className={`flex items-center gap-3 rounded-lg border border-border p-4 ${amenity.available ? "" : "opacity-50 line-through"}`}>
										<Icon className="h-5 w-5" />
										<span>{amenity.label}</span>
									</div>
								);
							})}
						</div>
					</div>

					{/* Capacity */}
					<div className="mb-8 flex items-center gap-2 text-muted-foreground">
						<Users className="h-5 w-5" />
						<span>Accommodates up to {venue.maxGuests} guests</span>
					</div>
				</div>

				{/* Booking Card */}
				<div className="lg:col-span-1">
					<div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-lg">
						<div className="mb-6 flex items-baseline gap-1">
							<span className="text-3xl font-bold">${venue.price}</span>
							<span className="text-muted-foreground">/ night</span>
						</div>

						{/* Date inputs */}
						<div className="mb-4 space-y-4">
							<div>
								<label htmlFor="checkIn" className="mb-2 block text-sm font-medium">
									Check-in
								</label>
								<input
									id="checkIn"
									type="date"
									value={checkIn}
									onChange={(e) => setCheckIn(e.target.value)}
									min={new Date().toISOString().split("T")[0]}
									className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>
							<div>
								<label htmlFor="checkOut" className="mb-2 block text-sm font-medium">
									Check-out
								</label>
								<input
									id="checkOut"
									type="date"
									value={checkOut}
									onChange={(e) => setCheckOut(e.target.value)}
									min={checkIn || new Date().toISOString().split("T")[0]}
									className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>
						</div>

						{/* Guests */}
						<div className="mb-6">
							<label htmlFor="guests" className="mb-2 block text-sm font-medium">
								Guests
							</label>
							<select
								id="guests"
								value={guests}
								onChange={(e) => setGuests(Number(e.target.value))}
								className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							>
								{Array.from({ length: venue.maxGuests }, (_, i) => i + 1).map((num) => (
									<option key={num} value={num}>
										{num} {num === 1 ? "guest" : "guests"}
									</option>
								))}
							</select>
						</div>

						{/* Price breakdown */}
						{nights > 0 && (
							<div className="mb-6 space-y-2 border-t border-border pt-4">
								<div className="flex justify-between text-sm">
									<span>
										${venue.price} × {nights} night{nights !== 1 ? "s" : ""}
									</span>
									<span>${totalPrice}</span>
								</div>
								<div className="flex justify-between font-semibold">
									<span>Total</span>
									<span>${totalPrice}</span>
								</div>
							</div>
						)}

						{/* Reserve button */}
						<button
							onClick={handleBooking}
							disabled={isBooking || !checkIn || !checkOut}
							className="w-full rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isBooking ? "Booking..." : "Reserve"}
						</button>

						<p className="mt-3 text-center text-sm text-muted-foreground">You wont be charged yet</p>
					</div>
				</div>
			</div>
		</div>
	);
}
