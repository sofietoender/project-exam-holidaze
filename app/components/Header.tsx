"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Home } from "lucide-react";

export const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				{/* Logo */}
				<Link href="/" className="flex items-center gap-2 group">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary transition-transform group-hover:scale-105">
						<span className="text-xl font-bold text-primary-foreground">H</span>
					</div>
					<span className="text-xl font-semibold tracking-tight">Holidaze</span>
				</Link>

				{/* Desktop Navigation */}
				<nav className="hidden items-center gap-8 md:flex">
					<Link href="/venues" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
						Explore Venues
					</Link>
					<Link href="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
						About
					</Link>
					<Link href="/contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
						Contact
					</Link>
				</nav>

				{/* Desktop CTA */}
				<div className="hidden items-center gap-3 md:flex">
					<button className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary">Log in</button>
					<button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 hover:shadow-md">Sign up</button>
				</div>

				{/* Mobile Menu Button */}
				<button onClick={() => setIsMenuOpen(!isMenuOpen)} className="rounded-lg p-2 text-foreground transition-colors hover:bg-secondary md:hidden">
					{isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
				</button>
			</div>

			{/* Mobile Menu */}
			{isMenuOpen && (
				<div className="animate-fade-in border-t border-border bg-card md:hidden">
					<nav className="container mx-auto flex flex-col gap-1 p-4">
						<Link href="/venues" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary" onClick={() => setIsMenuOpen(false)}>
							<Home className="h-4 w-4" />
							Explore Venues
						</Link>
						<Link href="/about" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary" onClick={() => setIsMenuOpen(false)}>
							About
						</Link>
						<Link href="/contact" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary" onClick={() => setIsMenuOpen(false)}>
							Contact
						</Link>
						<div className="mt-4 flex flex-col gap-2">
							<button className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary">Log in</button>
							<button className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">Sign up</button>
						</div>
					</nav>
				</div>
			)}
		</header>
	);
};
