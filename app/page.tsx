import { Calendar, Star } from "lucide-react";

export default function Home() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
			<main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
				{/* Test ikoner */}

				<Calendar className="w-6 h-6 text-green-600" />
				<Star className="w-6 h-6 text-yellow-500" />
			</main>
		</div>
	);
}
