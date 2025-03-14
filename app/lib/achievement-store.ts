/**
 * Achievement Store
 *
 * A centralized store for managing user achievements and completed tasks
 * with localStorage persistence.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Achievement {
	id: string;
	title: string;
	description: string;
	icon: string;
	earnedAt?: Date;
}

export interface AchievementState {
	completedTasks: Record<string, boolean>;
	achievements: Achievement[];
	earnedAchievements: Record<string, Achievement>;

	// Task completion
	isTaskCompleted: (taskId: string) => boolean;
	completeTask: (taskId: string) => void;
	resetTask: (taskId: string) => void;

	// Achievements
	earnAchievement: (achievement: Achievement) => void;
	hasEarnedAchievement: (achievementId: string) => boolean;
}

// Predefined achievements
export const ACHIEVEMENTS = {
	GETTING_STARTED: {
		id: "getting-started",
		title: "RunPod Explorer",
		description: "Successfully set up your RunPod account and API key",
		icon: "🚀",
	},
	DEPLOY_LLM: {
		id: "deploy-llm",
		title: "AI Architect",
		description: "Deployed your first LLM as an API",
		icon: "🧠",
	},
	// Add more achievements as needed
} as const;

export const useAchievementStore = create<AchievementState>()(
	persist(
		(set, get) => ({
			completedTasks: {},
			achievements: Object.values(ACHIEVEMENTS),
			earnedAchievements: {},

			isTaskCompleted: (taskId: string) => {
				return !!get().completedTasks[taskId];
			},

			completeTask: (taskId: string) => {
				// Update completed tasks
				set((state: AchievementState) => ({
					completedTasks: {
						...state.completedTasks,
						[taskId]: true,
					},
				}));

				// Check if this task has a corresponding achievement
				const achievement = get().achievements.find((a: Achievement) => a.id === taskId);
				if (achievement && !get().earnedAchievements[taskId]) {
					get().earnAchievement({
						...achievement,
						earnedAt: new Date(),
					});
				}
			},

			resetTask: (taskId: string) => {
				set((state: AchievementState) => {
					const newCompletedTasks = { ...state.completedTasks };
					delete newCompletedTasks[taskId];

					const newEarnedAchievements = { ...state.earnedAchievements };
					delete newEarnedAchievements[taskId];

					return {
						completedTasks: newCompletedTasks,
						earnedAchievements: newEarnedAchievements,
					};
				});
			},

			earnAchievement: (achievement: Achievement) => {
				set((state: AchievementState) => ({
					earnedAchievements: {
						...state.earnedAchievements,
						[achievement.id]: achievement,
					},
				}));
			},

			hasEarnedAchievement: (achievementId: string) => {
				return !!get().earnedAchievements[achievementId];
			},
		}),
		{
			name: "ai-uni-achievements",
		}
	)
);

export default useAchievementStore;
