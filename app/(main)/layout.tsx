import { Footer } from "@/components/ui/Footer";
import { Header } from "@/components/ui/Header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-screen flex-col">
			<Header />
			<main className="flex-1">{children}</main>
			<Footer />
		</div>
	);
}
