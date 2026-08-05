import { db } from "@/lib/db";
import type { PomodoroType } from "@/types";

export async function getPomodoroSessions(userId: string, startDate?: string, endDate?: string) {
  const where: Record<string, unknown> = { userId };

  if (startDate || endDate) {
    where.startedAt = {};
    if (startDate) (where.startedAt as Record<string, unknown>).gte = new Date(startDate);
    if (endDate) (where.startedAt as Record<string, unknown>).lte = new Date(endDate);
  }

  return db.pomodoroSession.findMany({
    where,
    orderBy: { startedAt: "desc" },
  });
}

export async function startPomodoro(userId: string, type: PomodoroType, taskId?: string) {
  return db.pomodoroSession.create({
    data: {
      duration: 0,
      type,
      taskId,
      userId,
    },
  });
}

export async function endPomodoro(id: string, duration: number) {
  return db.pomodoroSession.update({
    where: { id },
    data: {
      duration,
      endedAt: new Date(),
    },
  });
}

export async function getPomodoroStats(userId: string, startDate: string, endDate: string) {
  const sessions = await db.pomodoroSession.findMany({
    where: {
      userId,
      startedAt: { gte: new Date(startDate), lte: new Date(endDate) },
      type: "work",
    },
  });

  const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);
  const totalSessions = sessions.length;

  return { totalMinutes, totalSessions, sessions };
}
