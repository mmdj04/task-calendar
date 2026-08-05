import { db } from "@/lib/db";
import type { CreateGoalInput } from "@/types";

export async function getGoals(userId: string, type?: "weekly" | "monthly") {
  return db.goal.findMany({
    where: {
      userId,
      ...(type ? { type } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getGoalById(id: string) {
  return db.goal.findUnique({ where: { id } });
}

export async function createGoal(userId: string, data: CreateGoalInput) {
  return db.goal.create({
    data: {
      title: data.title,
      description: data.description,
      type: data.type,
      target: data.target,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      userId,
    },
  });
}

export async function updateGoal(id: string, data: Partial<CreateGoalInput & { current: number; completed: boolean }>) {
  return db.goal.update({
    where: { id },
    data: {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    },
  });
}

export async function deleteGoal(id: string) {
  return db.goal.delete({ where: { id } });
}

export async function updateGoalProgress(id: string, increment: number = 1) {
  const goal = await db.goal.findUnique({ where: { id } });
  if (!goal) throw new Error("Goal not found");

  const newCurrent = Math.min(goal.current + increment, goal.target);
  return db.goal.update({
    where: { id },
    data: {
      current: newCurrent,
      completed: newCurrent >= goal.target,
    },
  });
}
