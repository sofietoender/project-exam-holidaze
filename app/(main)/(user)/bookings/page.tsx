"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Users, Trash2, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { fetchBookingsByProfile, deleteBooking } from "@/lib/api/bookings";
import { Booking } from "@/types/booking";
import { useRouter } from "next/navigation";

export default function BookingsPage() {
	const router = useRouter();
	const hasHydrated = useAuthStore((state) => state._hasHydrated);
	const { user, accessToken } = useAuthStore();
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function loadBookings() {
			if (!hasHydrated) return;

			if (!accessToken || !user) {
				router.push("/login");
				return;
			}

			try {
				const response = await fetchBookingsByProfile(user.name, accessToken);
				setBookings(response.data);
			} catch (err) {
				console.error("Error loading bookings:", err);
				setError(err instanceof Error ? err.message : "Failed to load bookings");
			} finally {
				setIsLoading(false);
			}
		}

		loadBookings();
	}, [router, user, accessToken, hasHydrated]);

	const isPastBooking = (dateTo: string) => {
		return new Date(dateTo) < new Date();
	};

	const upcomingBookings = bookings.filter((b) => !isPastBooking(b.dateTo));
	const pastBookings = bookings.filter((b) => isPastBooking(b.dateTo));

	const handleDeleteClick = (bookingId: string) => {
		setSelectedBooking(bookingId);
		setShowDeleteDialog(true);
	};

	const handleDeleteConfirm = async () => {
		if (!selectedBooking) return;

		if (!accessToken) {
			router.push("/login");
			return;
		}

		setDeletingId(selectedBooking);

		try {
			await deleteBooking(selectedBooking, accessToken);

			// Remove from state
			setBookings(bookings.filter((b) => b.id !== selectedBooking));

			setShowDeleteDialog(false);
			setSelectedBooking(null);
		} catch (err) {
			console.error("Error deleting booking:", err);
			alert(err instanceof Error ? err.message : "Failed to delete booking");
		} finally {
			setDeletingId(null);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8 md:py-12">
			<h1 className="mb-8 text-3xl font-bold">My Bookings</h1>

			{/* Error State */}
			{error && <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>}

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
			) : bookings.length === 0 ? (
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
			<Link href={`/venues/details/${venue?.id}`} className="shrink-0">
				<div className="relative h-32 w-full overflow-hidden rounded-lg sm:w-40">
					<Image src={imageUrl} alt={venue?.media?.[0]?.alt || venue?.name || "Venue"} fill className="object-cover" />
				</div>
			</Link>

			{/* Content */}
			<div className="flex flex-1 flex-col justify-between gap-3">
				<div>
					<div className="mb-1 flex items-start justify-between gap-2">
						<Link href={`/venues/details/${venue?.id}`} className="text-lg font-semibold transition-colors hover:text-primary">
							{venue?.name || "Venue"}
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
