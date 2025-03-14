"use client";

import { useState } from "react";
import { Achievement } from "@/lib/achievement-store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AchievementBadgeProps {
	achievement: Achievement;
	size?: "sm" | "md" | "lg";
	showDetails?: boolean;
	className?: string;
}

export function AchievementBadge({
	achievement,
	size = "md",
	showDetails = false,
	className,
}: AchievementBadgeProps) {
	const [isHovered, setIsHovered] = useState(false);

	const sizeClasses = {
		sm: "w-12 h-12 text-xl",
		md: "w-16 h-16 text-2xl",
		lg: "w-24 h-24 text-4xl",
	};

	return (
		<div className={cn("flex flex-col items-center", className)}>
			<motion.div
				className={cn(
					"relative flex items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-500 shadow-md cursor-pointer",
					sizeClasses[size]
				)}
				whileHover={{ scale: 1.1 }}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ type: "spring", stiffness: 300, damping: 15 }}
			>
				<span role="img" aria-label={achievement.title}>
					{achievement.icon}
				</span>

				{/* Glow effect */}
				<div className="absolute inset-0 rounded-full bg-amber-400 opacity-30 blur-md -z-10"></div>

				{/* Shine effect */}
				<div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white to-transparent opacity-30 rotate-12"></div>
			</motion.div>

			{(showDetails || isHovered) && (
				<motion.div
					className="mt-2 text-center"
					initial={{ opacity: 0, y: -5 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.2 }}
				>
					<h4 className="font-bold text-sm">{achievement.title}</h4>
					{showDetails && (
						<p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
					)}
				</motion.div>
			)}
		</div>
	);
}
