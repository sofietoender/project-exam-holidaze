"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, X, Loader2 } from "lucide-react";
import { AMENITIES } from "@/lib/constants";
import { createVenue } from "@/lib/api/venues";
import { getToken } from "@/lib/auth";

export default function CreateVenueForm() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Form state
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");
	const [maxGuests, setMaxGuests] = useState("");
	const [mediaUrls, setMediaUrls] = useState<string[]>([""]);
	const [amenities, setAmenities] = useState({
		wifi: false,
		parking: false,
		breakfast: false,
		pets: false,
	});
	const [location, setLocation] = useState({
		address: "",
		city: "",
		zip: "",
		country: "",
	});

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

	const handleAmenityChange = (amenity: keyof typeof amenities) => {
		setAmenities((prev) => ({
			...prev,
			[amenity]: !prev[amenity],
		}));
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError(null);

		// Validation
		if (!name.trim()) {
			setError("Venue name is required");
			return;
		}
		if (!description.trim()) {
			setError("Description is required");
			return;
		}
		if (!price || Number(price) < 1) {
			setError("Valid price is required");
			return;
		}
		if (!maxGuests || Number(maxGuests) < 1) {
			setError("Valid max guests is required");
			return;
		}

		const token = getToken();
		if (!token) {
			setError("You must be logged in to create a venue");
			return;
		}

		setIsSubmitting(true);

		try {
			// Build media array - filter out empty URLs
			const media = mediaUrls
				.filter((url) => url.trim() !== "")
				.map((url) => ({
					url: url.trim(),
					alt: name, // Use venue name as alt text
				}));

			// Build venue data
			const venueData = {
				name: name.trim(),
				description: description.trim(),
				price: Number(price),
				maxGuests: Number(maxGuests),
				media,
				meta: amenities,
				location: {
					address: location.address.trim() || undefined,
					city: location.city.trim() || undefined,
					zip: location.zip.trim() || undefined,
					country: location.country.trim() || undefined,
				},
			};

			await createVenue(venueData, token);

			// Redirect to manage venues on success
			router.push("/manager/venues");
		} catch (err) {
			console.error("Error creating venue:", err);
			setError(err instanceof Error ? err.message : "Failed to create venue");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="container mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8 md:py-12">
			<h1 className="mb-6 text-2xl font-bold sm:mb-8 sm:text-3xl">Create Venue</h1>

			{error && (
				<div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
					<p className="text-sm text-red-700">{error}</p>
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
				{/* Basic Info */}
				<div className="space-y-4">
					<h2 className="text-lg font-semibold sm:text-xl">Basic Information</h2>

					<div>
						<label htmlFor="name" className="block text-sm font-medium">
							Venue Name *
						</label>
						<input
							id="name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Cozy Beach House"
							required
							className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary sm:px-4"
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
							rows={4}
							placeholder="Describe your venue..."
							required
							className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary sm:px-4"
						/>
					</div>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<label htmlFor="price" className="block text-sm font-medium">
								Price per night ($) *
							</label>
							<input
								id="price"
								type="number"
								value={price}
								onChange={(e) => setPrice(e.target.value)}
								min={1}
								placeholder="100"
								required
								className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary sm:px-4"
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
								onChange={(e) => setMaxGuests(e.target.value)}
								min={1}
								max={100}
								placeholder="4"
								required
								className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary sm:px-4"
							/>
						</div>
					</div>
				</div>

				{/* Media */}
				<div className="space-y-4">
					<h2 className="text-lg font-semibold sm:text-xl">Images</h2>
					<p className="text-sm text-muted-foreground">Add image URLs for your venue</p>

					{mediaUrls.map((url, index) => (
						<div key={index} className="flex gap-2">
							<input
								type="url"
								value={url}
								onChange={(e) => updateMediaUrl(index, e.target.value)}
								placeholder="https://example.com/image.jpg"
								className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary sm:px-4"
							/>
							{mediaUrls.length > 1 && (
								<button type="button" onClick={() => removeMediaUrl(index)} className="shrink-0 rounded-lg border border-border bg-background px-3 py-2 hover:bg-muted">
									<X className="h-4 w-4" />
								</button>
							)}
						</div>
					))}

					<button type="button" onClick={addMediaUrl} className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm hover:bg-muted sm:px-4">
						<Plus className="h-4 w-4" />
						Add Image
					</button>
				</div>

				{/* Amenities */}
				<div className="space-y-4">
					<h2 className="text-lg font-semibold sm:text-xl">Amenities</h2>

					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
						{AMENITIES.map((amenity) => (
							<div key={amenity.id} className="flex items-center gap-3 rounded-lg border p-3 sm:p-4">
								<input
									id={amenity.id}
									type="checkbox"
									checked={amenities[amenity.id as keyof typeof amenities]}
									onChange={() => handleAmenityChange(amenity.id as keyof typeof amenities)}
									className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
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
					<h2 className="text-lg font-semibold sm:text-xl">Location</h2>

					<div>
						<label htmlFor="address" className="block text-sm font-medium">
							Address
						</label>
						<input
							id="address"
							type="text"
							value={location.address}
							onChange={(e) => setLocation({ ...location, address: e.target.value })}
							placeholder="123 Beach Road"
							className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary sm:px-4"
						/>
					</div>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
						<div>
							<label htmlFor="city" className="block text-sm font-medium">
								City
							</label>
							<input
								id="city"
								type="text"
								value={location.city}
								onChange={(e) => setLocation({ ...location, city: e.target.value })}
								placeholder="Miami"
								className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary sm:px-4"
							/>
						</div>
						<div>
							<label htmlFor="zip" className="block text-sm font-medium">
								ZIP Code
							</label>
							<input
								id="zip"
								type="text"
								value={location.zip}
								onChange={(e) => setLocation({ ...location, zip: e.target.value })}
								placeholder="12345"
								className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary sm:px-4"
							/>
						</div>
						<div>
							<label htmlFor="country" className="block text-sm font-medium">
								Country
							</label>
							<input
								id="country"
								type="text"
								value={location.country}
								onChange={(e) => setLocation({ ...location, country: e.target.value })}
								placeholder="USA"
								className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary sm:px-4"
							/>
						</div>
					</div>
				</div>

				{/* Actions */}
				<div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
					<button
						type="submit"
						disabled={isSubmitting}
						className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isSubmitting ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin" />
								Creating...
							</>
						) : (
							"Create Venue"
						)}
					</button>
					<Link href="/manager/venues" className="flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-sm hover:bg-muted">
						Cancel
					</Link>
				</div>
			</form>
		</div>
	);
}
