"use client";

import Link from "next/link";
import { Button } from "./ui/button";

interface TaskNavigationProps {
	previousText?: string;
	previousHref?: string;
	nextText?: string;
	nextHref?: string;
	isNextHighlighted?: boolean;
}

export function TaskNavigation({
	previousText,
	previousHref,
	nextText,
	nextHref,
	isNextHighlighted = false,
}: TaskNavigationProps) {
	return (
		<div className="flex justify-between items-center mt-8">
			{previousText && previousHref && (
				<div className="flex flex-col items-start">
					<div className="text-sm text-muted-foreground mb-1">Previous</div>
					<Button asChild variant="outline">
						<Link href={previousHref}>{previousText}</Link>
					</Button>
				</div>
			)}

			{!previousText && !previousHref && <div />}

			{nextText && nextHref && (
				<div className="flex flex-col items-end">
					<div className="text-sm text-muted-foreground mb-1">Next</div>
					{isNextHighlighted ? (
						<Button
							asChild
							variant="outline"
							className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300 animate-border-pulse"
						>
							<Link href={nextHref}>{nextText}</Link>
						</Button>
					) : (
						<Button asChild variant="outline" className="">
							<Link href={nextHref}>{nextText}</Link>
						</Button>
					)}
				</div>
			)}
		</div>
	);
}

// Animation styles
const keyframes = {
	"@keyframes borderPulse": {
		"0%, 100%": {
			boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.3)",
		},
		"50%": {
			boxShadow: "0 0 0 4px rgba(79, 70, 229, 0.6)",
		},
	},
};

const styles = {
	".animate-border-pulse": {
		animation: "borderPulse 2s infinite",
	},
	...keyframes,
};

if (typeof document !== "undefined") {
	const styleSheet = document.createElement("style");
	styleSheet.textContent = Object.entries(styles)
		.map(([selector, rules]) => {
			if (selector.startsWith("@")) {
				return (
					selector +
					"{" +
					Object.entries(rules)
						.map(([k, v]) => `${k}{${v}}`)
						.join("") +
					"}"
				);
			}
			return (
				selector +
				"{" +
				Object.entries(rules)
					.map(([k, v]) => `${k}:${v};`)
					.join("") +
				"}"
			);
		})
		.join("\n");
	document.head.appendChild(styleSheet);
}
