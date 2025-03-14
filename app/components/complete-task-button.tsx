"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, Square, CheckSquare } from "lucide-react";
import { useAchievementStore, ACHIEVEMENTS } from "@/lib/achievement-store";

interface CompleteTaskButtonProps {
	taskId: string;
	onComplete?: () => void;
}

export function CompleteTaskButton({ taskId, onComplete }: CompleteTaskButtonProps) {
	const { isTaskCompleted, completeTask, resetTask } = useAchievementStore();
	const [isCompleted, setIsCompleted] = useState(false);

	// Check if task is already completed
	useEffect(() => {
		setIsCompleted(isTaskCompleted(taskId));
	}, [taskId, isTaskCompleted]);

	const handleComplete = () => {
		// Only mark as completed if not already completed
		if (!isCompleted) {
			// Complete the task in the store
			completeTask(taskId);
			setIsCompleted(true);

			if (onComplete) {
				onComplete();
			}
		}
	};

	const handleReset = () => {
		resetTask(taskId);
		setIsCompleted(false);
	};

	return (
		<div className="w-full">
			<Button
				onClick={isCompleted ? handleReset : handleComplete}
				className={`w-full py-8 text-lg flex items-center justify-center gap-3 transition-all ${
					isCompleted
						? "bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-300"
						: "bg-white hover:bg-gray-100 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200"
				}`}
				variant="outline"
				size="lg"
			>
				{isCompleted ? <CheckSquare className="h-8 w-8" /> : <Square className="h-8 w-8" />}
				<span className="font-bold text-xl">
					{isCompleted ? "Task Completed!" : "Complete This Task"}
				</span>
			</Button>
		</div>
	);
}
