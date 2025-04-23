import { NextRequest, NextResponse } from "next/server";
import { RUNPOD_REST_API_BASE_URL } from "@/lib/constants";

/**
 * Proxy handler for RunPod API requests
 * This bypasses CORS restrictions when testing locally
 */
export async function POST(request: NextRequest) {
	try {
		// Get request data
		const { endpoint, method, params, body, apiKey } = await request.json();

		if (!apiKey) {
			return NextResponse.json({ success: false, error: "API key is required" }, { status: 400 });
		}

		// Build URL with query parameters
		let url = `${RUNPOD_REST_API_BASE_URL}${endpoint}`;
		if (params && Object.keys(params).length > 0) {
			const queryParams = new URLSearchParams();
			Object.entries(params).forEach(([key, value]) => {
				if (Array.isArray(value)) {
					value.forEach(v => queryParams.append(key, v as string));
				} else if (value !== undefined && value !== null) {
					queryParams.append(key, String(value));
				}
			});
			url += `?${queryParams.toString()}`;
		}

		console.log(`Proxy making request to: ${url}`);

		// Make the request to RunPod API
		const response = await fetch(url, {
			method: method || "GET",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
			},
			body: body ? JSON.stringify(body) : undefined,
		});

		console.log(`Proxy received response with status: ${response.status}`);

		// Get response data
		let data;
		try {
			data = await response.json();
			console.log("Proxy received data:", data);
		} catch (e) {
			console.error("Proxy failed to parse response:", e);
			data = { error: "Failed to parse response" };
		}

		// Return response
		if (!response.ok) {
			return NextResponse.json(
				{
					success: false,
					error: data.error || `API request failed with status ${response.status}`,
					debug: {
						status: response.status,
						statusText: response.statusText,
						url: response.url,
						errorData: data,
					},
				},
				{ status: response.status }
			);
		}

		// Special handling for pods endpoint
		if (endpoint === "/pods" && Array.isArray(data)) {
			console.log("Proxy converting pods array to expected format");
			data = { pods: data };
		}

		return NextResponse.json({ success: true, data });
	} catch (error) {
		console.error("Proxy error:", error);
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Unknown error occurred",
				debug: { error },
			},
			{ status: 500 }
		);
	}
}
