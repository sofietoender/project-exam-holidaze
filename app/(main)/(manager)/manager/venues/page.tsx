"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Trash2, Users, Calendar, Loader2, MapPin } from "lucide-react";

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
	created: string;
	updated: string;
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
	bookings?: Array<{
		id: string;
		dateFrom: string;
		dateTo: string;
		guests: number;
		customer?: {
			name: string;
			email: string;
		};
	}>;
}

// Dummy venues matching API structure
const dummyVenues: Venue[] = [
	{
		id: "v1",
		name: "Cozy Beach House",
		description: "Beautiful beachfront property with stunning ocean views",
		media: [
			{
				url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2",
				alt: "Beach house exterior",
			},
		],
		price: 150,
		maxGuests: 6,
		rating: 4.8,
		created: "2025-01-01T00:00:00.000Z",
		updated: "2025-01-01T00:00:00.000Z",
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
		bookings: [
			{
				id: "b1",
				dateFrom: "2026-02-15T00:00:00.000Z",
				dateTo: "2026-02-20T00:00:00.000Z",
				guests: 2,
				customer: {
					name: "John Doe",
					email: "john@example.com",
				},
			},
			{
				id: "b2",
				dateFrom: "2026-03-10T00:00:00.000Z",
				dateTo: "2026-03-15T00:00:00.000Z",
				guests: 4,
				customer: {
					name: "Jane Smith",
					email: "jane@example.com",
				},
			},
		],
	},
	{
		id: "v2",
		name: "Mountain Cabin Retreat",
		description: "Secluded mountain getaway perfect for relaxation",
		media: [
			{
				url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
				alt: "Mountain cabin",
			},
		],
		price: 200,
		maxGuests: 4,
		rating: 4.9,
		created: "2025-01-01T00:00:00.000Z",
		updated: "2025-01-01T00:00:00.000Z",
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
		bookings: [],
	},
];

