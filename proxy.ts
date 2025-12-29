import { NextResponse, NextRequest } from "next/server";

export function proxy(request: NextRequest) {
	const token = request.cookies.get("accessToken")?.value;
	const userCookie = request.cookies.get("user")?.value;

	if (!token) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	if (request.nextUrl.pathname.startsWith("/manager")) {
		if (userCookie) {
			try {
				const user = JSON.parse(userCookie);
				if (!user.venueManager) {
					return NextResponse.redirect(new URL("/", request.url));
				}
			} catch {
				return NextResponse.redirect(new URL("/login", request.url));
			}
		} else {
			return NextResponse.redirect(new URL("/login", request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/manager/:path*", "/profile", "/bookings"],
};
