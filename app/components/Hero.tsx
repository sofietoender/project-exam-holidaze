export function Hero() {
	return (
		<section className="py-20 md:py-32">
			<div>
				<div className="mx-auto max-w-3xl text-center">
					<h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl animate-fade-up">
						Find Your Perfect
						<span className="text-gradient block"> Getaway</span>
					</h1>
					<p className="mb-8 text-lg text-muted-foreground md:text-xl animate-fade-up" style={{ animationDelay: "100ms" }}>
						Discover unique accommodations around the world. From cozy cabins to luxury villas, find your next adventure with Holidaze.
					</p>
					<div className="animate-fade-up" style={{ animationDelay: "200ms" }}></div>
				</div>
			</div>
		</section>
	);
}
