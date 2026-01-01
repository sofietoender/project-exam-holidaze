"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, ArrowLeft } from "lucide-react";

export default function ProfilePage() {
	const [bio, setBio] = useState("");
	const [avatarUrl, setAvatarUrl] = useState("");
	const [bannerUrl, setBannerUrl] = useState("");
	const [venueManager, setVenueManager] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const user = {
		name: "John Doe",
		email: "JohnDoe@stud.noroff.no",
		bio: "Oslo-based venue manager hosting cozy cabins and city apartments.",
		avatar: {
			url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
			alt: "John Doe",
		},
		banner: {
			url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
			alt: "Banner",
		},
		venueManager: true,
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
	};

	return (
		<div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
			{/* Header */}
			<div className="mb-8 flex items-center gap-4">
				<Link href="/" className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-secondary">
					<ArrowLeft className="h-5 w-5" />
				</Link>
				<h1 className="text-3xl font-bold">Profile Settings</h1>
			</div>

			{/* Banner */}
			<div className="relative mb-6 aspect-[3/1] overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100">
				{user.banner?.url && <Image src={user.banner.url} alt={user.banner.alt} fill unoptimized className="object-cover" />}
			</div>

			{/* Avatar + User Info */}
			<div className="mb-8 flex items-center gap-6">
				{/* Avatar */}
				<div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-border bg-muted">
					{user.avatar?.url ? (
						<Image src={user.avatar.url} alt={user.avatar.alt} fill unoptimized className="object-cover" />
					) : (
						<div className="flex h-full w-full items-center justify-center text-2xl font-semibold">{user.name?.charAt(0).toUpperCase()}</div>
					)}
				</div>

				{/* User Info */}
				<div>
					<h2 className="text-xl font-semibold">{user.name}</h2>
					<p className="text-muted-foreground">{user.email}</p>
					{user.venueManager && <span className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Venue Manager</span>}
				</div>
			</div>

			{/* Form */}
			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Bio */}
				<div>
					<label htmlFor="bio" className="block text-sm font-medium">
						Bio
					</label>
					<textarea
						id="bio"
						placeholder="Tell us about yourself..."
						value={bio}
						onChange={(e) => setBio(e.target.value)}
						className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
						rows={3}
					/>
					<p className="mt-1 text-xs text-muted-foreground">Max 160 characters</p>
				</div>

				{/* Avatar URL */}
				<div>
					<label htmlFor="avatarUrl" className="block text-sm font-medium">
						Avatar URL
					</label>
					<input
						id="avatarUrl"
						type="url"
						placeholder="https://example.com/avatar.jpg"
						value={avatarUrl}
						onChange={(e) => setAvatarUrl(e.target.value)}
						className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
					/>
				</div>

				{/* Banner URL */}
				<div>
					<label htmlFor="bannerUrl" className="block text-sm font-medium">
						Banner URL
					</label>
					<input
						id="bannerUrl"
						type="url"
						placeholder="https://example.com/banner.jpg"
						value={bannerUrl}
						onChange={(e) => setBannerUrl(e.target.value)}
						className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
					/>
				</div>

				{/* Venue Manager Toggle */}
				<div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4">
					<div>
						<label htmlFor="venueManager" className="block text-sm font-medium">
							Venue Manager
						</label>
						<p className="mt-1 text-xs text-muted-foreground">Enable this to manage and create venue listings</p>
					</div>
					<button
						type="button"
						role="switch"
						aria-checked={venueManager}
						onClick={() => setVenueManager(!venueManager)}
						className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
							venueManager ? "bg-primary" : "bg-muted-foreground/30"
						}`}
					>
						<span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${venueManager ? "translate-x-5" : "translate-x-0"}`} />
					</button>
				</div>

				{/* Buttons */}
				<div className="flex gap-4">
					<button
						type="submit"
						disabled={isLoading}
						className="flex items-center justify-center rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Save Changes
					</button>
					<Link href="/" className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-6 py-2 text-sm font-medium transition-colors hover:bg-secondary">
						Cancel
					</Link>
				</div>
			</form>
		</div>
	);
}
