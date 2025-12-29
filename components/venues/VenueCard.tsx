import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, Users, Wifi, Car, Coffee, PawPrint } from "lucide-react";
import { AMENITIES } from "@/lib/constants";

interface VenueCardProps {
	venue: {
		id: string;
		name: string;
		media?: Array<{ url: string; alt: string }>;
		location?: {
			city?: string;
			country?: string;
		};
		rating: number;
		maxGuests: number;
		meta?: {
			wifi?: boolean;
			parking?: boolean;
			breakfast?: boolean;
			pets?: boolean;
		};
		price: number;
	};
}

const AMENITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
	wifi: Wifi,
	parking: Car,
	breakfast: Coffee,
	pets: PawPrint,
};

export default function VenueCard({ venue }: VenueCardProps) {
	const imageUrl = venue.media?.[0]?.url || "/placeholder.svg";
	const location = [venue.location?.city, venue.location?.country].filter(Boolean).join(", ") || "Location not specified";

	// Filtrer amenities som er enabled
	const enabledAmenities = AMENITIES.filter((amenity) => venue.meta?.[amenity.id as keyof typeof venue.meta]);

	return (
		<Link href={`/venues/${venue.id}`} className="group block overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg">
			{/* Image */}
			<div className="relative aspect-4/3 overflow-hidden bg-muted">
				<Image
					src={imageUrl}
					alt={venue.media?.[0]?.alt || venue.name}
					fill
					className="object-cover transition-transform duration-500 group-hover:scale-110"
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
				/>
				{venue.rating > 0 && (
					<div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-sm font-medium backdrop-blur-sm">
						<Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
						<span>{venue.rating.toFixed(1)}</span>
					</div>
				)}
			</div>

			{/* Content */}
			<div className="p-4">
				{/* Title */}
				<h3 className="mb-2 line-clamp-1 text-lg font-semibold transition-colors group-hover:text-primary">{venue.name}</h3>

				{/* Location */}
				<div className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground">
					<MapPin className="h-3.5 w-3.5 shrink-0" />
					<span className="line-clamp-1">{location}</span>
				</div>

				{/* Max Guests */}
				<div className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground">
					<Users className="h-3.5 w-3.5 shrink-0" />
					<span>Up to {venue.maxGuests} guests</span>
				</div>

				{/* Amenities */}
				{enabledAmenities.length > 0 && (
					<div className="mb-4 flex flex-wrap gap-1.5">
						{enabledAmenities.slice(0, 3).map((amenity) => {
							const Icon = AMENITY_ICONS[amenity.id];
							return (
								<div key={amenity.id} className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
									{Icon && <Icon className="h-3 w-3" />}
									{amenity.label}
								</div>
							);
						})}
						{enabledAmenities.length > 3 && <div className="flex items-center rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">+{enabledAmenities.length - 3}</div>}
					</div>
				)}

				{/* Price */}
				<div className="flex items-baseline gap-1">
					<span className="text-xl font-bold">${venue.price}</span>
					<span className="text-sm text-muted-foreground">/ night</span>
				</div>
			</div>
		</Link>
	);
}
