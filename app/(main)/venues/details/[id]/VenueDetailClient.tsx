"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MapPin, Star, Users, Wifi, Car, Coffee, PawPrint, ChevronLeft, ChevronRight } from "lucide-react";
import { AMENITIES } from "@/lib/constants";
import { Venue } from "@/types/venue";
import { getToken, getUser } from "@/lib/auth";
import { createBooking } from "@/lib/api/bookings";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface VenueDetailClientProps {
	venue: Venue;
}

const AMENITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
	wifi: Wifi,
	parking: Car,
	breakfast: Coffee,
	pets: PawPrint,
};

function isSameDay(a: Date, b: Date) {
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatDateToISO(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export default function VenueDetailClient({ venue }: VenueDetailClientProps) {
	const router = useRouter();
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [checkIn, setCheckIn] = useState<Date | null>(null);
	const [checkOut, setCheckOut] = useState<Date | null>(null);
	const [guests, setGuests] = useState(1);
	const [isBooking, setIsBooking] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Sjekk om bruker er logget inn
	const token = getToken();
	const user = getUser();
	const isLoggedIn = !!token && !!user;

	const images = venue.media?.length ? venue.media : [{ url: "/placeholder.svg", alt: venue.name }];

	const location = [venue.location?.address, venue.location?.city, venue.location?.country].filter(Boolean).join(", ") || "Location not specified";

	const amenities = AMENITIES.map((amenity) => ({
		...amenity,
		icon: AMENITY_ICONS[amenity.id],
		available: venue.meta?.[amenity.id as keyof typeof venue.meta] || false,
	}));

	const bookedDates = useMemo(() => {
		const bookings = venue.bookings ?? [];
		const days: Date[] = [];

		for (const b of bookings) {
			const start = new Date(b.dateFrom);
			const end = new Date(b.dateTo);

			const current = new Date(start.getFullYear(), start.getMonth(), start.getDate());
			const last = new Date(end.getFullYear(), end.getMonth(), end.getDate());

			while (current <= last) {
				days.push(new Date(current));
				current.setDate(current.getDate() + 1);
			}
		}

		const unique: Date[] = [];
		for (const d of days) {
			if (!unique.some((u) => isSameDay(u, d))) unique.push(d);
		}
		return unique;
	}, [venue.bookings]);

	const calculateNights = () => {
		if (!checkIn || !checkOut) return 0;
		const start = new Date(checkIn.getFullYear(), checkIn.getMonth(), checkIn.getDate());
		const end = new Date(checkOut.getFullYear(), checkOut.getMonth(), checkOut.getDate());
		const diffMs = end.getTime() - start.getTime();
		if (diffMs <= 0) return 0;
		return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
	};

	const nights = calculateNights();
	const totalPrice = nights * venue.price;

	const handleBooking = async () => {
		setError(null);

		if (!isLoggedIn) {
			setError("You must be logged in to make a booking");
			router.push("/login");
			return;
		}

		// Sjekk om det er venueManager som prøver å booke sitt eget venue
		if (user?.venueManager && venue.owner?.email === user.email) {
			setError("You cannot book your own venue");
			return;
		}

		if (!checkIn || !checkOut) {
			setError("Please select check-in and check-out dates");
			return;
		}

		// Sjekk om valgte datoer overlapper med eksisterende bookings
		const isDateBooked = bookedDates.some((bookedDate) => {
			const checkInTime = checkIn.getTime();
			const checkOutTime = checkOut.getTime();
			const bookedTime = bookedDate.getTime();

			// Sjekk om bookedDate er mellom checkIn og checkOut (inklusiv)
			return bookedTime >= checkInTime && bookedTime <= checkOutTime;
		});

		if (isDateBooked) {
			setError("Selected dates are not available. Please choose different dates.");
			return;
		}

		setIsBooking(true);

		try {
			const bookingData = {
				dateFrom: formatDateToISO(checkIn),
				dateTo: formatDateToISO(checkOut),
				guests,
				venueId: venue.id,
			};

			await createBooking(bookingData, token);

			router.push("/bookings");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to create booking");
			setIsBooking(false);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Image Gallery */}
			<div className="relative mb-8 overflow-hidden rounded-2xl bg-muted">
				<div className="relative aspect-video md:aspect-21/9">
					<Image
						src={images[selectedImageIndex]?.url}
						alt={images[selectedImageIndex]?.alt || venue.name}
						fill
						className="object-cover"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
						priority
						loading="eager"
					/>
					{images.length > 1 && (
						<>
							<button
								onClick={() => setSelectedImageIndex((i) => (i === 0 ? images.length - 1 : i - 1))}
								className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg transition-colors hover:bg-white"
								aria-label="Previous image"
							>
								<ChevronLeft className="h-5 w-5" />
							</button>
							<button
								onClick={() => setSelectedImageIndex((i) => (i === images.length - 1 ? 0 : i + 1))}
								className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg transition-colors hover:bg-white"
								aria-label="Next image"
							>
								<ChevronRight className="h-5 w-5" />
							</button>
						</>
					)}
				</div>
				{images.length > 1 && (
					<div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
						{images.map((_, index) => (
							<button
								key={index}
								className={`h-2 w-2 rounded-full transition-colors ${index === selectedImageIndex ? "bg-white" : "bg-white/50"}`}
								onClick={() => setSelectedImageIndex(index)}
								aria-label={`Go to image ${index + 1}`}
							/>
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
									<Image src={venue.owner.avatar.url} alt={venue.owner.avatar.alt || venue.owner.name} fill className="object-cover" />
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

					{/* Amenities */}
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

						{/* Error message */}
						{error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

						{/* Date pickers */}
						<div className="mb-4 space-y-4">
							<div>
								<label className="mb-2 block text-sm font-medium">Check-in</label>
								<DatePicker
									selected={checkIn}
									onChange={(date: Date | null) => {
										setCheckIn(date);
										setCheckOut(null);
										setError(null);
									}}
									selectsStart
									startDate={checkIn}
									endDate={checkOut}
									minDate={new Date()}
									excludeDates={bookedDates}
									placeholderText="Select check-in date"
									className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
									wrapperClassName="w-full"
									dateFormat="yyyy-MM-dd"
								/>
							</div>

							<div>
								<label className="mb-2 block text-sm font-medium">Check-out</label>
								<DatePicker
									selected={checkOut}
									onChange={(date: Date | null) => {
										setCheckOut(date);
										setError(null);
									}}
									selectsEnd
									startDate={checkIn}
									endDate={checkOut}
									minDate={checkIn || new Date()}
									excludeDates={bookedDates}
									placeholderText="Select check-out date"
									className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
									wrapperClassName="w-full"
									dateFormat="yyyy-MM-dd"
									disabled={!checkIn}
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
							disabled={isBooking || (!isLoggedIn ? false : !checkIn || !checkOut || nights <= 0)}
							className="w-full rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isBooking ? "Booking..." : isLoggedIn ? "Reserve" : "Log in to book"}
						</button>

						{!isLoggedIn && <p className="mt-3 text-center text-sm text-muted-foreground">You need to be logged in to make a booking</p>}

						{isLoggedIn && <p className="mt-3 text-center text-sm text-muted-foreground">You won&apos;t be charged yet</p>}
					</div>
				</div>
			</div>
		</div>
	);
}
