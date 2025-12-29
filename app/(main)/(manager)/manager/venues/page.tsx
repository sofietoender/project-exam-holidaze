import Link from "next/link";

export default function ManagerVenues() {
	return (
		<div>
			<h1>Manager Venues page</h1>

			<Link href="/">Hjem</Link>
			<Link href="/manager/venues/create">Create venue</Link>
		</div>
	);
}
