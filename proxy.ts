import { NextResponse, NextRequest } from "next/server";

export function proxy(request: NextRequest) {
	const user = "";

	if (!user) {
		return NextResponse.redirect(new URL("/", request.url));
	}
}

export const config = {
	matcher: "/manager/venues",
};
