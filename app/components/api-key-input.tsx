"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Copy, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface ApiKeyInputProps {
	onSave?: (apiKey: string) => void;
}

export function ApiKeyInput({ onSave }: ApiKeyInputProps) {
	const [apiKey, setApiKey] = useState("");
	const [isSaved, setIsSaved] = useState(false);
	const [showApiKey, setShowApiKey] = useState(false);

	useEffect(() => {
		// Check if API key is already saved in localStorage
		const savedApiKey = localStorage.getItem("runpodApiKey");
		if (savedApiKey) {
			setApiKey(savedApiKey);
			setIsSaved(true);
		}
	}, []);

	const handleSave = () => {
		if (!apiKey.trim()) {
			toast.error("API Key Required", {
				description: "Please enter your RunPod API key",
			});
			return;
		}

		// Save API key to localStorage
		localStorage.setItem("runpodApiKey", apiKey);
		setIsSaved(true);

		toast.success("API Key Saved", {
			description: "Your RunPod API key has been saved successfully",
		});

		if (onSave) {
			onSave(apiKey);
		}
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(apiKey);
		toast.success("Copied", {
			description: "API key copied to clipboard",
		});
	};

	const handleClear = () => {
		localStorage.removeItem("runpodApiKey");
		setApiKey("");
		setIsSaved(false);
		setShowApiKey(false);

		toast.success("API Key Cleared", {
			description: "Your RunPod API key has been removed",
		});
	};

	return (
		<div className="space-y-4">
			<div className="flex gap-2">
				<div className="relative flex-grow">
					<Input
						type={showApiKey ? "text" : "password"}
						value={apiKey}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value)}
						placeholder="Enter your RunPod API key"
						className="pr-10"
						disabled={isSaved}
					/>
					<button
						type="button"
						onClick={() => setShowApiKey(!showApiKey)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
						aria-label={showApiKey ? "Hide API key" : "Show API key"}
					>
						{showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
					</button>
				</div>
				{isSaved ? (
					<>
						<Button variant="outline" size="icon" onClick={handleCopy} aria-label="Copy API key">
							<Copy className="h-4 w-4" />
						</Button>
						<Button variant="outline" size="sm" onClick={handleClear}>
							Clear
						</Button>
					</>
				) : (
					<Button onClick={handleSave}>Save</Button>
				)}
			</div>

			{isSaved && (
				<div className="flex items-center gap-2 text-sm text-green-500">
					<CheckCircle className="h-4 w-4" />
					<span>API key saved successfully</span>
				</div>
			)}
		</div>
	);
}
