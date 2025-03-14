"use client";

import { Achievement } from "@/lib/achievement-store";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

interface AchievementUnlockedProps {
	achievement: Achievement;
}

export function AchievementUnlocked({ achievement }: AchievementUnlockedProps) {
	return (
		<motion.div
			className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30 p-3 rounded-lg border border-amber-200 dark:border-amber-800 shadow-md"
			initial={{ opacity: 0, y: 20, scale: 0.95 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={{ type: "spring", stiffness: 300, damping: 20 }}
		>
			<div className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-300 to-amber-500 rounded-full shadow-inner">
				<span className="text-xl" role="img" aria-label={achievement.title}>
					{achievement.icon}
				</span>
			</div>

			<div className="flex-grow">
				<div className="flex items-center gap-1.5">
					<Trophy className="h-4 w-4 text-amber-500" />
					<h4 className="font-bold text-sm text-amber-800 dark:text-amber-300">
						Achievement Unlocked!
					</h4>
				</div>
				<p className="font-medium text-sm">{achievement.title}</p>
				<p className="text-xs text-muted-foreground">{achievement.description}</p>
			</div>
		</motion.div>
	);
}
