import { ModuleCard, ModuleProps } from "@/components/module-card";

const modules: ModuleProps[] = [
	{
		id: "getting-started",
		title: "Getting Started with RunPod",
		description:
			"Learn how to create a RunPod account, set up an API key, and configure it in ai-uni.",
		href: "/getting-started",
		prerequisites: [],
		stepIds: ["create-runpod-account", "setup-api-key", "configure-api-key"],
		totalSteps: 3,
	},
	{
		id: "deploy-llm",
		title: "Deploying an LLM as API",
		description: "Set up vLLM as a serverless endpoint, configure the deployment, and test it.",
		href: "/setup-llm",
		prerequisites: ["Getting Started with RunPod"],
		stepIds: [],
		totalSteps: 0,
	},
	{
		id: "interact-llm",
		title: "Interacting with LLM API",
		description:
			"Make requests to the LLM API, stream text responses, and handle different response formats.",
		href: "/stream-text",
		prerequisites: ["Deploying an LLM as API"],
		stepIds: [],
		totalSteps: 0,
	},
];

export default function Home() {
	return (
		<div className="max-w-5xl mx-auto space-y-10">
			<section className="space-y-4">
				<h1 className="text-4xl font-bold tracking-tight">Welcome to ai uni</h1>
				<p className="text-xl text-muted-foreground">
					A free, open-source university for learning how to build AI products with real-world
					examples and practical code.
				</p>
			</section>

			<section>
				<h2 className="text-2xl font-semibold mb-6">Learning Modules</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{modules.map(module => (
						<ModuleCard key={module.id} {...module} />
					))}
				</div>
			</section>

			<section className="p-6 bg-muted rounded-lg">
				<h2 className="text-2xl font-semibold mb-4">Why ai uni?</h2>
				<div className="space-y-4">
					<p>
						We believe that practical, hands-on examples are the best way to learn AI development.
						Every lesson in ai uni is based on real-world applications that you can immediately use
						in your own projects.
					</p>
					<p>
						Our focus is on RunPod as the platform of choice, guiding you through every step of the
						process with both written tutorials and easy-to-use deployment resources.
					</p>
					<p>ai uni is completely free and open-source. Contributions are welcome!</p>
				</div>
			</section>
		</div>
	);
}
