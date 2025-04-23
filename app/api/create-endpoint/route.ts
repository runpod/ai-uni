import { NextRequest, NextResponse } from "next/server";
import { RUNPOD_API_ENDPOINTS, DATA_CENTER_IDS } from "@/lib/constants";

/**
 * API route for creating a serverless endpoint on RunPod
 */
export async function POST(request: NextRequest) {
	try {
		const requestBody = await request.json();
		console.log("Request body received:", JSON.stringify(requestBody, null, 2));

		const { apiKey, name, networkVolumeId, volumeId } = requestBody;

		// Support both networkVolumeId and volumeId parameters
		const actualVolumeId = networkVolumeId || volumeId;
		console.log("Using volume ID:", actualVolumeId);

		if (!apiKey) {
			console.log("Error: API key is required");
			return NextResponse.json({ success: false, error: "API key is required" }, { status: 400 });
		}

		if (!name) {
			console.log("Error: Endpoint name is required");
			return NextResponse.json(
				{ success: false, error: "Endpoint name is required" },
				{ status: 400 }
			);
		}

		if (!actualVolumeId) {
			console.log("Error: Network volume ID is required");
			return NextResponse.json(
				{ success: false, error: "Network volume ID is required" },
				{ status: 400 }
			);
		}

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

		// Prepare the request body
		const requestPayload = {
			name,
			gpuIds: ["H100 80GB PCIe"], // H100 GPU as per requirements
			volumeId: actualVolumeId, // Use the actual volume ID
			imageName: "runpod/worker-v1-vllm:v2.1.0stable-cuda12.1.0", // Container image as per requirements
			containerDiskSize: 50, // 50GB container disk as per requirements
			minWorkers: 1, // 1 min worker as per requirements
			maxWorkers: 3, // 3 max workers as per requirements
			env: envVariables,
		};

		console.log("Making request to RunPod API:", RUNPOD_API_ENDPOINTS.endpoints);
		console.log("Request payload:", JSON.stringify(requestPayload, null, 2));

		// Make request to RunPod API to create serverless endpoint
		const response = await fetch(RUNPOD_API_ENDPOINTS.endpoints, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestPayload),
		});

		console.log("Response status:", response.status, response.statusText);
		const data = await response.json();
		console.log("Response data:", JSON.stringify(data, null, 2));

		if (!response.ok) {
			console.log("Error from RunPod API:", data.error || response.statusText);
			return NextResponse.json(
				{
					success: false,
					error: data.error || `Failed to create endpoint: ${response.statusText}`,
					details: data,
				},
				{ status: response.status }
			);
		}

		console.log("Endpoint created successfully:", data.id);
		return NextResponse.json({
			success: true,
			data: data,
		});
	} catch (error) {
		console.error("Error creating endpoint:", error);
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Unknown error occurred",
			},
			{ status: 500 }
		);
	}
}
