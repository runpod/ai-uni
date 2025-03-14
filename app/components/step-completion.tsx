"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepCompletionProps {
	stepId: string;
	className?: string;
}

export function StepCompletion({ stepId, className }: StepCompletionProps) {
	const [isCompleted, setIsCompleted] = useState<boolean>(false);

	// Load completion status from localStorage on component mount
	useEffect(() => {
		const savedStatus = localStorage.getItem(`step-${stepId}`);
		if (savedStatus) {
			setIsCompleted(savedStatus === "completed");
		}
	}, [stepId]);

	// Save completion status to localStorage when it changes
	const toggleCompletion = () => {
		const newStatus = !isCompleted;
		setIsCompleted(newStatus);
		localStorage.setItem(`step-${stepId}`, newStatus ? "completed" : "incomplete");

		// Dispatch a custom event to notify other components
		window.dispatchEvent(new Event("localDataChanged"));
	};

	return (
		<button
			onClick={toggleCompletion}
			className={cn(
				"flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium",
				isCompleted
					? "border-green-600 bg-green-50 text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400"
					: "border-muted bg-background hover:bg-muted/50",
				className
			)}
			aria-pressed={isCompleted}
		>
			<div
				className={cn(
					"rounded-full p-0.5",
					isCompleted ? "bg-green-600 dark:bg-green-500" : "border border-muted-foreground/30"
				)}
			>
				<Check className={cn("h-3 w-3", isCompleted ? "text-white" : "opacity-0")} />
			</div>
			<span>{isCompleted ? "Completed" : "Mark as completed"}</span>
		</button>
	);
}
