"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, ArrowLeft, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { fetchProfile, updateProfile } from "@/lib/api/profiles";
import { Profile, UpdateProfileData } from "@/types/profiles";
import { ImageEditModal } from "@/components/ImageEditModal";

export default function ProfilePage() {
	const { user, accessToken, setAuth } = useAuthStore();
	const [profile, setProfile] = useState<Profile | null>(null);
	const [bio, setBio] = useState("");
	const [avatarUrl, setAvatarUrl] = useState("");
	const [avatarAlt, setAvatarAlt] = useState("");
	const [bannerUrl, setBannerUrl] = useState("");
	const [bannerAlt, setBannerAlt] = useState("");
	const [venueManager, setVenueManager] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isFetching, setIsFetching] = useState(true);

	// Modal states
	const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
	const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);

	useEffect(() => {
		loadProfile();
	}, []);

	const loadProfile = async () => {
		try {
			setIsFetching(true);

			if (!user || !accessToken) {
				toast.error("You must be logged in to view your profile");
				setIsFetching(false);
				return;
			}

			const response = await fetchProfile(user.name, accessToken);
			const profileData = response.data;

			setProfile(profileData);
			setBio(profileData.bio || "");
			setAvatarUrl(profileData.avatar?.url || "");
			setAvatarAlt(profileData.avatar?.alt || "");
			setBannerUrl(profileData.banner?.url || "");
			setBannerAlt(profileData.banner?.alt || "");
			setVenueManager(profileData.venueManager || false);
		} catch (err) {
			console.error("Error loading profile:", err);
			toast.error(err instanceof Error ? err.message : "Could not load profile");
		} finally {
			setIsFetching(false);
		}
	};

	const handleSaveAvatar = async (url: string, alt: string) => {
		setAvatarUrl(url);
		setAvatarAlt(alt);
		await updateProfileImage("avatar", url, alt);
	};

	const handleSaveBanner = async (url: string, alt: string) => {
		setBannerUrl(url);
		setBannerAlt(alt);
		await updateProfileImage("banner", url, alt);
	};

	const updateProfileImage = async (type: "avatar" | "banner", url: string, alt: string) => {
		try {
			if (!user || !accessToken) {
				throw new Error("You must be logged in");
			}

			const updateData: UpdateProfileData = {};

			if (type === "avatar") {
				updateData.avatar = {
					url: url.trim(),
					alt: alt.trim() || "Profile avatar",
				};
			} else {
				updateData.banner = {
					url: url.trim(),
					alt: alt.trim() || "Profile banner",
				};
			}

			const response = await updateProfile(user.name, updateData, accessToken);
			setProfile(response.data);

			// Update Zustand store
			const updatedUser = {
				...user,
				avatar: response.data.avatar,
				banner: response.data.banner,
			};
			setAuth(updatedUser);

			toast.success(`${type === "avatar" ? "Avatar" : "Banner"} updated`);
		} catch (err) {
			console.error("Error updating image:", err);
			toast.error(err instanceof Error ? err.message : "Could not update image");
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			if (!user || !accessToken) {
				throw new Error("You must be logged in");
			}

			const updateData: UpdateProfileData = {
				venueManager,
			};

			if (bio.trim()) {
				updateData.bio = bio.trim();
			}

			const response = await updateProfile(user.name, updateData, accessToken);
			setProfile(response.data);

			// Update Zustand store
			const updatedUser = {
				...user,
				venueManager: response.data.venueManager,
				bio: response.data.bio,
			};
			setAuth(updatedUser);

			toast.success("Profile updated");
		} catch (err) {
			console.error("Error updating profile:", err);
			toast.error(err instanceof Error ? err.message : "Could not update profile");
		} finally {
			setIsLoading(false);
		}
	};

	if (isFetching) {
		return (
			<div className="container mx-auto flex min-h-screen max-w-2xl items-center justify-center px-4">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	if (!profile) {
		return (
			<div className="container mx-auto max-w-2xl px-4 py-8">
				<div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
					<p>Could not load profile</p>
					<Link href="/login" className="mt-4 inline-block text-primary underline">
						Log in
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
			{/* Header */}
			<div className="mb-8 flex items-center gap-4">
				<Link href="/" className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-secondary">
					<ArrowLeft className="h-5 w-5" />
				</Link>
				<h1 className="text-3xl font-bold">Profile settings</h1>
			</div>

			{/* Banner */}
			<div className="group relative mb-6 aspect-3/1 overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 cursor-pointer" onClick={() => setIsBannerModalOpen(true)}>
				{profile.banner?.url && <Image src={profile.banner.url} alt={profile.banner.alt} fill unoptimized className="object-cover" />}

				{/* Edit overlay on hover */}
				<div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
					<div className="flex flex-col items-center gap-2 text-white">
						<Pencil className="h-8 w-8" />
						<span className="text-sm font-medium">Edit Banner</span>
					</div>
				</div>
			</div>

			{/* Avatar + User Info */}
			<div className="mb-8 flex items-center gap-6">
				<div className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-border bg-muted cursor-pointer" onClick={() => setIsAvatarModalOpen(true)}>
					{profile.avatar?.url ? (
						<Image src={profile.avatar.url} alt={profile.avatar.alt} fill unoptimized className="object-cover" />
					) : (
						<div className="flex h-full w-full items-center justify-center text-2xl font-semibold">{profile.name?.charAt(0).toUpperCase()}</div>
					)}

					{/* Edit overlay on hover */}
					<div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
						<Pencil className="h-6 w-6 text-white" />
					</div>
				</div>

				<div>
					<h2 className="text-xl font-semibold">{profile.name}</h2>
					<p className="text-muted-foreground">{profile.email}</p>
					{profile.venueManager && <span className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Venue Manager</span>}
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
						maxLength={160}
						className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
						rows={3}
					/>
					<p className="mt-1 text-xs text-muted-foreground">{bio.length}/160 characters</p>
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
						Save
					</button>
					<Link href="/" className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-6 py-2 text-sm font-medium transition-colors hover:bg-secondary">
						Cancel
					</Link>
				</div>
			</form>

			{/* Modals */}
			<ImageEditModal isOpen={isAvatarModalOpen} onCloseAction={() => setIsAvatarModalOpen(false)} title="Edit Avatar" currentUrl={avatarUrl} currentAlt={avatarAlt} onSaveAction={handleSaveAvatar} />

			<ImageEditModal isOpen={isBannerModalOpen} onCloseAction={() => setIsBannerModalOpen(false)} title="Edit Banner" currentUrl={bannerUrl} currentAlt={bannerAlt} onSaveAction={handleSaveBanner} />
		</div>
	);
}
