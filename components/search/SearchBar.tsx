"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface SearchBarProps {
	variant?: "default" | "hero";
	defaultValue?: string;
}

export default function SearchBar({ variant = "default", defaultValue = "" }: SearchBarProps) {
	const [query, setQuery] = useState(defaultValue);
	const router = useRouter();

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();

		if (!query.trim()) return;

		// Redirect til venues-siden med søkeparameter
		router.push(`/venues?search=${encodeURIComponent(query.trim())}`);
	};

	if (variant === "hero") {
		return (
			<form onSubmit={handleSubmit} className="flex w-full max-w-2xl flex-col gap-3 rounded-2xl border border-border bg-card p-2 shadow-lg sm:flex-row">
				<div className="relative flex-1">
					<Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
					<input
						type="text"
						placeholder="Search destinations, venues..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="h-12 w-full rounded-lg border-0 bg-transparent pl-12 pr-4 text-base focus:outline-none"
					/>
				</div>
				<button type="submit" className="h-12 rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
					Search
				</button>
			</form>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="flex gap-2">
			<div className="relative flex-1">
				<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<input
					type="text"
					placeholder="Search venues..."
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
				/>
			</div>
			<button type="submit" className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
				Search
			</button>
		</form>
	);
}
