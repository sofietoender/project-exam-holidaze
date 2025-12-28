import Link from "next/link";

export default function CreateVenue() {
	return (
		<div>
			<h1>Create Venue page</h1>
			<Link href="/manager/venues">Tilbake til manager</Link>
		</div>
	);
}
