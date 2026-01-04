export const API_BASE = "https://v2.api.noroff.dev";
export const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

if (!API_KEY) {
	throw new Error("Missing NEXT_PUBLIC_API_KEY in environment variables");
}
