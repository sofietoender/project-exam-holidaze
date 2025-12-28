"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, X } from "lucide-react";
import { AMENITIES } from "@/lib/constants";

export default function CreateVenueForm() {
	const [mediaUrls, setMediaUrls] = useState<string[]>([""]);

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

	return (
		<div className="container mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8 md:py-12">
			<h1 className="mb-6 text-2xl font-bold sm:mb-8 sm:text-3xl">Create Venue</h1>

			<form className="space-y-6 sm:space-y-8">
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
							placeholder="Cozy Beach House"
							className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary sm:px-4"
						/>
					</div>

					<div>
						<label htmlFor="description" className="block text-sm font-medium">
							Description *
						</label>
						<textarea
							id="description"
							rows={4}
							placeholder="Describe your venue..."
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
								min={1}
								placeholder="100"
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
								min={1}
								max={100}
								placeholder="4"
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
								<input id={amenity.id} type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary" />
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
								placeholder="USA"
								className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary sm:px-4"
							/>
						</div>
					</div>
				</div>

				{/* Actions */}
				<div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
					<button type="submit" className="flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
						Create Venue
					</button>
					<Link href="/manager/venues" className="flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-sm hover:bg-muted">
						Cancel
					</Link>
				</div>
			</form>
		</div>
	);
}
