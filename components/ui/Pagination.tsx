import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className = "" }: PaginationProps) {
	const getPageNumbers = () => {
		const pages: (number | "ellipsis")[] = [];
		const showEllipsis = totalPages > 7;

		if (!showEllipsis) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			pages.push(1);

			if (currentPage > 3) {
				pages.push("ellipsis");
			}

			const start = Math.max(2, currentPage - 1);
			const end = Math.min(totalPages - 1, currentPage + 1);

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			if (currentPage < totalPages - 2) {
				pages.push("ellipsis");
			}

			pages.push(totalPages);
		}

		return pages;
	};

	return (
		<nav role="navigation" aria-label="pagination" className={`mx-auto flex w-full justify-center ${className}`}>
			<ul className="flex flex-row items-center gap-1">
				{/* Previous Button */}
				<li>
					<button
						onClick={() => onPageChange(currentPage - 1)}
						disabled={currentPage === 1}
						aria-label="Go to previous page"
						className="flex h-9 items-center gap-1 rounded-lg border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
					>
						<ChevronLeft className="h-4 w-4" />
						<span>Previous</span>
					</button>
				</li>

				{/* Page Numbers */}
				{getPageNumbers().map((page, index) => (
					<li key={index}>
						{page === "ellipsis" ? (
							<span className="flex h-9 w-9 items-center justify-center">
								<MoreHorizontal className="h-4 w-4 text-muted-foreground" />
								<span className="sr-only">More pages</span>
							</span>
						) : (
							<button
								onClick={() => onPageChange(page)}
								aria-current={currentPage === page ? "page" : undefined}
								className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
									currentPage === page ? "border border-primary bg-primary/10 text-primary" : "border border-transparent hover:bg-secondary"
								}`}
							>
								{page}
							</button>
						)}
					</li>
				))}

				{/* Next Button */}
				<li>
					<button
						onClick={() => onPageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
						aria-label="Go to next page"
						className="flex h-9 items-center gap-1 rounded-lg border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
					>
						<span>Next</span>
						<ChevronRight className="h-4 w-4" />
					</button>
				</li>
			</ul>
		</nav>
	);
}
