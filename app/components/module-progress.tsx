"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleProgressProps {
	moduleId: string;
	totalSteps: number;
	stepIds: string[];
	className?: string;
}

export function ModuleProgress({ moduleId, totalSteps, stepIds, className }: ModuleProgressProps) {
	const [completedSteps, setCompletedSteps] = useState<number>(0);

	// Load completion status from localStorage on component mount and when localStorage changes
	useEffect(() => {
		const checkCompletionStatus = () => {
			let completed = 0;
			stepIds.forEach(stepId => {
				const status = localStorage.getItem(`step-${stepId}`);
				if (status === "completed") {
					completed++;
				}
			});
			setCompletedSteps(completed);
		};

		// Check status on mount
		checkCompletionStatus();

		// Listen for storage events to update in real time
		const handleStorageChange = () => {
			checkCompletionStatus();
		};

		window.addEventListener("storage", handleStorageChange);

		// Special event listener for the same tab
		window.addEventListener("localDataChanged", handleStorageChange);

		return () => {
			window.removeEventListener("storage", handleStorageChange);
			window.removeEventListener("localDataChanged", handleStorageChange);
		};
	}, [stepIds]);

	const isModuleCompleted = completedSteps === totalSteps;
	const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

	return (
		<div className={cn("flex items-center gap-2", className)}>
			{isModuleCompleted ? (
				<CheckCircle2 className="h-5 w-5 text-green-500" />
			) : (
				<Circle className="h-5 w-5 text-muted-foreground" />
			)}
			<div className="flex flex-col gap-1 flex-1 min-w-0">
				<div className="flex justify-between items-center text-sm">
					<span>Progress</span>
					<span>
						{completedSteps}/{totalSteps} completed
					</span>
				</div>
				<div className="h-2 w-full bg-muted rounded-full overflow-hidden">
					<div
						className="h-full bg-green-500 rounded-full transition-all duration-300 ease-in-out"
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>
		</div>
	);
}
