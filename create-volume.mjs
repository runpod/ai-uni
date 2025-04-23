// Simple script to create a RunPod network volume using the API
import "dotenv/config";
import fetch from "node-fetch";

// Constants for API URLs and data centers
const RUNPOD_REST_API_BASE_URL = "https://rest.runpod.io/v1";
const DATA_CENTER_IDS = {
	MONTREAL: "CA-MTL-1",
};

async function createNetworkVolume() {
	const apiKey = process.env.RUNPOD_API_KEY;

	if (!apiKey) {
		console.error("❌ Error: RUNPOD_API_KEY is not set in .env file");
		process.exit(1);
	}

	// Network volume details
	const volumeName = process.argv[2] || "llm-model-storage";
	const volumeSize = parseInt(process.argv[3] || "50", 10);
	const dataCenterId = DATA_CENTER_IDS.MONTREAL;

	console.log("🔍 Creating network volume with the following details:");
	console.log(`📝 Volume name: ${volumeName}`);
	console.log(`📏 Volume size: ${volumeSize}GB`);
	console.log(`🌎 Data center: ${dataCenterId}`);
	console.log(`🔑 API Key: ${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 5)}`);

	try {
		console.log("🚀 Making request to RunPod API...");

		// Using the correct endpoint with the base URL constant
		const response = await fetch(`${RUNPOD_REST_API_BASE_URL}/networkvolumes`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: volumeName,
				size: volumeSize,
				dataCenterId: dataCenterId,
			}),
		});

		console.log(`📡 Response status: ${response.status} ${response.statusText}`);

		const data = await response.json();
		console.log("📦 Response data:", JSON.stringify(data, null, 2));

		if (!response.ok) {
			console.error("❌ Error from RunPod API:", data.error || data.message || response.statusText);
			process.exit(1);
		}

		console.log("✅ Network volume created successfully!");
		console.log(`🆔 Volume ID: ${data.id}`);
	} catch (error) {
		console.error("❌ Unexpected error:", error.message);
		process.exit(1);
	}
}

createNetworkVolume();
