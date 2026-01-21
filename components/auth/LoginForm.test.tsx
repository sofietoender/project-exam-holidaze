import { vi, test, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginForm from "./LoginForm";

vi.mock("@/lib/auth", () => ({
	login: vi.fn(),
}));

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: vi.fn(),
		replace: vi.fn(),
		refresh: vi.fn(),
		prefetch: vi.fn(),
	}),
}));

test("displays validation errors for invalid input", async () => {
	// Arrange
	render(<LoginForm />);

	// Act
	fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

	// Assert
	expect(await screen.findByText(/please enter a valid email/i)).toBeInTheDocument();
	expect(await screen.findByText(/password must be at least 8/i)).toBeInTheDocument();
});
