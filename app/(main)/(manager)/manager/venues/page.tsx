"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Trash2, Users, Calendar, Loader2, MapPin, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { fetchVenuesByProfile } from "@/lib/api/venues";
import { deleteVenue } from "@/lib/api/venues";
import { Venue } from "@/types/venue";

export default function ManageVenuesPage() {
	const hasHydrated = useAuthStore((state) => state._hasHydrated);
	const { user, accessToken } = useAuthStore();
	const [venues, setVenues] = useState<Venue[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
	const [showBookingsDialog, setShowBookingsDialog] = useState(false);
	const [selectedVenueBookings, setSelectedVenueBookings] = useState<Venue | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function loadVenues() {
			if (!hasHydrated) return;

			if (!accessToken || !user) {
				setIsLoading(false);
				return;
			}

			try {
				const response = await fetchVenuesByProfile(user.name, accessToken);
				setVenues(response.data);
			} catch (err) {
				console.error("Error loading venues:", err);
				setError(err instanceof Error ? err.message : "Failed to load venues");
			} finally {
				setIsLoading(false);
			}
		}

		loadVenues();
	}, [hasHydrated, user, accessToken]);

	const handleDeleteClick = (venueId: string) => {
		setSelectedVenue(venueId);
		setShowDeleteDialog(true);
	};

	const handleDeleteConfirm = async () => {
		if (!selectedVenue) return;

		if (!accessToken) return;

		setDeletingId(selectedVenue);

		try {
			await deleteVenue(selectedVenue, accessToken);
			setVenues(venues.filter((v) => v.id !== selectedVenue));
			setShowDeleteDialog(false);
			setSelectedVenue(null);
		} catch (err) {
			console.error("Error deleting venue:", err);
			alert(err instanceof Error ? err.message : "Failed to delete venue");
		} finally {
			setDeletingId(null);
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

			{/* Error State */}
			{error && (
				<div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
					<div className="flex items-start gap-3">
						<AlertCircle className="h-5 w-5 text-red-600" />
						<div className="flex-1">
							<h3 className="font-medium text-red-900">Error loading venues</h3>
							<p className="mt-1 text-sm text-red-700">{error}</p>
						</div>
					</div>
				</div>
			)}

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
			) : venues.length === 0 ? (
				// Empty State
				<div className="py-16 text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
						<Plus className="h-8 w-8 text-muted-foreground" />
					</div>
					<h2 className="mb-2 text-xl font-semibold">No venues yet</h2>
					<p className="mb-6 text-muted-foreground">Create your first venue and start accepting bookings!</p>
				</div>
			) : (
				// Venues List
				<div className="space-y-4">
					{venues.map((venue) => (
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
								(() => {
									const upcomingBookings = selectedVenueBookings.bookings.filter((b) => new Date(b.dateTo) >= new Date());

									if (upcomingBookings.length === 0) {
										return <p className="py-8 text-center text-muted-foreground">No upcoming bookings</p>;
									}

									return (
										<div className="space-y-3">
											{upcomingBookings.map((booking) => (
												<BookingItem key={booking.id} booking={booking} />
											))}
										</div>
									);
								})()
							) : (
								<p className="py-8 text-center text-muted-foreground">No bookings yet</p>
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
			<Link href={`/venues/details/${venue.id}`} className="shrink-0">
				<div className="relative h-32 w-full overflow-hidden rounded-lg sm:w-40">
					<Image src={imageUrl} alt={venue.media?.[0]?.alt || venue.name} fill className="object-cover" />
				</div>
			</Link>

			{/* Content */}
			<div className="flex flex-1 flex-col justify-between gap-3">
				<div>
					<div className="mb-1 flex items-start justify-between gap-2">
						<Link href={`/venues/details/${venue.id}`} className="text-lg font-semibold transition-colors hover:text-primary">
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
interface BookingItemProps {
	booking: {
		id: string;
		dateFrom: string;
		dateTo: string;
		guests?: number;
	};
}

function BookingItem({ booking }: BookingItemProps) {
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
				<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
					<Calendar className="h-5 w-5 text-primary" />
				</div>
				<div>
					<p className="font-medium">Booking</p>
					<p className="text-sm text-muted-foreground">
						{formatDate(booking.dateFrom)} - {formatFullDate(booking.dateTo)}
					</p>
				</div>
			</div>
			{booking.guests && (
				<span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
					{booking.guests} guest{booking.guests !== 1 ? "s" : ""}
				</span>
			)}
		</div>
	);
}
