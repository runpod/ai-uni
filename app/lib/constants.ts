/**
 * Global constants for the application
 */

// RunPod API base URLs
export const RUNPOD_REST_API_BASE_URL = "https://rest.runpod.io/v1";
export const RUNPOD_OPENAI_API_BASE_URL = "https://api.runpod.io/v2";

// RunPod API endpoints
export const RUNPOD_API_ENDPOINTS = {
	// REST API endpoints
	networkVolumes: `${RUNPOD_REST_API_BASE_URL}/networkvolumes`,
	endpoints: `${RUNPOD_REST_API_BASE_URL}/endpoints`,

	// OpenAI-compatible API endpoints (requires endpoint ID)
	getOpenAIEndpoint: (endpointId: string) =>
		`${RUNPOD_OPENAI_API_BASE_URL}/${endpointId}/openai/v1`,

	getOpenAIChatCompletions: (endpointId: string) =>
		`${RUNPOD_OPENAI_API_BASE_URL}/${endpointId}/openai/v1/chat/completions`,
};

// Data center IDs
export const DATA_CENTER_IDS = {
	MONTREAL: "CA-MTL-1",
};
