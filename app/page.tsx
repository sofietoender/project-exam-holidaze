import { Footer } from "@/components/ui/Footer";
import { Header } from "@/components/ui/Header";
import { Hero } from "@/components/ui/Hero";

export default function Home() {
	return (
		<div className="flex min-h-screen flex-col">
			<Header />
			<main className="flex-1">
				<Hero />
			</main>
			<Footer />
		</div>
	);
}
