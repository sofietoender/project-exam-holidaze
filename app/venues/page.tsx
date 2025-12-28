import Link from "next/link";

export default function Venues() {
	return (
		<div>
			<h1>All Venues page</h1>
			<ul>
				<li>Link to venue with id</li>
			</ul>
			<Link href="/">Hjem</Link>
		</div>
	);
}
