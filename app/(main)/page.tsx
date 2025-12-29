import { Hero } from "@/components/ui/Hero";
import VenueCard from "@/components/venues/VenueCard";

export default function Home() {
	const dummyVenue = {
		id: "1",
		name: "Cozy Beach House",
		media: [
			{
				url: "",
				alt: "Beach house",
			},
		],
		location: {
			city: "Miami",
			country: "USA",
		},
		rating: 4.8,
		maxGuests: 6,
		meta: {
			wifi: true,
			parking: true,
			breakfast: false,
			pets: true,
		},
		price: 150,
	};
	return (
		<>
			<Hero />;
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				<VenueCard venue={dummyVenue} />
				<VenueCard venue={dummyVenue} />
				<VenueCard venue={dummyVenue} />
			</div>
		</>
	);
}
