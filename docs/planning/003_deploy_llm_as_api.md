# User Story: Deploying an LLM as API

## Overview

Create a step-by-step tutorial that guides users through deploying a Large Language Model (LLM) as a
serverless API endpoint using RunPod's REST API. The tutorial will demonstrate how to create
persistent storage for model weights, deploy a serverless endpoint with optimal configurations, and
test the deployed model with streaming responses.

## User Requirements

- As a developer, I want to deploy an LLM without managing infrastructure
- As a user, I need to understand why persistent storage is necessary for serverless AI deployments
- As a user, I want clear instructions on configuring the optimal environment for my LLM
- As a user, I want to see the model responding in real-time via streaming responses
- As a user, I want to track my progress through the deployment process

## Technical Requirements

- Create API routes to proxy RunPod REST API calls to avoid CORS issues
- Implement network volume creation in the CA-MTL-1 region for model storage
- Configure serverless endpoint with H100 GPU and appropriate worker settings
- Store network volume ID and endpoint ID in localStorage for reuse
- Implement streaming text responses from the deployed model
- Ensure all components follow established design patterns and conventions

## Detailed Steps

1. **Create a Network Volume for Model Storage**

   - Explain why persistent storage is necessary for serverless AI endpoints
   - Create a network volume in CA-MTL-1 region using RunPod API
   - Store the network volume ID in localStorage
   - Provide status updates during creation
   - Step completion checkbox

2. **Deploy Serverless Endpoint with Optimal Configuration**

   - Use the network volume from step 1
   - Configure endpoint with H100 GPU, 3 max workers, 1 min worker
   - Set container image to runpod/worker-v1-vllm:v2.1.0stable-cuda12.1.0
   - Configure 50GB container disk
   - Set environment variables for Qwen/Qwen2.5-7B-Instruct-AWQ model
   - Store endpoint ID and URL in localStorage
   - Provide deployment status updates
   - Step completion checkbox

3. **Test the Deployed LLM with Streaming Responses**
   - Create a simple interface for sending prompts to the model
   - Implement streaming responses to display text as it's generated
   - Show response statistics (tokens, time, etc.)
   - Explain how to interpret the results
   - Step completion checkbox

## Environment Variables Configuration

| Variable                    | Value                          |
| --------------------------- | ------------------------------ |
| `MODEL_NAME`                | `Qwen/Qwen2.5-7B-Instruct-AWQ` |
| `MAX_MODEL_LEN`             | `8192`                         |
| `BLOCK_SIZE`                | `32`                           |
| `MAX_NUM_SEQS`              | `1`                            |
| `MAX_NUM_BATCHED_TOKENS`    | `8192`                         |
| `GPU_MEMORY_UTILIZATION`    | `0.98`                         |
| `ENABLE_CHUNKED_PREFILL`    | `True`                         |
| `DISABLE_LOGGING_REQUEST`   | `True`                         |
| `DISABLE_LOG_STATS`         | `True`                         |
| `DISABLE_CUSTOM_ALL_REDUCE` | `True`                         |
| `QUANTIZATION`              | `awq`                          |

## UI Components

- Step cards with clear titles and instructional content
- Progress indicators for resource creation
- Network volume creation status display
- Serverless endpoint deployment status display
- Text input for testing prompts
- Streaming response display with token highlighting
- Navigation buttons for previous/next modules
- Task completion section consistent with other tutorials

## API Routes

- `/api/network-volumes/create` - Create persistent storage using RunPod REST API
- `/api/endpoints/create` - Deploy serverless endpoint using RunPod REST API
- `/api/endpoints/query` - Interface with the deployed LLM using AI SDK's OpenAI provider

### Endpoint Interaction

- The deployed endpoint will expose an OpenAI-compatible API (e.g.,
  `https://api.runpod.ai/v2/{endpoint-id}/openai/v1`)
- Use the AI SDK with OpenAI provider to communicate with the endpoint (following the pattern in
  `ai-sdk-client.ts`)
- Implement streaming responses using the `streamText` functionality from the AI SDK
- No need to use RunPod REST API for inference queries as the endpoint provides a standard
  OpenAI-compatible interface

#### Code Example

```typescript
// ai-endpoint-client.ts
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

/**
 * Stream text from the deployed LLM endpoint
 * @param prompt The prompt to send to the model
 * @param onChunk Callback function to handle each chunk of text
 * @param maxTokens Maximum number of tokens to generate
 * @param seed Optional seed for reproducible results
 */
export async function streamFromEndpoint(
  prompt: string,
  onChunk: (chunk: string) => void,
  maxTokens: number = 1000,
  seed: number = 42
): Promise<void> {
  // Get API key and endpoint from localStorage
  const apiKey = localStorage.getItem('runpod-api-key');
  const endpointId = localStorage.getItem('llm-endpoint-id');
  const baseURL = `https://api.runpod.ai/v2/${endpointId}/openai/v1`;

  if (!apiKey || !endpointId) {
    throw new Error("API key or endpoint ID not found in localStorage");
  }

  // Create OpenAI provider with our endpoint
  const openai = createOpenAI({
    apiKey: apiKey,
    baseURL: baseURL,
  });

  // Create the stream using the AI SDK
  const result = await streamText({
    model: openai("Qwen/Qwen2.5-7B-Instruct-AWQ"), // Using the model we deployed
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.1,
    maxTokens,
    seed,
  });

  try {
    // Use textStream as an async iterable
    for await (const textPart of result.textStream) {
      onChunk(textPart);
    }
  } catch (error) {
    console.error("Error processing AI SDK stream:", error);
    throw error;
  }
}

// Example usage in a React component:
/*
function ModelTester() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse("");
    setIsStreaming(true);

    try {
      await streamFromEndpoint(
        prompt,
        (chunk) => {
          setResponse((prev) => prev + chunk);
        },
        1000
      );
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
        />
        <button type="submit" disabled={isStreaming || !prompt}>
          {isStreaming ? "Generating..." : "Generate"}
        </button>
      </form>
      <div className="response">
        {response || "Response will appear here..."}
      </div>
    </div>
  );
}
*/

## Data Persistence

- Store network volume ID in localStorage
- Store endpoint ID and URL in localStorage
- Track step completion status in achievement store

## Acceptance Criteria

- Network volume is successfully created in CA-MTL-1 region
- Serverless endpoint is properly configured with all environment variables
- Text responses stream in real-time with minimal latency
- Step completion is tracked and persisted
- UI provides clear feedback during resource creation
- Error states are handled gracefully with helpful messages
- All components follow established design patterns
- Navigation between modules works correctly
```
