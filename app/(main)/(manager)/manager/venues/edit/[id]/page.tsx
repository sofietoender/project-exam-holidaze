"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Plus, X } from "lucide-react";
import { getToken } from "@/lib/auth";
import { fetchVenueById, updateVenue } from "@/lib/api/venues";

export default function EditVenuePage() {
	const router = useRouter();
	const params = useParams();
	const venueId = params.id as string;

	const [isLoading, setIsLoading] = useState(false);
	const [isFetching, setIsFetching] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState(0);
	const [maxGuests, setMaxGuests] = useState(1);
	const [mediaUrls, setMediaUrls] = useState([""]);

	// Amenities
	const [wifi, setWifi] = useState(false);
	const [parking, setParking] = useState(false);
	const [breakfast, setBreakfast] = useState(false);
	const [pets, setPets] = useState(false);

	// Location
	const [address, setAddress] = useState("");
	const [city, setCity] = useState("");
	const [zip, setZip] = useState("");
	const [country, setCountry] = useState("");

	// Fetch venue data
	useEffect(() => {
		async function loadVenue() {
			const token = getToken();
			if (!token) return;

			try {
				const response = await fetchVenueById(venueId);
				const venue = response.data;

				setName(venue.name);
				setDescription(venue.description);
				setPrice(venue.price);
				setMaxGuests(venue.maxGuests);
				setMediaUrls(venue.media.length > 0 ? venue.media.map((m) => m.url) : [""]);

				setWifi(venue.meta.wifi);
				setParking(venue.meta.parking);
				setBreakfast(venue.meta.breakfast);
				setPets(venue.meta.pets);

				setAddress(venue.location.address || "");
				setCity(venue.location.city || "");
				setZip(venue.location.zip || "");
				setCountry(venue.location.country || "");
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to load venue");
			} finally {
				setIsFetching(false);
			}
		}

		loadVenue();
	}, [venueId]);

	const addMediaUrl = () => {
		setMediaUrls([...mediaUrls, ""]);
	};

	const removeMediaUrl = (index: number) => {
		setMediaUrls(mediaUrls.filter((_, i) => i !== index));
	};

	const updateMediaUrl = (index: number, value: string) => {
		const updated = [...mediaUrls];
		updated[index] = value;
		setMediaUrls(updated);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const token = getToken();
		if (!token) return;

		setIsLoading(true);

		try {
			const venueData = {
				name,
				description,
				price,
				maxGuests,
				media: mediaUrls.filter((url) => url.trim() !== "").map((url) => ({ url, alt: name })),
				meta: { wifi, parking, breakfast, pets },
				location: { address, city, zip, country },
			};

			await updateVenue(venueId, venueData, token);
			router.push("/manager/venues");
		} catch (err) {
			alert(err instanceof Error ? err.message : "Failed to update venue");
		} finally {
			setIsLoading(false);
		}
	};

	if (isFetching) {
		return (
			<div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
				<div className="mb-8 h-10 w-48 animate-pulse rounded bg-muted" />
				<div className="space-y-6">
					<div className="h-12 w-full animate-pulse rounded bg-muted" />
					<div className="h-32 w-full animate-pulse rounded bg-muted" />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto max-w-2xl px-4 py-8">
				<div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
			<h1 className="mb-8 text-3xl font-bold">Edit Venue</h1>

			<form onSubmit={handleSubmit} className="space-y-8">
				{/* Basic Info */}
				<div className="space-y-4">
					<h2 className="text-xl font-semibold">Basic Information</h2>

					<div>
						<label htmlFor="name" className="block text-sm font-medium">
							Venue Name *
						</label>
						<input
							id="name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							placeholder="Cozy Beach House"
							className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
						/>
					</div>

					<div>
						<label htmlFor="description" className="block text-sm font-medium">
							Description *
						</label>
						<textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							required
							placeholder="Describe your venue..."
							rows={4}
							className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
						/>
					</div>

					<div className="grid gap-4 sm:grid-cols-2">
						<div>
							<label htmlFor="price" className="block text-sm font-medium">
								Price per night ($) *
							</label>
							<input
								id="price"
								type="number"
								value={price}
								onChange={(e) => setPrice(Number(e.target.value))}
								required
								min={1}
								className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							/>
						</div>
						<div>
							<label htmlFor="maxGuests" className="block text-sm font-medium">
								Max Guests *
							</label>
							<input
								id="maxGuests"
								type="number"
								value={maxGuests}
								onChange={(e) => setMaxGuests(Number(e.target.value))}
								required
								min={1}
								max={100}
								className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							/>
						</div>
					</div>
				</div>

				{/* Media */}
				<div className="space-y-4">
					<h2 className="text-xl font-semibold">Images</h2>
					<p className="text-sm text-muted-foreground">Add image URLs for your venue</p>

					{mediaUrls.map((url, index) => (
						<div key={index} className="flex gap-2">
							<input
								type="url"
								value={url}
								onChange={(e) => updateMediaUrl(index, e.target.value)}
								placeholder="https://example.com/image.jpg"
								className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							/>
							{mediaUrls.length > 1 && (
								<button
									type="button"
									onClick={() => removeMediaUrl(index)}
									className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-secondary"
								>
									<X className="h-4 w-4" />
								</button>
							)}
						</div>
					))}

					<button
						type="button"
						onClick={addMediaUrl}
						className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
					>
						<Plus className="h-4 w-4" />
						Add Image
					</button>
				</div>

				{/* Amenities */}
				<div className="space-y-4">
					<h2 className="text-xl font-semibold">Amenities</h2>

					<div className="grid gap-4 sm:grid-cols-2">
						{[
							{ id: "wifi", label: "WiFi", checked: wifi, onChange: setWifi },
							{ id: "parking", label: "Parking", checked: parking, onChange: setParking },
							{ id: "breakfast", label: "Breakfast", checked: breakfast, onChange: setBreakfast },
							{ id: "pets", label: "Pets Allowed", checked: pets, onChange: setPets },
						].map((amenity) => (
							<div key={amenity.id} className="flex items-center gap-3 rounded-lg border border-border p-4">
								<input
									type="checkbox"
									id={amenity.id}
									checked={amenity.checked}
									onChange={(e) => amenity.onChange(e.target.checked)}
									className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
								/>
								<label htmlFor={amenity.id} className="cursor-pointer text-sm font-medium">
									{amenity.label}
								</label>
							</div>
						))}
					</div>
				</div>

				{/* Location */}
				<div className="space-y-4">
					<h2 className="text-xl font-semibold">Location</h2>

					<div>
						<label htmlFor="address" className="block text-sm font-medium">
							Address
						</label>
						<input
							id="address"
							type="text"
							value={address}
							onChange={(e) => setAddress(e.target.value)}
							placeholder="123 Beach Road"
							className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
						/>
					</div>

					<div className="grid gap-4 sm:grid-cols-3">
						<div>
							<label htmlFor="city" className="block text-sm font-medium">
								City
							</label>
							<input
								id="city"
								type="text"
								value={city}
								onChange={(e) => setCity(e.target.value)}
								placeholder="Miami"
								className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							/>
						</div>
						<div>
							<label htmlFor="zip" className="block text-sm font-medium">
								ZIP Code
							</label>
							<input
								id="zip"
								type="text"
								value={zip}
								onChange={(e) => setZip(e.target.value)}
								placeholder="12345"
								className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							/>
						</div>
						<div>
							<label htmlFor="country" className="block text-sm font-medium">
								Country
							</label>
							<input
								id="country"
								type="text"
								value={country}
								onChange={(e) => setCountry(e.target.value)}
								placeholder="USA"
								className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							/>
						</div>
					</div>
				</div>

				{/* Actions */}
				<div className="flex gap-4">
					<button
						type="submit"
						disabled={isLoading}
						className="flex items-center justify-center rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Save Changes
					</button>
					<Link
						href="/manager/venues"
						className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-6 py-2 text-sm font-medium transition-colors hover:bg-secondary"
					>
						Cancel
					</Link>
				</div>
			</form>
		</div>
	);
}
