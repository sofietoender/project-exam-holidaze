"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Home, User, Calendar, Building, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { getUser, logout, UserData } from "@/lib/auth";

export const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState<UserData | null>(null);
	const router = useRouter();

	useEffect(() => {
		const checkAuth = () => {
			const userData = getUser();
			if (userData) {
				setIsAuthenticated(true);
				setUser(userData);
			}
		};

		checkAuth();

		const handleUserUpdate = () => {
			checkAuth();
		};

		window.addEventListener("userUpdated", handleUserUpdate);

		return () => {
			window.removeEventListener("userUpdated", handleUserUpdate);
		};
	}, []);

	const handleLogout = () => {
		logout();
		setIsAuthenticated(false);
		setUser(null);
		setIsMenuOpen(false);
		router.push("/");
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
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
					{isAuthenticated && user?.venueManager && (
						<Link href="/manager/venues" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
							Manage Venues
						</Link>
					)}
				</nav>

				{/* Desktop Auth */}
				<div className="hidden items-center gap-3 md:flex">
					{isAuthenticated ? (
						<div className="relative group">
							{/* Avatar Button */}
							<button className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-secondary">
								<div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">{user?.name?.charAt(0).toUpperCase()}</div>
							</button>

							{/* Dropdown Menu */}
							<div className="absolute right-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-card border border-border rounded-lg shadow-lg">
								{/* User Info */}
								<div className="flex items-center gap-2 p-3 border-b border-border">
									<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">{user?.name?.charAt(0).toUpperCase()}</div>
									<div className="flex flex-col overflow-hidden">
										<span className="text-sm font-medium truncate">{user?.name}</span>
										<span className="text-xs text-muted-foreground truncate">{user?.email}</span>
									</div>
								</div>

								{/* Menu Items */}
								<div className="p-1">
									<Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors hover:bg-secondary">
										<User className="h-4 w-4" />
										Profile
									</Link>
									<Link href="/bookings" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors hover:bg-secondary">
										<Calendar className="h-4 w-4" />
										My Bookings
									</Link>
									{user?.venueManager && (
										<Link href="/manager/venues" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors hover:bg-secondary">
											<Building className="h-4 w-4" />
											Manage Venues
										</Link>
									)}
								</div>

								{/* Logout */}
								<div className="p-1 border-t border-border">
									<button onClick={handleLogout} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-md transition-colors hover:bg-red-50">
										<LogOut className="h-4 w-4" />
										Log out
									</button>
								</div>
							</div>
						</div>
					) : (
						<>
							<Link href="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
								Log in
							</Link>
							<Link href="/register" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 hover:shadow-md">
								Sign up
							</Link>
						</>
					)}
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

						{isAuthenticated ? (
							<>
								<Link href="/bookings" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary" onClick={() => setIsMenuOpen(false)}>
									<Calendar className="h-4 w-4" />
									My Bookings
								</Link>
								{user?.venueManager && (
									<Link href="/manager/venues" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary" onClick={() => setIsMenuOpen(false)}>
										<Building className="h-4 w-4" />
										Manage Venues
									</Link>
								)}
								<Link href="/profile" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary" onClick={() => setIsMenuOpen(false)}>
									<User className="h-4 w-4" />
									Profile
								</Link>
								<button onClick={handleLogout} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50">
									<LogOut className="h-4 w-4" />
									Log out
								</button>
							</>
						) : (
							<div className="mt-4 flex flex-col gap-2">
								<Link href="/login" className="rounded-lg border text-center border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary" onClick={() => setIsMenuOpen(false)}>
									Log in
								</Link>
								<Link
									href="/register"
									className="rounded-lg text-center bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
									onClick={() => setIsMenuOpen(false)}
								>
									Sign up
								</Link>
							</div>
						)}
					</nav>
				</div>
			)}
		</header>
	);
};
