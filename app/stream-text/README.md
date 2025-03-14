# stream-text

examples for streaming text from llms via apis using different javascript/typescript libraries.

> [!NOTE]  
> this tutorial shows how to connect to a runpod serverless endpoint with popular llm models like qwq-32b or qwen-2.5-7b-instruct.

## what you'll learn

- how to connect to runpod serverless endpoints
- how to stream responses from llms using different libraries:
  - openai client
  - vercel ai sdk
  - langchain
- measuring performance metrics like time to first token (ttft)

## prerequisites

- node.js 18+ and npm
- a runpod account and api key
- a configured llm endpoint (see the `setup-llm` tutorial)

> [!TIP]
> you don't need to understand all three libraries. pick the one that best fits your project.

## usage

each example follows a similar pattern:

1. connect to your runpod endpoint
2. send a prompt to the llm
3. stream the response back
4. measure performance metrics

## examples by library

### openai client

the official openai node.js client can be used with runpod's openai-compatible endpoints.

```typescript
import OpenAI from "openai";

// rest of the example coming soon
```

### vercel ai sdk

the vercel ai sdk offers a streamlined way to integrate ai into next.js applications.

```typescript
import { OpenAIStream } from "ai";

// rest of the example coming soon
```

### langchain

langchain provides a comprehensive framework for working with llms.

```typescript
import { ChatOpenAI } from "langchain/chat_models/openai";

// rest of the example coming soon
```

> [!IMPORTANT]  
> make sure your environment variables are properly set up before running the examples.

## performance metrics

the examples include code to measure:

- time to first token (ttft)
- total processing time
- tokens per second
- token count

> [!WARNING]  
> streaming performance can vary based on model size, endpoint configuration, and network conditions.
