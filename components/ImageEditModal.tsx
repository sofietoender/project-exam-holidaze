"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface ImageEditModalProps {
	isOpen: boolean;
	onCloseAction: () => void;
	title: string;
	currentUrl: string;
	currentAlt: string;
	onSaveAction: (url: string, alt: string) => void;
}

export function ImageEditModal({ isOpen, onCloseAction, title, currentUrl, currentAlt, onSaveAction }: ImageEditModalProps) {
	const [url, setUrl] = useState(currentUrl);
	const [alt, setAlt] = useState(currentAlt);

	if (!isOpen) return null;

	const handleSave = () => {
		onSaveAction(url, alt);
		onCloseAction();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onCloseAction}>
			<div className="w-full max-w-md rounded-lg bg-card border border-border p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
				{/* Header */}
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-xl font-semibold">{title}</h2>
					<button onClick={onCloseAction} className="rounded-lg p-2 transition-colors hover:bg-secondary">
						<X className="h-5 w-5" />
					</button>
				</div>

				{/* Form */}
				<div className="space-y-4">
					<div>
						<label htmlFor="imageUrl" className="block text-sm font-medium mb-2">
							Image URL
						</label>
						<input
							id="imageUrl"
							type="url"
							placeholder="https://example.com/image.jpg"
							value={url}
							onChange={(e) => setUrl(e.target.value)}
							className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
						/>
					</div>

					<div>
						<label htmlFor="imageAlt" className="block text-sm font-medium mb-2">
							Description (Alt text)
						</label>
						<input
							id="imageAlt"
							type="text"
							placeholder="Describe the image"
							value={alt}
							onChange={(e) => setAlt(e.target.value)}
							className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
						/>
					</div>
				</div>

				{/* Buttons */}
				<div className="mt-6 flex gap-3">
					<button onClick={handleSave} className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
						Save
					</button>
					<button onClick={onCloseAction} className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
}
