import SearchBar from "@/components/search/SearchBar";

export default function VenuesPage() {
	return (
		<div className="container mx-auto px-4 py-8 md:py-12">
			{/* Header */}
			<div className="mb-8">
				<h1 className="mb-2 text-3xl font-bold md:text-4xl">Results for ...</h1>
				<p className="text-muted-foreground"> Found 10 venue</p>
			</div>

			{/* Search */}
			<div className="mb-8 max-w-md">
				<SearchBar />
			</div>

			{/* Venues Grid */}
		</div>
	);
}
