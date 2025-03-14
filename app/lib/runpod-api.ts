/**
 * RunPod REST API Client
 *
 * A utility for interacting with the RunPod REST API.
 */

const API_BASE_URL = "https://rest.runpod.io/v1";

interface ApiResponse<T> {
	success: boolean;
	error?: string;
	data?: T;
	debug?: any;
}

interface Pod {
	id: string;
	name: string;
	desiredStatus: string;
	runtime: {
		uptimeInSeconds: number;
		ports: Array<{
			ip: string;
			isIpPublic: boolean;
			privatePort: number;
			publicPort: number;
			type: string;
		}>;
	};
	machineId?: string;
	machine?: {
		gpuDisplayName: string;
		gpuCount: number;
		memoryInGb: number;
		cpuCount: number;
	};
	imageName: string;
	env: Record<string, string>;
	volumeInGb: number;
	containerDiskInGb: number;
	gpuCount: number;
	vcpuCount: number;
	memoryInGb: number;
	costPerHr: number;
}

interface Pods {
	pods: Pod[];
}

/**
 * Makes an authenticated request to the RunPod API
 * Uses a proxy endpoint when running locally to bypass CORS restrictions
 */
async function makeRequest<T>(
	endpoint: string,
	method: "GET" | "POST" | "PATCH" | "DELETE" = "GET",
	params?: Record<string, any>,
	body?: any
): Promise<ApiResponse<T>> {
	// Get API key from local storage
	const apiKey = localStorage.getItem("runpodApiKey");

	if (!apiKey) {
		console.error("API key not found in local storage");
		return {
			success: false,
			error: "API key not found. Please set your RunPod API key first.",
		};
	}

	// Mask the API key for logging (show only first 4 and last 4 characters)
	const maskedKey =
		apiKey.length > 8
			? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`
			: "****";

	console.log(`Making ${method} request to ${endpoint} with API key: ${maskedKey}`);

	// Check if we're running locally (to use proxy)
	const isLocalhost =
		window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

	try {
		let response;
		let data;

		if (isLocalhost) {
			// Use proxy endpoint when running locally
			console.log(`Using proxy endpoint for local development`);

			// Build the proxy request
			response = await fetch("/api/runpod", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					endpoint,
					method,
					params,
					body,
					apiKey,
				}),
			});

			// Parse the proxy response
			const proxyResponse = await response.json();

			if (!proxyResponse.success) {
				console.error("Proxy error response:", proxyResponse);
				return {
					success: false,
					error: proxyResponse.error || "Proxy request failed",
					debug: proxyResponse.debug,
				};
			}

			// Extract the actual API response from the proxy response
			data = proxyResponse.data;

			// Special handling for pods endpoint to ensure consistent structure
			if (endpoint === "/pods" && Array.isArray(data)) {
				console.log("Converting pods array to expected format");
				data = { pods: data };
			}

			return {
				success: true,
				data: data as T,
			};
		} else {
			// Direct API call for production
			// Build URL with query parameters
			let url = `${API_BASE_URL}${endpoint}`;
			if (params && Object.keys(params).length > 0) {
				const queryParams = new URLSearchParams();
				Object.entries(params).forEach(([key, value]) => {
					if (Array.isArray(value)) {
						value.forEach(v => queryParams.append(key, v));
					} else if (value !== undefined && value !== null) {
						queryParams.append(key, String(value));
					}
				});
				url += `?${queryParams.toString()}`;
				console.log(`Request params: ${JSON.stringify(params)}`);
			}

			console.log(`Sending direct request to: ${url}`);
			response = await fetch(url, {
				method,
				headers: {
					Authorization: `Bearer ${apiKey}`,
					"Content-Type": "application/json",
				},
				body: body ? JSON.stringify(body) : undefined,
			});

			console.log(`Response status: ${response.status}`);

			if (!response.ok) {
				let errorData;
				try {
					errorData = await response.json();
					console.error("API error response:", errorData);
				} catch (e) {
					console.error("Failed to parse error response:", e);
					errorData = { error: "Failed to parse error response" };
				}

				return {
					success: false,
					error: errorData.error || `API request failed with status ${response.status}`,
					debug: {
						status: response.status,
						statusText: response.statusText,
						url: response.url,
						errorData,
					},
				};
			}

			data = await response.json();
			console.log("API response data:", data);
			return {
				success: true,
				data,
			};
		}
	} catch (error) {
		console.error("API request error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			debug: { error },
		};
	}
}

/**
 * List all pods in the user's account
 */
export async function listPods(params?: {
	computeType?: "GPU" | "CPU";
	gpuTypeId?: string[];
	dataCenterId?: string[];
	desiredStatus?: "RUNNING" | "EXITED" | "TERMINATED";
	includeMachine?: boolean;
}): Promise<ApiResponse<Pods>> {
	return makeRequest<Pods>("/pods", "GET", params);
}

/**
 * Get a specific pod by ID
 */
export async function getPod(
	podId: string,
	params?: {
		includeMachine?: boolean;
		includeNetworkVolume?: boolean;
	}
): Promise<ApiResponse<Pod>> {
	return makeRequest<Pod>(`/pods/${podId}`, "GET", params);
}

/**
 * Test if the API key is valid by making a simple request
 */
export async function testApiKey(): Promise<ApiResponse<{ valid: boolean }>> {
	console.log("Testing API key...");
	try {
		const response = await makeRequest<any>("/pods", "GET", { limit: 1 });

		console.log("API key test result:", response);

		return {
			success: response.success,
			data: { valid: response.success },
			error: response.error,
			debug: response.debug,
		};
	} catch (error) {
		console.error("API key test error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			data: { valid: false },
			debug: { error },
		};
	}
}

export default {
	listPods,
	getPod,
	testApiKey,
};
