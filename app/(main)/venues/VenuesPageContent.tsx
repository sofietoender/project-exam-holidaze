"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { fetchVenues, searchVenues } from "@/lib/api/venues";
import { Venue } from "@/types/venue";
import { Loader2 } from "lucide-react";
import SearchBar from "@/components/search/SearchBar";
import VenueCard from "@/components/venues/VenueCard";
import { Pagination } from "@/components/ui/Pagination";
import { toast } from "sonner";

export default function VenuesPage() {
	const searchParams = useSearchParams();
	const searchQuery = searchParams.get("search");

	const [venues, setVenues] = useState<Venue[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalCount, setTotalCount] = useState(0);

	const loadVenues = useCallback(async () => {
		try {
			setIsLoading(true);

			let response;

			if (searchQuery) {
				response = await searchVenues(searchQuery);
			} else {
				response = await fetchVenues({
					limit: 9,
					page: currentPage,
					sort: "created",
					sortOrder: "desc",
				});
			}

			setVenues(response.data);

			if (response.meta) {
				setTotalPages(response.meta.pageCount || 1);
				setTotalCount(response.meta.totalCount || response.data.length);
			}
		} catch (error) {
			console.error("Error loading venues:", error);
			toast.error("Could not load venues");
		} finally {
			setIsLoading(false);
		}
	}, [searchQuery, currentPage]);

	useEffect(() => {
		loadVenues();
	}, [loadVenues]);

	return (
		<div className="container mx-auto px-4 py-8 md:py-12">
			{/* Header */}
			<div className="mb-8">
				<h1 className="mb-2 text-3xl font-bold md:text-4xl">{searchQuery ? `Results for "${searchQuery}"` : "Explore Venues"}</h1>
				<p className="text-muted-foreground">{isLoading ? "Loading..." : `Found ${totalCount} venue${totalCount !== 1 ? "s" : ""}`}</p>
			</div>

			{/* Search */}
			<div className="mb-8 max-w-md">
				<SearchBar defaultValue={searchQuery || ""} />
			</div>

			{/* Loading State */}
			{isLoading && (
				<div className="flex items-center justify-center py-20">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
				</div>
			)}

			{/* Empty State */}
			{!isLoading && venues.length === 0 && (
				<div className="text-center py-20">
					<p className="text-lg text-muted-foreground">No venues found.</p>
				</div>
			)}

			{/* Venues Grid */}
			{!isLoading && venues.length > 0 && (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{venues.map((venue) => (
							<VenueCard key={venue.id} venue={venue} />
						))}
					</div>

					{/* Pagination */}
					{!searchQuery && totalPages > 1 && (
						<div className="mt-12">
							<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
						</div>
					)}
				</>
			)}
		</div>
	);
}
