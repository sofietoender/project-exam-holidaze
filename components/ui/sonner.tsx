"use client";

import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
	return (
		<Sonner
			// Vi tvinger temaet til 'light' for å unngå at den blir svart
			theme="light"
			className="toaster group"
			icons={{
				// Bruker din orange farge fra globals.css på ikonet
				success: <CircleCheckIcon className="size-5 !text-[var(--color-primary)]" />,
				info: <InfoIcon className="size-5 text-blue-500" />,
				warning: <TriangleAlertIcon className="size-5 text-orange-500" />,
				error: <OctagonXIcon className="size-5 text-red-500" />,
				loading: <Loader2Icon className="size-5 animate-spin !text-[var(--color-primary)]" />,
			}}
			toastOptions={{
				unstyled: false,
				classNames: {
					toast: "group toast !bg-white text-foreground border border-border rounded-[--radius-lg] shadow-xl p-4 flex gap-3 items-center",
					title: "text-[1rem] font-semibold leading-tight text-black",
					description: "text-muted-foreground text-sm",

					success: "!bg-white !border-border",
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
