import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import VenuesPageContent from "./VenuesPageContent";

export default function VenuesPage() {
	return (
		<Suspense
			fallback={
				<div className="container mx-auto flex min-h-screen items-center justify-center px-4">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
				</div>
			}
		>
			<VenuesPageContent />
		</Suspense>
	);
}
