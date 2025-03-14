import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function StreamText() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Interacting with LLM API
        </h1>
        <p className="text-muted-foreground">
          Learn how to make requests to the LLM API, stream text responses, and
          handle different response formats.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Library Examples</CardTitle>
            <CardDescription>
              Different JavaScript/TypeScript libraries to stream AI responses
              from a RunPod serverless endpoint.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              This project demonstrates how to use different libraries to stream
              AI responses from a RunPod serverless endpoint.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>OpenAI Client</strong>: Uses the official OpenAI Node.js
                client to stream responses
              </li>
              <li>
                <strong>AI SDK</strong>: Uses the Vercel AI SDK to stream
                responses
              </li>
              <li>
                <strong>LangChain</strong>: Uses the LangChain.js library to
                stream responses
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interactive Demo</CardTitle>
            <CardDescription>
              Try out different streaming methods with a live demo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              This section is under development. Check back soon for an
              interactive demo!
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button asChild variant="outline">
          <Link href="/setup-llm">Previous: Deploying an LLM as API</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
