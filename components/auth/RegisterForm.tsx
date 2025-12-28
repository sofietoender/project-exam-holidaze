"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { register as registerUser } from "@/lib/auth";

const registerSchema = z
	.object({
		name: z
			.string()
			.min(1, "Name is required")
			.regex(/^[a-zA-Z0-9_]+$/, "Name can only contain letters, numbers, and underscores"),
		email: z.email("Please enter a valid email address").refine((email) => email.endsWith("@stud.noroff.no"), "Email must be a stud.noroff.no address"),
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string(),
		venueManager: z.boolean(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		setValue,
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			venueManager: false,
		},
	});

	const venueManager = watch("venueManager");

	const onSubmit = async (data: RegisterFormData) => {
		setIsLoading(true);
		try {
			await registerUser({
				name: data.name,
				email: data.email,
				password: data.password,
				venueManager: data.venueManager,
			});

			toast.success("Account created!", {
				description: "Welcome to Holidaze. You are now logged in.",
			});

			router.push("/");
		} catch (error) {
			toast.error("Registration failed", {
				description: error instanceof Error ? error.message : "Something went wrong",
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
					<h1 className="mt-8 text-center text-2xl font-bold tracking-tight md:text-3xl">Create your account</h1>
					<p className="mt-2 text-center text-muted-foreground">Join Holidaze and start exploring</p>
				</div>

				<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
						{/* Username */}
						<div>
							<label htmlFor="name" className="block text-sm font-medium">
								Username
							</label>
							<input
								id="name"
								type="text"
								placeholder="johndoe"
								{...register("name")}
								className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							/>
							{errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
						</div>

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
							<p className="mt-1 text-xs text-muted-foreground">Must be a stud.noroff.no email address</p>
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

						{/* Confirm Password */}
						<div>
							<label htmlFor="confirmPassword" className="block text-sm font-medium">
								Confirm Password
							</label>
							<input
								id="confirmPassword"
								type="password"
								placeholder="••••••••"
								{...register("confirmPassword")}
								className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
							/>
							{errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
						</div>

						{/* Venue Manager Checkbox */}
						<div className="flex items-start gap-3 rounded-lg border bg-muted/50 p-4">
							<input
								id="venueManager"
								type="checkbox"
								checked={venueManager}
								onChange={(e) => setValue("venueManager", e.target.checked)}
								className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
							/>
							<div>
								<label htmlFor="venueManager" className="block cursor-pointer text-sm font-medium">
									Register as a venue manager
								</label>
								<p className="text-sm text-muted-foreground">This allows you to create and manage venues for other guests to book.</p>
							</div>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isLoading}
							className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
						>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Create account
						</button>
					</form>

					<p className="mt-6 text-center text-sm text-muted-foreground">
						Already have an account?{" "}
						<Link href="/login" className="font-medium text-primary hover:underline">
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
