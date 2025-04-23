import { NextRequest, NextResponse } from "next/server";
import { RUNPOD_API_ENDPOINTS, DATA_CENTER_IDS } from "@/lib/constants";

/**
 * API route for creating a network volume on RunPod
 */
export async function POST(request: NextRequest) {
	console.log("🔍 API Route: /api/create-volume - Request received");

	try {
		const body = await request.json();
		console.log("📦 Request body:", JSON.stringify(body, null, 2));

		const { apiKey, name, size } = body;
		console.log(`🔑 API Key length: ${apiKey ? apiKey.length : 0}`);
		console.log(`📝 Volume name: ${name}`);
		console.log(`📏 Volume size: ${size}GB`);

		if (!apiKey) {
			console.log("❌ Error: API key is required");
			return NextResponse.json({ success: false, error: "API key is required" }, { status: 400 });
		}

		if (!name) {
			console.log("❌ Error: Volume name is required");
			return NextResponse.json(
				{ success: false, error: "Volume name is required" },
				{ status: 400 }
			);
		}

		if (!size || size < 1) {
			console.log("❌ Error: Volume size must be at least 1GB");
			return NextResponse.json(
				{ success: false, error: "Volume size must be at least 1GB" },
				{ status: 400 }
			);
		}

		// Prepare request to RunPod API
		const requestBody = {
			name,
			size,
			dataCenterId: DATA_CENTER_IDS.MONTREAL, // Using constant for data center ID
		};

		console.log("🚀 Making request to RunPod API:");
		console.log(`📍 URL: ${RUNPOD_API_ENDPOINTS.networkVolumes}`);
		console.log("📦 Request body:", JSON.stringify(requestBody, null, 2));

		// Make request to RunPod API to create network volume
		const response = await fetch(RUNPOD_API_ENDPOINTS.networkVolumes, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestBody),
		});

		console.log(`📡 RunPod API response status: ${response.status} ${response.statusText}`);

		const data = await response.json();
		console.log("📦 RunPod API response data:", JSON.stringify(data, null, 2));

		if (!response.ok) {
			console.log("❌ Error from RunPod API:", data.error || response.statusText);
			return NextResponse.json(
				{
					success: false,
					error: data.error || `Failed to create network volume: ${response.statusText}`,
				},
				{ status: response.status }
			);
		}

		console.log("✅ Network volume created successfully");
		return NextResponse.json({
			success: true,
			data: data,
		});
	} catch (error) {
		console.error("❌ Unexpected error creating network volume:", error);
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Unknown error occurred",
			},
			{ status: 500 }
		);
	}
}
