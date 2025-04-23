"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface NetworkVolumeCreatorProps {
	onVolumeCreated?: (volumeId: string) => void;
}

export function NetworkVolumeCreator({ onVolumeCreated }: NetworkVolumeCreatorProps) {
	const [apiKey, setApiKey] = useState<string>("");
	const [volumeName, setVolumeName] = useState<string>("llm-model-storage");
	const [volumeSize, setVolumeSize] = useState<number>(50);
	const [isCreating, setIsCreating] = useState<boolean>(false);
	const [isCreated, setIsCreated] = useState<boolean>(false);
	const [volumeId, setVolumeId] = useState<string>("");
	const [error, setError] = useState<string>("");

	// Check if we already have a volume ID in localStorage
	useEffect(() => {
		const savedVolumeId = localStorage.getItem("llm-volume-id");
		const savedApiKey = localStorage.getItem("runpodApiKey");

		if (savedApiKey) {
			setApiKey(savedApiKey);
		}

		if (savedVolumeId) {
			setVolumeId(savedVolumeId);
			setIsCreated(true);

			if (onVolumeCreated) {
				onVolumeCreated(savedVolumeId);
			}
		}
	}, [onVolumeCreated]);

	const handleCreateVolume = async () => {
		setIsCreating(true);
		setError("");

		try {
			// Use the direct API endpoint
			const response = await fetch("/api/create-volume", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					apiKey,
					name: volumeName,
					size: volumeSize,
					dataCenterId: "CA-MTL-1", // Hardcoded to CA-MTL-1 as per requirements
				}),
			});

			const result = await response.json();

			if (!result.success) {
				throw new Error(result.error || "Failed to create network volume");
			}

			// Save the volume ID to localStorage
			const newVolumeId = result.data.id;
			localStorage.setItem("llm-volume-id", newVolumeId);
			setVolumeId(newVolumeId);
			setIsCreated(true);

			toast.success("Network Volume Created", {
				description: `Successfully created network volume in CA-MTL-1 region`,
			});

			if (onVolumeCreated) {
				onVolumeCreated(newVolumeId);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An unknown error occurred");
			toast.error("Failed to Create Volume", {
				description: err instanceof Error ? err.message : "An unknown error occurred",
			});
		} finally {
			setIsCreating(false);
		}
	};

	const handleReset = () => {
		localStorage.removeItem("llm-volume-id");
		setVolumeId("");
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
							<h4 className="font-medium">Network Volume Created</h4>
							<p className="text-sm text-muted-foreground">
								Your network volume has been created in the CA-MTL-1 region.
							</p>
							<div className="text-sm mt-2">
								<span className="font-medium">Volume ID:</span> {volumeId}
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
						<Label htmlFor="volume-name">Volume Name</Label>
						<Input
							id="volume-name"
							value={volumeName}
							onChange={e => setVolumeName(e.target.value)}
							placeholder="Enter a name for your network volume"
							disabled={isCreating}
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor="volume-size">Volume Size (GB)</Label>
						<Input
							id="volume-size"
							type="number"
							min={1}
							value={volumeSize}
							onChange={e => setVolumeSize(parseInt(e.target.value, 10))}
							placeholder="Enter the size in GB"
							disabled={isCreating}
						/>
						<p className="text-xs text-muted-foreground">
							Recommended minimum size: 50GB for most LLMs
						</p>
					</div>

					{error && (
						<div className="flex items-center gap-2 text-sm text-red-500">
							<AlertCircle className="h-4 w-4" />
							<span>{error}</span>
						</div>
					)}

					<Button
						onClick={handleCreateVolume}
						disabled={isCreating || !volumeName || volumeSize < 1 || !apiKey}
						className="w-full"
					>
						{isCreating ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Creating Volume...
							</>
						) : (
							"Create Network Volume"
						)}
					</Button>
				</div>
			)}
		</div>
	);
}
