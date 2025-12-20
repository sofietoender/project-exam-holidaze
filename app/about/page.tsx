import Link from "next/link";
import AboutHero from "../components/AboutHero";

export default function About() {
	return (
		<div>
			<AboutHero />
			<Link href="/">Hjem</Link>
		</div>
	);
}
