import { NextRequest, NextResponse } from "next/server";
import { RUNPOD_API_ENDPOINTS } from "@/lib/constants";

/**
 * API route for querying a RunPod serverless endpoint
 * This route proxies requests to the OpenAI-compatible API exposed by the endpoint
 */
export async function POST(request: NextRequest) {
	try {
		const {
			apiKey,
			endpointId,
			prompt,
			maxTokens = 1000,
			temperature = 0.1,
		} = await request.json();

		if (!apiKey) {
			return NextResponse.json({ success: false, error: "API key is required" }, { status: 400 });
		}

		if (!endpointId) {
			return NextResponse.json(
				{ success: false, error: "Endpoint ID is required" },
				{ status: 400 }
			);
		}

		if (!prompt) {
			return NextResponse.json({ success: false, error: "Prompt is required" }, { status: 400 });
		}

		// Construct the OpenAI-compatible API URL using the constants
		const apiUrl = RUNPOD_API_ENDPOINTS.getOpenAIChatCompletions(endpointId);

		// Make request to the endpoint's OpenAI-compatible API
		const response = await fetch(apiUrl, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				model: "Qwen/Qwen2.5-7B-Instruct-AWQ",
				messages: [
					{
						role: "user",
						content: prompt,
					},
				],
				temperature,
				max_tokens: maxTokens,
				stream: false, // For non-streaming responses
			}),
		});

		const data = await response.json();

		if (!response.ok) {
			return NextResponse.json(
				{
					success: false,
					error: data.error || `Failed to query endpoint: ${response.statusText}`,
				},
				{ status: response.status }
			);
		}

		return NextResponse.json({
			success: true,
			data: data,
		});
	} catch (error) {
		console.error("Error querying endpoint:", error);
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Unknown error occurred",
			},
			{ status: 500 }
		);
	}
}

/**
 * Streaming version of the endpoint query
 * This is used for real-time text generation
 */
export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const apiKey = searchParams.get("apiKey");
	const endpointId = searchParams.get("endpointId");
	const prompt = searchParams.get("prompt");
	const maxTokens = parseInt(searchParams.get("maxTokens") || "1000", 10);
	const temperature = parseFloat(searchParams.get("temperature") || "0.1");

	if (!apiKey) {
		return NextResponse.json({ success: false, error: "API key is required" }, { status: 400 });
	}

	if (!endpointId) {
		return NextResponse.json({ success: false, error: "Endpoint ID is required" }, { status: 400 });
	}

	if (!prompt) {
		return NextResponse.json({ success: false, error: "Prompt is required" }, { status: 400 });
	}

	// Construct the OpenAI-compatible API URL using the constants
	const apiUrl = RUNPOD_API_ENDPOINTS.getOpenAIChatCompletions(endpointId);

	try {
		// Create a TransformStream to handle the streaming response
		const encoder = new TextEncoder();
		const decoder = new TextDecoder();
		const transformStream = new TransformStream();
		const writer = transformStream.writable.getWriter();

		// Make streaming request to the endpoint
		const fetchPromise = fetch(apiUrl, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
				Accept: "text/event-stream",
			},
			body: JSON.stringify({
				model: "Qwen/Qwen2.5-7B-Instruct-AWQ",
				messages: [
					{
						role: "user",
						content: prompt,
					},
				],
				temperature,
				max_tokens: maxTokens,
				stream: true, // Enable streaming
			}),
		})
			.then(async response => {
				if (!response.ok) {
					const errorText = await response.text();
					throw new Error(`API request failed: ${errorText}`);
				}

				if (!response.body) {
					throw new Error("Response body is null");
				}

				const reader = response.body.getReader();
				let buffer = "";

				// Process the stream
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					// Decode the chunk and add it to our buffer
					buffer += decoder.decode(value, { stream: true });

					// Process complete SSE messages
					const lines = buffer.split("\n");
					buffer = lines.pop() || ""; // Keep the last incomplete line in the buffer

					for (const line of lines) {
						if (line.startsWith("data: ")) {
							const data = line.slice(6);
							if (data === "[DONE]") {
								continue;
							}

							try {
								const json = JSON.parse(data);
								const content = json.choices?.[0]?.delta?.content || "";
								if (content) {
									await writer.write(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
								}
							} catch (e) {
								console.error("Error parsing SSE data:", e);
							}
						}
					}
				}
			})
			.catch(async error => {
				console.error("Streaming error:", error);
				const errorMessage = JSON.stringify({ error: error.message });
				await writer.write(encoder.encode(`data: ${errorMessage}\n\n`));
			})
			.finally(async () => {
				await writer.write(encoder.encode("data: [DONE]\n\n"));
				await writer.close();
			});

		// Return the stream
		return new NextResponse(transformStream.readable, {
			headers: {
				"Content-Type": "text/event-stream",
				"Cache-Control": "no-cache",
				Connection: "keep-alive",
			},
		});
	} catch (error) {
		console.error("Error setting up stream:", error);
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Unknown error occurred",
			},
			{ status: 500 }
		);
	}
}
