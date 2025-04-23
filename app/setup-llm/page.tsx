"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCompletionSection } from "@/components/task-completion-section";
import { TaskNavigation } from "@/components/task-navigation";
import { useAchievementStore } from "@/lib/achievement-store";
import { NetworkVolumeCreator } from "@/components/network-volume-creator";
import { EndpointCreator } from "@/components/endpoint-creator";
import { ModelTester } from "@/components/model-tester";

export default function SetupLLMPage() {
	const { isTaskCompleted } = useAchievementStore();
	const [isSetupLLMCompleted, setIsSetupLLMCompleted] = useState(false);
	const [isMounted, setIsMounted] = useState(false);
	const [networkVolumeId, setNetworkVolumeId] = useState<string>("");
	const [endpointId, setEndpointId] = useState<string>("");
	const [endpointUrl, setEndpointUrl] = useState<string>("");

	// Check completion status after component mounts to avoid hydration mismatch
	useEffect(() => {
		// Initial state
		setIsSetupLLMCompleted(isTaskCompleted("setup-llm"));
		setIsMounted(true);

		// Check for saved resources
		const savedVolumeId = localStorage.getItem("llm-volume-id");
		const savedEndpointId = localStorage.getItem("llm-endpoint-id");
		const savedEndpointUrl = localStorage.getItem("llm-endpoint-url");

		if (savedVolumeId) {
			setNetworkVolumeId(savedVolumeId);
		}

		if (savedEndpointId) {
			setEndpointId(savedEndpointId);
		}

		if (savedEndpointUrl) {
			setEndpointUrl(savedEndpointUrl);
		}

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

	// Handle volume creation
	const handleVolumeCreated = (volumeId: string) => {
		setNetworkVolumeId(volumeId);
	};

	// Handle endpoint creation
	const handleEndpointCreated = (endpointId: string, endpointUrl: string) => {
		setEndpointId(endpointId);
		setEndpointUrl(endpointUrl);
	};

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
						<CardTitle className="text-2xl">
							Step 1: Create a Network Volume for Model Storage
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p>
							First, we need to create persistent storage for our model weights. Serverless
							endpoints need a place to store the model files between invocations, which is why we
							use a network volume.
						</p>
						<p>
							We'll create a network volume in the CA-MTL-1 region, which is optimized for AI
							workloads and offers high-speed storage access.
						</p>
						<div className="mt-4">
							<NetworkVolumeCreator onVolumeCreated={handleVolumeCreated} />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">
							Step 2: Deploy Serverless Endpoint with Optimal Configuration
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p>
							Now that we have persistent storage, we can deploy our serverless endpoint. We'll use
							the Qwen2.5-7B-Instruct-AWQ model, which offers a good balance of performance and
							quality.
						</p>
						<p>
							Our endpoint will be configured with an H100 GPU for maximum performance, and we'll
							set up environment variables to optimize the model's behavior.
						</p>
						<div className="mt-4">
							<EndpointCreator
								networkVolumeId={networkVolumeId}
								onEndpointCreated={handleEndpointCreated}
							/>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">
							Step 3: Test the Deployed LLM with Streaming Responses
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p>
							With our endpoint deployed, we can now test it by sending prompts and receiving
							streaming responses. The text will appear in real-time as the model generates it.
						</p>
						<p>
							Try different prompts to see how the model responds. You'll also see statistics about
							token count, response time, and generation speed.
						</p>
						<div className="mt-4">
							<ModelTester endpointId={endpointId} />
						</div>
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
