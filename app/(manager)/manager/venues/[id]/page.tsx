import Link from "next/link";

export default function EditVenue({ params }: { params: { id: string } }) {
	return (
		<div>
			<h1>Edit Venue page</h1>
			<p>Venue ID: {params.id}</p>
			<Link href={`/manager/venues/${params.id}/bookings`}>View Bookings</Link>
			<br />
			<Link href="/manager/venues">Tilbake til manager</Link>
		</div>
	);
}
