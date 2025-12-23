export const Footer = () => {
	return (
		<footer className="border-t border-border bg-card">
			<div className="container mx-auto px-4 py-12">
				<div className="grid gap-8 md:grid-cols-4">
					{/* Brand */}
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
								<span className="text-base font-bold text-primary-foreground">H</span>
							</div>
							<span className="text-lg font-semibold">Holidaze</span>
						</div>
						<p className="text-sm text-muted-foreground">Find your perfect getaway with unique accommodations around the world.</p>
					</div>

					{/* Explore */}
					<div>
						<h3 className="mb-4 text-sm font-semibold">Explore</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
									All Venues
								</a>
							</li>
							<li>
								<a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
									Popular Destinations
								</a>
							</li>
						</ul>
					</div>

					{/* Host */}
					<div>
						<h3 className="mb-4 text-sm font-semibold">Host</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
									Become a Host
								</a>
							</li>
							<li>
								<a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
									Manage Venues
								</a>
							</li>
						</ul>
					</div>

					{/* Support */}
					<div>
						<h3 className="mb-4 text-sm font-semibold">Support</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
									Help Center
								</a>
							</li>
							<li>
								<a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
									Contact Us
								</a>
							</li>
						</ul>
					</div>
				</div>

				{/* Copyright */}
				<div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
					<p>© {new Date().getFullYear()} Holidaze. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
};
