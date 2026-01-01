"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Users, Trash2, Loader2 } from "lucide-react";

// API Response types
interface Booking {
	id: string;
	dateFrom: string;
	dateTo: string;
	guests: number;
	created: string;
	updated: string;
	venue: {
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
			continent?: string;
			lat?: number;
			lng?: number;
		};
	};
}

// Dummy bookings matching API structure
const dummyBookings: Booking[] = [
	{
		id: "b1",
		dateFrom: "2026-02-15T00:00:00.000Z",
		dateTo: "2026-02-20T00:00:00.000Z",
		guests: 2,
		created: "2026-01-01T00:00:00.000Z",
		updated: "2026-01-01T00:00:00.000Z",
		venue: {
			id: "v1",
			name: "Cozy Beach House",
			description: "Beautiful beachfront property",
			media: [
				{
					url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2",
					alt: "Beach house exterior",
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
				city: "Miami",
				country: "USA",
			},
		},
	},
	{
		id: "b2",
		dateFrom: "2026-03-10T00:00:00.000Z",
		dateTo: "2026-03-15T00:00:00.000Z",
		guests: 4,
		created: "2026-01-01T00:00:00.000Z",
		updated: "2026-01-01T00:00:00.000Z",
		venue: {
			id: "v2",
			name: "Mountain Cabin Retreat",
			description: "Secluded mountain getaway",
			media: [
				{
					url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
					alt: "Mountain cabin",
				},
			],
			price: 200,
			maxGuests: 4,
			rating: 4.9,
			meta: {
				wifi: true,
				parking: true,
				breakfast: true,
				pets: false,
			},
			location: {
				city: "Aspen",
				country: "USA",
			},
		},
	},
	{
		id: "b3",
		dateFrom: "2025-12-01T00:00:00.000Z",
		dateTo: "2025-12-05T00:00:00.000Z",
		guests: 2,
		created: "2025-11-01T00:00:00.000Z",
		updated: "2025-11-01T00:00:00.000Z",
		venue: {
			id: "v3",
			name: "City Center Apartment",
			description: "Modern apartment in the heart of the city",
			media: [
				{
					url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
					alt: "City apartment",
				},
			],
			price: 120,
			maxGuests: 2,
			rating: 4.7,
			meta: {
				wifi: true,
				parking: false,
				breakfast: false,
				pets: true,
			},
			location: {
				city: "New York",
				country: "USA",
			},
		},
	},
];

export default function BookingsPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

	// Check if booking is in the past
	const isPastBooking = (dateTo: string) => {
		return new Date(dateTo) < new Date();
	};

	const upcomingBookings = dummyBookings.filter((b) => !isPastBooking(b.dateTo));
	const pastBookings = dummyBookings.filter((b) => isPastBooking(b.dateTo));

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
	};

	const handleDeleteClick = (bookingId: string) => {
		setSelectedBooking(bookingId);
		setShowDeleteDialog(true);
	};

	const handleDeleteConfirm = () => {
		if (selectedBooking) {
			setDeletingId(selectedBooking);
			// API call kommer senere
			setTimeout(() => {
				setDeletingId(null);
				setShowDeleteDialog(false);
				setSelectedBooking(null);
				alert("Booking deleted (API integration kommer senere)");
			}, 1000);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8 md:py-12">
			<h1 className="mb-8 text-3xl font-bold">My Bookings</h1>

			{/* Loading State */}
			{isLoading ? (
				<div className="space-y-4">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="flex gap-4 rounded-xl border border-border bg-card p-4">
							<div className="h-24 w-32 animate-pulse rounded-lg bg-muted" />
							<div className="flex-1 space-y-2">
								<div className="h-6 w-48 animate-pulse rounded bg-muted" />
								<div className="h-4 w-32 animate-pulse rounded bg-muted" />
								<div className="h-4 w-24 animate-pulse rounded bg-muted" />
							</div>
						</div>
					))}
				</div>
			) : dummyBookings.length === 0 ? (
				// Empty State
				<div className="py-16 text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
						<Calendar className="h-8 w-8 text-muted-foreground" />
					</div>
					<h2 className="mb-2 text-xl font-semibold">No bookings yet</h2>
					<p className="mb-6 text-muted-foreground">Start exploring venues and book your next getaway!</p>
					<Link href="/venues" className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
						Explore Venues
					</Link>
				</div>
			) : (
				<div className="space-y-8">
					{/* Upcoming Bookings */}
					{upcomingBookings.length > 0 && (
						<div>
							<h2 className="mb-4 text-xl font-semibold">Upcoming</h2>
							<div className="space-y-4">
								{upcomingBookings.map((booking) => (
									<BookingCard key={booking.id} booking={booking} onDelete={handleDeleteClick} isDeleting={deletingId === booking.id} />
								))}
							</div>
						</div>
					)}

					{/* Past Bookings */}
					{pastBookings.length > 0 && (
						<div>
							<h2 className="mb-4 text-xl font-semibold text-muted-foreground">Past</h2>
							<div className="space-y-4">
								{pastBookings.map((booking) => (
									<BookingCard key={booking.id} booking={booking} isPast />
								))}
							</div>
						</div>
					)}
				</div>
			)}

			{/* Delete Dialog */}
			{showDeleteDialog && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
					<div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
						<h2 className="mb-2 text-xl font-semibold">Cancel booking?</h2>
						<p className="mb-6 text-sm text-muted-foreground">This will cancel your reservation. This action cannot be undone.</p>
						<div className="flex justify-end gap-3">
							<button onClick={() => setShowDeleteDialog(false)} className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">
								Keep booking
							</button>
							<button
								onClick={handleDeleteConfirm}
								disabled={!!deletingId}
								className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{deletingId ? "Cancelling..." : "Cancel booking"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

// Booking Card Component
interface BookingCardProps {
	booking: Booking;
	onDelete?: (id: string) => void;
	isDeleting?: boolean;
	isPast?: boolean;
}

function BookingCard({ booking, onDelete, isDeleting, isPast }: BookingCardProps) {
	const venue = booking.venue;
	const imageUrl = venue?.media?.[0]?.url || "/placeholder.svg";
	const location = [venue?.location?.city, venue?.location?.country].filter(Boolean).join(", ") || "Location not specified";

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
	};

	const formatFullDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
	};

	return (
		<div className={`flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row ${isPast ? "opacity-60" : ""}`}>
			{/* Image */}
			<Link href={`/venues/${venue?.id}`} className="shrink-0">
				<div className="relative h-32 w-full overflow-hidden rounded-lg sm:w-40">
					<Image src={imageUrl} alt={venue?.media?.[0]?.alt || venue?.name} fill unoptimized className="object-cover" />
				</div>
			</Link>

			{/* Content */}
			<div className="flex flex-1 flex-col justify-between gap-3">
				<div>
					<div className="mb-1 flex items-start justify-between gap-2">
						<Link href={`/venues/${venue?.id}`} className="text-lg font-semibold transition-colors hover:text-primary">
							{venue?.name}
						</Link>
						{!isPast && <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">Upcoming</span>}
					</div>
					<div className="flex items-center gap-1 text-sm text-muted-foreground">
						<MapPin className="h-3.5 w-3.5" />
						<span>{location}</span>
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-4 text-sm">
					<div className="flex items-center gap-1.5">
						<Calendar className="h-4 w-4 text-muted-foreground" />
						<span>
							{formatDate(booking.dateFrom)} - {formatFullDate(booking.dateTo)}
						</span>
					</div>
					<div className="flex items-center gap-1.5">
						<Users className="h-4 w-4 text-muted-foreground" />
						<span>
							{booking.guests} guest{booking.guests !== 1 ? "s" : ""}
						</span>
					</div>
				</div>
			</div>

			{/* Delete Button (only for upcoming) */}
			{!isPast && onDelete && (
				<div className="flex items-center">
					<button
						type="button"
						onClick={() => onDelete(booking.id)}
						disabled={isDeleting}
						className="flex h-10 w-10 items-center justify-center rounded-lg text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
					</button>
				</div>
			)}
		</div>
	);
}
