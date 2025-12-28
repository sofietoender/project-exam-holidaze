import Link from "next/link";

export default function VenuePage({ params }: { params: { id: string } }) {
	return (
		<div>
			<h1>Venue page</h1>
			<p>Venue ID: {params.id}</p>
			<Link href="/venues">Tilbake til venues</Link>
		</div>
	);
}
