"use client";

import { useState, useEffect } from "react";

import { ApiKeyInput } from "../components/api-key-input";
import { ApiKeyTester } from "../components/api-key-tester";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { TaskCompletionSection } from "../components/task-completion-section";
import { TaskNavigation } from "../components/task-navigation";
import { useAchievementStore } from "../lib/achievement-store";

export default function GettingStartedPage() {
	const { isTaskCompleted } = useAchievementStore();
	const [isGettingStartedCompleted, setIsGettingStartedCompleted] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	// Check completion status after component mounts to avoid hydration mismatch
	useEffect(() => {
		// Initial state
		setIsGettingStartedCompleted(isTaskCompleted("getting-started"));
		setIsMounted(true);

		// Set up interval to check completion status
		const checkCompletionStatus = () => {
			const isNowCompleted = useAchievementStore.getState().isTaskCompleted("getting-started");
			if (isNowCompleted !== isGettingStartedCompleted) {
				setIsGettingStartedCompleted(isNowCompleted);
			}
		};

		// Check for changes every 500ms
		const intervalId = setInterval(checkCompletionStatus, 500);

		return () => clearInterval(intervalId);
	}, [isTaskCompleted, isGettingStartedCompleted]);

	return (
		<div className="max-w-4xl mx-auto space-y-8">
			<div>
				<h1 className="text-3xl font-bold tracking-tight mb-2">Getting Started with RunPod</h1>
				<p className="text-muted-foreground">
					Learn how to create an account, set up an API key, and configure it in ai-uni.
				</p>
			</div>

			<div className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">Step 1: Create an Account</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="mb-4">
							First, you need to create an account to access our GPU resources for AI development.
						</p>
						<ol className="list-decimal pl-5 space-y-3">
							<li>
								<a
									href="https://runpod.io/console/signup"
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary font-medium underline underline-offset-4"
								>
									Sign up
								</a>{" "}
								for your account
							</li>
							<li>Enter your email address and create a password</li>
							<li>Verify your email address</li>
							<li>Complete your profile information</li>
						</ol>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">Step 2: Add Credits to Your Account</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="mb-4">
							Before you can use RunPod, you need to add credits to your account. This is necessary
							to pay for the GPU resources you'll use when deploying AI models.
						</p>
						<ol className="list-decimal pl-5 space-y-3">
							<li>
								Navigate to the{" "}
								<a
									href="https://www.runpod.io/console/user/billing"
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary font-medium underline underline-offset-4"
								>
									billing section
								</a>{" "}
								in your account
							</li>
							<li>
								Choose one of the following options:
								<ul className="list-disc pl-5 mt-2 space-y-2">
									<li>
										Click <strong>Pay with Card</strong> and follow the payment instructions to add
										your own money
									</li>
									<li>
										If you have a promotional code, enter your <strong>Credit Code</strong> and then
										click <strong>Redeem Code</strong>
									</li>
								</ul>
							</li>
						</ol>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">Step 3: Generate an API Key</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="mb-4">
							To let ai-uni interact with RunPod to create and manage resources on your behalf, you
							need an API key with full permissions.
						</p>
						<ol className="list-decimal pl-5 space-y-3">
							<li>
								Go to your{" "}
								<a
									href="https://www.runpod.io/console/user/settings"
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary font-medium underline underline-offset-4"
								>
									account settings
								</a>
							</li>
							<li>Find & open the "API Keys" section</li>
							<li>
								Click "Create API Key"
								<ul className="list-disc pl-5 mt-2 space-y-2">
									<li>
										<strong>Important:</strong> Select "All" permission level (not "Restricted" or
										"Read Only")
									</li>
								</ul>
							</li>
							<li>
								Give your key a descriptive name (e.g., "ai-uni-development") and click on "Create"
							</li>
							<li>Copy and securely store your API key</li>
						</ol>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-2xl">Step 4: Configure API Key in ai-uni</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="mb-4">
							Finally, you need to configure your API key in ai-uni. This allows us to deploy and
							manage AI resources in your RunPod account.
						</p>
						<ol className="list-decimal pl-5 space-y-3">
							<li>
								Enter your RunPod API key in the field below and click "Save"
								<div className="mt-2">
									<ApiKeyInput />
								</div>
							</li>
							<li>
								Verify your API key is working correctly
								<div className="mt-2">
									<ApiKeyTester />
								</div>
							</li>
						</ol>
					</CardContent>
				</Card>
			</div>

			<TaskCompletionSection
				taskId="getting-started"
				title="Are you done setting up RunPod?"
				description="Once you've completed all the steps above, mark this task as complete to unlock the next steps."
				completedTitle="You're all set with RunPod!"
				completedDescription="You've successfully set up your RunPod account and API key. Now you're ready to deploy AI models!"
			/>

			<TaskNavigation
				previousText="Back to Home"
				previousHref="/"
				nextText="Deploying an LLM as API"
				nextHref="/setup-llm"
				isNextHighlighted={isMounted && isGettingStartedCompleted}
			/>
		</div>
	);
}
