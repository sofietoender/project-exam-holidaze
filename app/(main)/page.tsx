import { Hero } from "@/components/ui/Hero";
import VenueCard from "@/components/venues/VenueCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
			<Hero />
			<section className="py-16 md:py-24">
				<div className="container mx-auto px-4">
					<div className="mb-10 flex items-end justify-between">
						<div>
							<h2 className="mb-2 text-3xl font-bold">Featured Venues</h2>
							<p className="text-muted-foreground">Discover our handpicked selection of amazing places to stay</p>
						</div>

						{/* Desktop "View all" link */}
						<Link href="/venues" className="hidden items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary sm:flex">
							View all
							<ArrowRight className="ml-2 h-4 w-4" />
						</Link>
					</div>

					{/* Venue Grid  */}
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						<VenueCard venue={dummyVenue} />
						<VenueCard venue={dummyVenue} />
						<VenueCard venue={dummyVenue} />
						<VenueCard venue={dummyVenue} />
					</div>

					{/* Mobile "View all" button */}
					<div className="mt-8 text-center sm:hidden">
						<Link
							href="/venues"
							className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
						>
							View all venues
							<ArrowRight className="ml-2 h-4 w-4" />
						</Link>
					</div>
				</div>
			</section>
		</>
	);
}
