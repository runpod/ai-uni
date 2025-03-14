"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { TaskCompletionSection } from "../components/task-completion-section";
import { TaskNavigation } from "../components/task-navigation";
import { useAchievementStore } from "../lib/achievement-store";

export default function SetupLLMPage() {
	const { isTaskCompleted } = useAchievementStore();
	const [isSetupLLMCompleted, setIsSetupLLMCompleted] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	// Check completion status after component mounts to avoid hydration mismatch
	useEffect(() => {
		// Initial state
		setIsSetupLLMCompleted(isTaskCompleted("setup-llm"));
		setIsMounted(true);

		// Set up interval to check completion status
		const checkCompletionStatus = () => {
			const isNowCompleted = useAchievementStore.getState().isTaskCompleted("setup-llm");
			if (isNowCompleted !== isSetupLLMCompleted) {
				setIsSetupLLMCompleted(isNowCompleted);
			}
		};

		// Check for changes every 500ms
		const intervalId = setInterval(checkCompletionStatus, 500);

		return () => clearInterval(intervalId);
	}, [isTaskCompleted, isSetupLLMCompleted]);

	return (
		<div className="max-w-4xl mx-auto space-y-8">
			<div>
				<h1 className="text-3xl font-bold tracking-tight mb-2">Deploying an LLM as API</h1>
				<p className="text-muted-foreground">
					Learn how to deploy a Large Language Model as an API endpoint using RunPod.
				</p>
			</div>

			<div className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">Step 1: Choose a Model</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="mb-4">
							First, you need to select which Large Language Model you want to deploy.
						</p>
						<p>
							This is a placeholder for the LLM setup content. In a real implementation, this would
							contain instructions for selecting and configuring an LLM.
						</p>
					</CardContent>
				</Card>
			</div>

			<TaskCompletionSection
				taskId="setup-llm"
				title="Ready to deploy your LLM?"
				description="Once you've completed all the steps above, mark this task as complete to unlock the next steps."
				completedTitle="Your LLM is ready to use!"
				completedDescription="You've successfully deployed your LLM as an API. Now you can start using it in your applications!"
			/>

			<TaskNavigation
				previousText="Back to Getting Started"
				previousHref="/getting-started"
				nextText="Fine-tuning Your Model"
				nextHref="/fine-tuning"
				isNextHighlighted={isMounted && isSetupLLMCompleted}
			/>
		</div>
	);
}
