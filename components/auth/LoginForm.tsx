"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Validering
const loginSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: LoginFormData) => {
		setIsLoading(true);
		try {
			// TODO: Implement actual login logic here
			console.log("Login:", data);

			toast.success("Welcome back!", {
				description: "You have successfully logged in.",
			});

			router.push("/");
		} catch (error) {
			toast.error("Login failed", {
				description: error instanceof Error ? error.message : "Invalid credentials",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen">
			{/* Form */}
			<div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<Link href="/" className="mx-auto flex w-fit items-center gap-2">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
							<span className="text-xl font-bold text-primary-foreground">H</span>
						</div>
						<span className="text-2xl font-semibold">Holidaze</span>
					</Link>
					<h1 className="mt-8 text-center text-2xl font-bold tracking-tight md:text-3xl">Welcome back</h1>
					<p className="mt-2 text-center text-muted-foreground">Sign in to your account to continue</p>
				</div>

				<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						{/* Email */}
						<div>
							<label htmlFor="email" className="block text-sm font-medium">
								Email
							</label>
							<input
								id="email"
								type="email"
								placeholder="your.name@stud.noroff.no"
								{...register("email")}
								className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							/>
							{errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
						</div>

						{/* Password */}
						<div>
							<label htmlFor="password" className="block text-sm font-medium">
								Password
							</label>
							<div className="relative mt-2">
								<input
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="••••••••"
									{...register("password")}
									className="w-full rounded-lg border border-border bg-background px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
								/>
								<button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
									{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
								</button>
							</div>
							{errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isLoading}
							className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
						>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Sign in
						</button>
					</form>

					<p className="mt-6 text-center text-sm text-muted-foreground">
						Dont have an account?{" "}
						<Link href="/register" className="font-medium text-primary hover:underline">
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
