"use client";

import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { listPods, testApiKey } from "@/lib/runpod-api";

// Define a more specific type for our API responses that includes debug
type ApiResponseWithDebug<T> = {
	success: boolean;
	error?: string;
	data?: T;
	debug?: any;
};

export function ApiKeyTester() {
	const [isLoading, setIsLoading] = useState(false);
	const [testResult, setTestResult] = useState<{
		success: boolean;
		message: string;
		pods?: any[];
		debug?: any;
	} | null>(null);

	// Log localStorage state on component mount
	useEffect(() => {
		const apiKey = localStorage.getItem("runpodApiKey");
		console.log("ApiKeyTester mounted, localStorage key exists:", !!apiKey);
		if (apiKey) {
			// Safely log a masked version of the key
			const maskedKey =
				apiKey.length > 8
					? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`
					: "****";
			console.log("API key in localStorage (masked):", maskedKey);
		}
	}, []);

	const handleTestApiKey = async () => {
		setIsLoading(true);
		setTestResult(null);
		console.log("Starting API key test...");

		// Double-check localStorage before making request
		const apiKey = localStorage.getItem("runpodApiKey");
		console.log("API key exists in localStorage:", !!apiKey);

		try {
			// First test if the API key is valid
			const testResponse = (await testApiKey()) as ApiResponseWithDebug<{ valid: boolean }>;
			console.log("Test API key response:", testResponse);

			if (!testResponse.success || !testResponse.data?.valid) {
				setTestResult({
					success: false,
					message: testResponse.error || "API key is invalid or has insufficient permissions.",
					debug: testResponse.debug,
				});
				setIsLoading(false);
				return;
			}

			// If valid, try to list pods to show some data
			const podsResponse = (await listPods()) as ApiResponseWithDebug<{ pods: any[] }>;
			console.log("List pods response:", podsResponse);

			if (podsResponse.success) {
				// Safely handle the pods array which might be missing or in a different format
				const pods = podsResponse.data?.pods || [];

				setTestResult({
					success: true,
					message: `API key is valid!`,
					pods: pods,
				});
			} else {
				// Key is valid but we couldn't list pods
				setTestResult({
					success: true,
					message: "API key is valid, but some permissions are missing.",
					debug: podsResponse.debug,
				});
			}
		} catch (error) {
			console.error("Error testing API key:", error);
			setTestResult({
				success: false,
				message: error instanceof Error ? error.message : "An unknown error occurred",
				debug: { error },
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<Button onClick={handleTestApiKey} disabled={isLoading} variant="outline">
					{isLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Testing...
						</>
					) : (
						"Test API Key"
					)}
				</Button>
				<span className="text-sm text-muted-foreground"></span>
			</div>

			{testResult && (
				<div
					className={`p-4 rounded-md ${testResult.success ? "bg-green-50 dark:bg-green-950/30" : "bg-red-50 dark:bg-red-950/30"}`}
				>
					<div className="flex items-start gap-3">
						{testResult.success ? (
							<CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
						) : (
							<XCircle className="h-5 w-5 text-red-500 mt-0.5" />
						)}
						<div className="space-y-2">
							<p
								className={`text-sm ${testResult.success ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}
							>
								{testResult.message}
							</p>

							{!testResult.success && testResult.debug && (
								<div className="mt-2">
									<p className="text-xs text-muted-foreground">
										Debug information (check browser console for more details):
									</p>
									<pre className="mt-1 text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded overflow-auto max-h-32">
										{testResult.debug.status && (
											<>
												Status: {testResult.debug.status} ({testResult.debug.statusText})<br />
											</>
										)}
										{testResult.debug.errorData?.error && (
											<>
												Error: {testResult.debug.errorData.error}
												<br />
											</>
										)}
										{window.location.hostname === "localhost" && (
											<>
												Note: You're running on localhost. API requests are being proxied through
												/api/runpod to avoid CORS issues.
												<br />
											</>
										)}
									</pre>
								</div>
							)}

							{testResult.success && testResult.pods && testResult.pods.length > 0 && (
								<div className="mt-2">
									<p className="text-sm font-medium mb-1">Your pods:</p>
									<ul className="text-xs space-y-1 text-muted-foreground">
										{testResult.pods.slice(0, 3).map(pod => (
											<li key={pod.id} className="flex justify-between">
												<span>{pod.name || pod.id}</span>
												<span className="px-2 py-0.5 rounded-full text-xs bg-slate-200 dark:bg-slate-800">
													{pod.desiredStatus}
												</span>
											</li>
										))}
										{testResult.pods.length > 3 && (
											<li className="text-xs text-muted-foreground">
												...and {testResult.pods.length - 3} more
											</li>
										)}
									</ul>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
