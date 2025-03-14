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
 */
async function makeRequest<T>(
	endpoint: string,
	method: "GET" | "POST" | "PATCH" | "DELETE" = "GET",
	params?: Record<string, any>,
	body?: any
): Promise<ApiResponse<T>> {
	// Get API key from local storage
	const apiKey = localStorage.getItem("runpod-api-key");

	if (!apiKey) {
		return {
			success: false,
			error: "API key not found. Please set your RunPod API key first.",
		};
	}

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
	}

	try {
		const response = await fetch(url, {
			method,
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
			},
			body: body ? JSON.stringify(body) : undefined,
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			return {
				success: false,
				error: errorData.error || `API request failed with status ${response.status}`,
			};
		}

		const data = await response.json();
		return {
			success: true,
			data,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
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
	try {
		const response = await listPods({ desiredStatus: "RUNNING" });

		return {
			success: true,
			data: { valid: response.success },
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
			data: { valid: false },
		};
	}
}

export default {
	listPods,
	getPod,
	testApiKey,
};
