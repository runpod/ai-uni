"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface EndpointCreatorProps {
	networkVolumeId: string;
	onEndpointCreated?: (endpointId: string, endpointUrl: string) => void;
}

export function EndpointCreator({ networkVolumeId, onEndpointCreated }: EndpointCreatorProps) {
	const [apiKey, setApiKey] = useState<string>("");
	const [endpointName, setEndpointName] = useState<string>("llm-api-endpoint");
	const [isCreating, setIsCreating] = useState<boolean>(false);
	const [isCreated, setIsCreated] = useState<boolean>(false);
	const [endpointId, setEndpointId] = useState<string>("");
	const [endpointUrl, setEndpointUrl] = useState<string>("");
	const [error, setError] = useState<string>("");

	// Check if we already have an endpoint ID in localStorage
	useEffect(() => {
		const savedEndpointId = localStorage.getItem("llm-endpoint-id");
		const savedEndpointUrl = localStorage.getItem("llm-endpoint-url");
		const savedApiKey = localStorage.getItem("runpodApiKey");

		if (savedApiKey) {
			setApiKey(savedApiKey);
		}

		if (savedEndpointId && savedEndpointUrl) {
			setEndpointId(savedEndpointId);
			setEndpointUrl(savedEndpointUrl);
			setIsCreated(true);

			if (onEndpointCreated) {
				onEndpointCreated(savedEndpointId, savedEndpointUrl);
			}
		}
	}, [onEndpointCreated]);

	const handleCreateEndpoint = async () => {
		if (!networkVolumeId) {
			setError("Network volume ID is required");
			toast.error("Missing Network Volume", {
				description: "Please create a network volume first",
			});
			return;
		}

		setIsCreating(true);
		setError("");

		try {
			// Environment variables for the Qwen model as per requirements
			const envVariables = {
				MODEL_NAME: "Qwen/Qwen2.5-7B-Instruct-AWQ",
				MAX_MODEL_LEN: "8192",
				BLOCK_SIZE: "32",
				MAX_NUM_SEQS: "1",
				MAX_NUM_BATCHED_TOKENS: "8192",
				GPU_MEMORY_UTILIZATION: "0.98",
				ENABLE_CHUNKED_PREFILL: "True",
				DISABLE_LOGGING_REQUEST: "True",
				DISABLE_LOG_STATS: "True",
				DISABLE_CUSTOM_ALL_REDUCE: "True",
				QUANTIZATION: "awq",
			};

			// Use the direct API endpoint
			const response = await fetch("/api/create-endpoint", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					apiKey,
					name: endpointName,
					networkVolumeId: networkVolumeId,
					gpuIds: ["H100 80GB PCIe"], // H100 GPU as per requirements
					imageName: "runpod/worker-v1-vllm:v2.1.0stable-cuda12.1.0", // Container image as per requirements
					containerDiskSize: 50, // 50GB container disk as per requirements
					minWorkers: 1, // 1 min worker as per requirements
					maxWorkers: 3, // 3 max workers as per requirements
					env: envVariables,
				}),
			});

			const result = await response.json();

			if (!result.success) {
				throw new Error(result.error || "Failed to create endpoint");
			}

			// Save the endpoint ID and URL to localStorage
			const newEndpointId = result.data.id;
			const newEndpointUrl = `https://api.runpod.io/v2/${newEndpointId}/openai/v1`;

			localStorage.setItem("llm-endpoint-id", newEndpointId);
			localStorage.setItem("llm-endpoint-url", newEndpointUrl);

			setEndpointId(newEndpointId);
			setEndpointUrl(newEndpointUrl);
			setIsCreated(true);

			toast.success("Endpoint Created", {
				description: "Successfully created serverless endpoint with H100 GPU",
			});

			if (onEndpointCreated) {
				onEndpointCreated(newEndpointId, newEndpointUrl);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An unknown error occurred");
			toast.error("Failed to Create Endpoint", {
				description: err instanceof Error ? err.message : "An unknown error occurred",
			});
		} finally {
			setIsCreating(false);
		}
	};

	const handleReset = () => {
		localStorage.removeItem("llm-endpoint-id");
		localStorage.removeItem("llm-endpoint-url");
		setEndpointId("");
		setEndpointUrl("");
		setIsCreated(false);
		setError("");
	};

	return (
		<div className="space-y-4">
			{isCreated ? (
				<div className="rounded-lg border p-4 bg-muted/50">
					<div className="flex items-start gap-3">
						<CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
						<div className="space-y-1">
							<h4 className="font-medium">Serverless Endpoint Created</h4>
							<p className="text-sm text-muted-foreground">
								Your LLM endpoint has been created with H100 GPU and optimal configuration.
							</p>
							<div className="text-sm mt-2">
								<div>
									<span className="font-medium">Endpoint ID:</span> {endpointId}
								</div>
								<div className="mt-1">
									<span className="font-medium">API URL:</span> {endpointUrl}
								</div>
							</div>
							<div className="mt-3">
								<Button variant="outline" size="sm" onClick={handleReset}>
									Reset
								</Button>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="space-y-4">
					<div className="grid gap-2">
						<Label htmlFor="endpoint-name">Endpoint Name</Label>
						<Input
							id="endpoint-name"
							value={endpointName}
							onChange={e => setEndpointName(e.target.value)}
							placeholder="Enter a name for your serverless endpoint"
							disabled={isCreating}
						/>
					</div>

					<div className="rounded-lg border p-3 bg-muted/30">
						<h4 className="text-sm font-medium mb-2">Endpoint Configuration</h4>
						<ul className="text-xs space-y-1 text-muted-foreground">
							<li>• GPU: H100 80GB PCIe</li>
							<li>• Workers: 1 min, 3 max</li>
							<li>• Container: runpod/worker-v1-vllm:v2.1.0stable-cuda12.1.0</li>
							<li>• Disk: 50GB</li>
							<li>• Model: Qwen/Qwen2.5-7B-Instruct-AWQ</li>
							<li>
								• Network Volume:{" "}
								{networkVolumeId ? networkVolumeId.substring(0, 8) + "..." : "None"}
							</li>
						</ul>
					</div>

					{error && (
						<div className="flex items-center gap-2 text-sm text-red-500">
							<AlertCircle className="h-4 w-4" />
							<span>{error}</span>
						</div>
					)}

					<Button
						onClick={handleCreateEndpoint}
						disabled={isCreating || !endpointName || !networkVolumeId || !apiKey}
						className="w-full"
					>
						{isCreating ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Creating Endpoint...
							</>
						) : (
							"Create Serverless Endpoint"
						)}
					</Button>
				</div>
			)}
		</div>
	);
}
