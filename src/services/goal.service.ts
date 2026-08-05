import * as goalRepo from "@/repositories/goal.repository";
import type { CreateGoalInput } from "@/types";

export async function getGoals(userId: string, type?: "weekly" | "monthly") {
  return goalRepo.getGoals(userId, type);
}

export async function createGoal(userId: string, data: CreateGoalInput) {
  return goalRepo.createGoal(userId, data);
}

export async function updateGoal(id: string, data: Partial<CreateGoalInput & { current: number; completed: boolean }>) {
  return goalRepo.updateGoal(id, data);
}

export async function deleteGoal(id: string) {
  return goalRepo.deleteGoal(id);
}

export async function updateGoalProgress(id: string, increment?: number) {
  return goalRepo.updateGoalProgress(id, increment);
}
