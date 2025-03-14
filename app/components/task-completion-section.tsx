"use client";

import { useState, useEffect } from "react";
import { CompleteTaskButton } from "@/components/complete-task-button";
import { AchievementBadge } from "@/components/achievement-badge";
import { useAchievementStore, ACHIEVEMENTS, AchievementState } from "@/lib/achievement-store";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface TaskCompletionSectionProps {
	taskId: string;
	title: string;
	description: string;
	completedTitle: string;
	completedDescription: string;
}

export function TaskCompletionSection({
	taskId,
	title,
	description,
	completedTitle,
	completedDescription,
}: TaskCompletionSectionProps) {
	const { isTaskCompleted } = useAchievementStore();
	const [isCompleted, setIsCompleted] = useState(false);

	// Get the achievement if it exists
	const achievement = ACHIEVEMENTS[taskId.toUpperCase() as keyof typeof ACHIEVEMENTS];

	// Update completion status when the store changes or on mount
	useEffect(() => {
		// Initial state
		setIsCompleted(isTaskCompleted(taskId));

		// Manual subscription to watch for changes
		const checkCompletionStatus = () => {
			const isNowCompleted = useAchievementStore.getState().isTaskCompleted(taskId);
			if (isNowCompleted !== isCompleted) {
				setIsCompleted(isNowCompleted);
			}
		};

		// Set up interval to check completion status
		const intervalId = setInterval(checkCompletionStatus, 500);

		return () => clearInterval(intervalId);
	}, [taskId, isTaskCompleted, isCompleted]);

	// Handle task completion from this component
	const handleTaskComplete = () => {
		setIsCompleted(true);
	};

	return (
		<div className="pt-8 pb-4">
			<div className="max-w-3xl mx-auto">
				{isCompleted ? (
					<div className="space-y-6">
						{/* Achievement Badge - Only shown in completed state */}
						<motion.div
							className="flex justify-center"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.5 }}
						>
							{achievement && (
								<AchievementBadge achievement={achievement} size="lg" showDetails={true} />
							)}
						</motion.div>

						{/* Title and Description - Same structure in both states */}
						<div className="text-center space-y-2">
							<h2 className="text-xl font-semibold flex items-center justify-center gap-2">
								<Sparkles className="h-5 w-5 text-amber-500" />
								{completedTitle}
								<Sparkles className="h-5 w-5 text-amber-500" />
							</h2>
							<p className="text-muted-foreground">{completedDescription}</p>
						</div>

						{/* Button - Same spacing in both states */}
						<div className="pt-4">
							<CompleteTaskButton taskId={taskId} onComplete={handleTaskComplete} />
						</div>
					</div>
				) : (
					<div className="space-y-6">
						{/* Empty div to maintain spacing where the badge would be */}
						<div className="h-0"></div>

						{/* Title and Description - Same structure in both states */}
						<div className="text-center space-y-2">
							<h2 className="text-xl font-semibold">{title}</h2>
							<p className="text-muted-foreground">{description}</p>
						</div>

						{/* Button - Same spacing in both states */}
						<div className="pt-4">
							<CompleteTaskButton taskId={taskId} onComplete={handleTaskComplete} />
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
