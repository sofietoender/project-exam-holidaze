import Link from "next/link";

export default function VenueBookings({ params }: { params: { id: string } }) {
	return (
		<div>
			<h1>Venue Bookings page</h1>
			<p>Bookings for Venue ID: {params.id}</p>
			<Link href={`/manager/venues/${params.id}`}>Tilbake til venue</Link>
		</div>
	);
}