export default function ManageVenuesPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
	const [showBookingsDialog, setShowBookingsDialog] = useState(false);
	const [selectedVenueBookings, setSelectedVenueBookings] = useState<Venue | null>(null);

	const handleDeleteClick = (venueId: string) => {
		setSelectedVenue(venueId);
		setShowDeleteDialog(true);
	};

	const handleDeleteConfirm = () => {
		if (selectedVenue) {
			setDeletingId(selectedVenue);
			// API call kommer senere
			setTimeout(() => {
				setDeletingId(null);
				setShowDeleteDialog(false);
				setSelectedVenue(null);
				alert("Venue deleted (API integration kommer senere)");
			}, 1000);
		}
	};

	const handleShowBookings = (venue: Venue) => {
		setSelectedVenueBookings(venue);
		setShowBookingsDialog(true);
	};

	return (
		<div className="container mx-auto px-4 py-8 md:py-12">
			{/* Header */}
			<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-3xl font-bold">Manage Venues</h1>
					<p className="text-muted-foreground">Create and manage your venues</p>
				</div>
				<Link
					href="/manager/venues/create"
					className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
				>
					<Plus className="mr-2 h-4 w-4" />
					Create Venue
				</Link>
			</div>

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
			) : dummyVenues.length === 0 ? (
				// Empty State
				<div className="py-16 text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
						<Plus className="h-8 w-8 text-muted-foreground" />
					</div>
					<h2 className="mb-2 text-xl font-semibold">No venues yet</h2>
					<p className="mb-6 text-muted-foreground">Create your first venue and start accepting bookings!</p>
					<Link
						href="/manager/venues/create"
						className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
					>
						Create Venue
					</Link>
				</div>
			) : (
				// Venues List
				<div className="space-y-4">
					{dummyVenues.map((venue) => (
						<VenueManageCard key={venue.id} venue={venue} onDelete={handleDeleteClick} onShowBookings={handleShowBookings} isDeleting={deletingId === venue.id} />
					))}
				</div>
			)}

			{/* Delete Dialog */}
			{showDeleteDialog && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
					<div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
						<h2 className="mb-2 text-xl font-semibold">Delete venue?</h2>
						<p className="mb-6 text-sm text-muted-foreground">This will permanently delete this venue and all its bookings. This action cannot be undone.</p>
						<div className="flex justify-end gap-3">
							<button onClick={() => setShowDeleteDialog(false)} className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">
								Cancel
							</button>
							<button
								onClick={handleDeleteConfirm}
								disabled={!!deletingId}
								className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{deletingId ? "Deleting..." : "Delete"}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Bookings Dialog */}
			{showBookingsDialog && selectedVenueBookings && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
					<div className="w-full max-w-lg rounded-lg bg-background shadow-lg">
						<div className="border-b border-border p-6">
							<h2 className="text-xl font-semibold">Bookings for {selectedVenueBookings.name}</h2>
						</div>
						<div className="max-h-[400px] overflow-y-auto p-6">
							{selectedVenueBookings.bookings && selectedVenueBookings.bookings.length > 0 ? (
								<div className="space-y-3">
									{selectedVenueBookings.bookings
										.filter((b) => new Date(b.dateTo) >= new Date())
										.map((booking) => (
											<BookingItem key={booking.id} booking={booking} />
										))}
								</div>
							) : (
								<p className="py-8 text-center text-muted-foreground">No upcoming bookings</p>
							)}
						</div>
						<div className="border-t border-border p-6">
							<button onClick={() => setShowBookingsDialog(false)} className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

// Venue Card Component
interface VenueManageCardProps {
	venue: Venue;
	onDelete: (id: string) => void;
	onShowBookings: (venue: Venue) => void;
	isDeleting: boolean;
}

function VenueManageCard({ venue, onDelete, onShowBookings, isDeleting }: VenueManageCardProps) {
	const imageUrl = venue.media?.[0]?.url || "/placeholder.svg";
	const location = [venue.location?.city, venue.location?.country].filter(Boolean).join(", ") || "Location not specified";
	const upcomingBookings = venue.bookings?.filter((b) => new Date(b.dateTo) >= new Date()) || [];

	return (
		<div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row">
			{/* Image */}
			<Link href={`/venues/${venue.id}`} className="shrink-0">
				<div className="relative h-32 w-full overflow-hidden rounded-lg sm:w-40">
					<Image src={imageUrl} alt={venue.media?.[0]?.alt || venue.name} fill unoptimized className="object-cover" />
				</div>
			</Link>

			{/* Content */}
			<div className="flex flex-1 flex-col justify-between gap-3">
				<div>
					<div className="mb-1 flex items-start justify-between gap-2">
						<Link href={`/venues/${venue.id}`} className="text-lg font-semibold transition-colors hover:text-primary">
							{venue.name}
						</Link>
						<span className="font-semibold text-primary">${venue.price}/night</span>
					</div>
					<div className="flex items-center gap-1 text-sm text-muted-foreground">
						<MapPin className="h-3.5 w-3.5" />
						<span>{location}</span>
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-4 text-sm">
					<div className="flex items-center gap-1.5">
						<Users className="h-4 w-4 text-muted-foreground" />
						<span>Up to {venue.maxGuests} guests</span>
					</div>
					<button onClick={() => onShowBookings(venue)} className="flex items-center gap-1.5 text-primary transition-colors hover:underline">
						<Calendar className="h-4 w-4" />
						<span>
							{upcomingBookings.length} upcoming booking{upcomingBookings.length !== 1 ? "s" : ""}
						</span>
					</button>
				</div>
			</div>

			{/* Actions */}
			<div className="flex items-center gap-2 sm:flex-col">
				<Link
					href={`/manager/venues/edit/${venue.id}`}
					className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary sm:flex-none"
				>
					<Edit className="h-4 w-4" />
					Edit
				</Link>
				<button
					onClick={() => onDelete(venue.id)}
					disabled={isDeleting}
					className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
				>
					{isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
					Delete
				</button>
			</div>
		</div>
	);
}

// Booking Item Component
function BookingItem({ booking }: { booking: { id: string; dateFrom: string; dateTo: string; guests: number; customer?: { name: string; email: string } } }) {
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
	};

	const formatFullDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
	};

	return (
		<div className="flex items-center justify-between rounded-lg border border-border p-3">
			<div className="flex items-center gap-3">
				{booking.customer && (
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
						<span className="text-sm font-medium text-primary">{booking.customer.name?.charAt(0).toUpperCase()}</span>
					</div>
				)}
				<div>
					<p className="font-medium">{booking.customer?.name || "Guest"}</p>
					<p className="text-sm text-muted-foreground">
						{formatDate(booking.dateFrom)} - {formatFullDate(booking.dateTo)}
					</p>
				</div>
			</div>
			<span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
				{booking.guests} guest{booking.guests !== 1 ? "s" : ""}
			</span>
		</div>
	);
}
