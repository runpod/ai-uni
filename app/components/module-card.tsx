import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ModuleProgress } from "@/components/module-progress";

export interface ModuleProps {
	id: string;
	title: string;
	description: string;
	href: string;
	prerequisites?: string[];
	stepIds?: string[];
	totalSteps?: number;
}

export function ModuleCard({
	id,
	title,
	description,
	href,
	prerequisites = [],
	stepIds = [],
	totalSteps = 0,
}: ModuleProps) {
	const hasProgress = stepIds.length > 0 && totalSteps > 0;

	return (
		<Card className="h-full flex flex-col transition-all hover:shadow-md">
			<CardHeader>
				<CardTitle className="text-xl">{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent className="flex-grow space-y-4">
				{prerequisites.length > 0 && (
					<div>
						<p className="text-sm font-medium mb-1">Prerequisites:</p>
						<div className="flex flex-wrap gap-2">
							{prerequisites.map(prereq => (
								<Badge key={prereq} variant="outline">
									{prereq}
								</Badge>
							))}
						</div>
					</div>
				)}

				{hasProgress && <ModuleProgress moduleId={id} stepIds={stepIds} totalSteps={totalSteps} />}
			</CardContent>
			<CardFooter>
				<Link
					href={href}
					className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
				>
					{hasProgress && totalSteps > 0 ? "Continue Module" : "Start Module"}
				</Link>
			</CardFooter>
		</Card>
	);
}
