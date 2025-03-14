"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { TaskNavigation } from "../components/task-navigation";

export default function FineTuningPage() {
	return (
		<div className="max-w-4xl mx-auto space-y-8">
			<div>
				<h1 className="text-3xl font-bold tracking-tight mb-2">Fine-tuning Your Model</h1>
				<p className="text-muted-foreground">
					Learn how to fine-tune your LLM for specific tasks and domains.
				</p>
			</div>

			<div className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">Fine-tuning Basics</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="mb-4">
							This page demonstrates using the TaskNavigation component with only a previous button.
						</p>
						<p>In a real implementation, this would contain instructions for fine-tuning an LLM.</p>
					</CardContent>
				</Card>
			</div>

			{/* Example with only a previous button */}
			<TaskNavigation previousText="Back to LLM Setup" previousHref="/setup-llm" />
		</div>
	);
}
