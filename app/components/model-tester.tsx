"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Send, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ModelTesterProps {
	endpointId: string;
}

export function ModelTester({ endpointId }: ModelTesterProps) {
	const [apiKey, setApiKey] = useState<string>("");
	const [prompt, setPrompt] = useState<string>("");
	const [response, setResponse] = useState<string>("");
	const [isStreaming, setIsStreaming] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const [streamStartTime, setStreamStartTime] = useState<number | null>(null);
	const [streamEndTime, setStreamEndTime] = useState<number | null>(null);
	const [tokenCount, setTokenCount] = useState<number>(0);
	const responseRef = useRef<HTMLDivElement>(null);

	// Load API key from localStorage
	useEffect(() => {
		const savedApiKey = localStorage.getItem("runpodApiKey");
		if (savedApiKey) {
			setApiKey(savedApiKey);
		}
	}, []);

	// Auto-scroll to bottom of response
	useEffect(() => {
		if (responseRef.current && isStreaming) {
			responseRef.current.scrollTop = responseRef.current.scrollHeight;
		}
	}, [response, isStreaming]);

	// Rough token count estimation (not accurate but gives a ballpark)
	const estimateTokenCount = (text: string) => {
		return Math.ceil(text.split(/\s+/).length * 1.3);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!prompt.trim()) {
			toast.error("Empty Prompt", {
				description: "Please enter a prompt to test the model",
			});
			return;
		}

		if (!endpointId) {
			setError("Endpoint ID is required");
			toast.error("Missing Endpoint", {
				description: "Please create an endpoint first",
			});
			return;
		}

		setResponse("");
		setError("");
		setIsStreaming(true);
		setStreamStartTime(Date.now());
		setStreamEndTime(null);
		setTokenCount(0);

		try {
			// Create EventSource for streaming using the new API route
			const eventSource = new EventSource(
				`/api/query-endpoint?apiKey=${encodeURIComponent(apiKey)}&endpointId=${encodeURIComponent(
					endpointId
				)}&prompt=${encodeURIComponent(prompt)}`
			);

			eventSource.onmessage = event => {
				if (event.data === "[DONE]") {
					eventSource.close();
					setIsStreaming(false);
					setStreamEndTime(Date.now());
					return;
				}

				try {
					const data = JSON.parse(event.data);
					if (data.content) {
						setResponse(prev => {
							const newResponse = prev + data.content;
							setTokenCount(estimateTokenCount(newResponse));
							return newResponse;
						});
					}

					if (data.error) {
						setError(data.error);
						toast.error("Error", {
							description: data.error,
						});
						eventSource.close();
						setIsStreaming(false);
					}
				} catch (err) {
					console.error("Error parsing event data:", err);
				}
			};

			eventSource.onerror = err => {
				console.error("EventSource error:", err);
				setError("Error connecting to the model. Please try again.");
				toast.error("Connection Error", {
					description: "Failed to connect to the model. Please try again.",
				});
				eventSource.close();
				setIsStreaming(false);
			};
		} catch (err) {
			setError(err instanceof Error ? err.message : "An unknown error occurred");
			setIsStreaming(false);
		}
	};

	const handleReset = () => {
		setPrompt("");
		setResponse("");
		setError("");
		setStreamStartTime(null);
		setStreamEndTime(null);
		setTokenCount(0);
	};

	// Calculate response time in seconds
	const responseTime =
		streamStartTime && streamEndTime ? ((streamEndTime - streamStartTime) / 1000).toFixed(2) : null;

	// Calculate tokens per second
	const tokensPerSecond =
		responseTime && tokenCount && parseFloat(responseTime) > 0
			? (tokenCount / parseFloat(responseTime)).toFixed(1)
			: null;

	return (
		<div className="space-y-4">
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="grid gap-2">
					<textarea
						value={prompt}
						onChange={e => setPrompt(e.target.value)}
						placeholder="Enter your prompt here..."
						className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						disabled={isStreaming}
					/>
				</div>

				<div className="flex gap-2">
					<Button
						type="submit"
						disabled={isStreaming || !prompt.trim() || !endpointId || !apiKey}
						className="flex-1"
					>
						{isStreaming ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Generating...
							</>
						) : (
							<>
								<Send className="mr-2 h-4 w-4" />
								Generate Response
							</>
						)}
					</Button>
					<Button type="button" variant="outline" onClick={handleReset} disabled={isStreaming}>
						Reset
					</Button>
				</div>
			</form>

			<div className="rounded-lg border p-4 bg-muted/30">
				<h4 className="text-sm font-medium mb-2">Model Response</h4>
				<div
					ref={responseRef}
					className="bg-background rounded p-3 min-h-[200px] max-h-[400px] overflow-y-auto whitespace-pre-wrap text-sm"
				>
					{response || (
						<span className="text-muted-foreground">
							{isStreaming ? "Waiting for response..." : "Response will appear here..."}
						</span>
					)}
				</div>

				{error && (
					<div className="flex items-center gap-2 text-sm text-red-500 mt-2">
						<AlertCircle className="h-4 w-4" />
						<span>{error}</span>
					</div>
				)}

				{(responseTime || tokenCount > 0) && (
					<div className="mt-3 text-xs text-muted-foreground grid grid-cols-3 gap-2">
						{tokenCount > 0 && (
							<div>
								<span className="font-medium">Tokens:</span> {tokenCount}
							</div>
						)}
						{responseTime && (
							<div>
								<span className="font-medium">Time:</span> {responseTime}s
							</div>
						)}
						{tokensPerSecond && (
							<div>
								<span className="font-medium">Speed:</span> {tokensPerSecond} t/s
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
