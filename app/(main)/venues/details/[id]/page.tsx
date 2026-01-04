// app/(main)/venues/details/[id]/page.tsx

import VenueDetailClient from "./VenueDetailClient";
import { fetchVenueById } from "@/lib/api/venues";
import { notFound } from "next/navigation";

interface VenueDetailPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function VenueDetailPage({ params }: VenueDetailPageProps) {
	const { id } = await params;

	let response;

	try {
		response = await fetchVenueById(id);
	} catch (error) {
		console.error("Error fetching venue:", error);
		notFound();
	}

	const venue = response.data;

	return <VenueDetailClient venue={venue} />;
}
