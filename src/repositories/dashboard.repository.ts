import { db } from "@/lib/db";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format,
  eachDayOfInterval,
  subDays,
} from "date-fns";

export async function getDashboardStats(userId: string) {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 0 });
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const [
    totalTasks,
    completedTasks,
    overdueTasks,
    weekTasks,
    monthTasks,
    completedWeekTasks,
    allTasks,
    categoryTime,
  ] = await Promise.all([
    db.task.count({ where: { userId, isDeleted: false } }),
    db.task.count({ where: { userId, isDeleted: false, status: "completed" } }),
    db.task.count({
      where: {
        userId,
        isDeleted: false,
        date: { lt: now },
        status: { not: "completed" },
      },
    }),
    db.task.count({
      where: { userId, isDeleted: false, date: { gte: weekStart, lte: weekEnd } },
    }),
    db.task.count({
      where: { userId, isDeleted: false, date: { gte: monthStart, lte: monthEnd } },
    }),
    db.task.count({
      where: {
        userId,
        isDeleted: false,
        status: "completed",
        date: { gte: weekStart, lte: weekEnd },
      },
    }),
    db.task.findMany({
      where: { userId, isDeleted: false, status: "completed" },
      select: { date: true, duration: true, categoryId: true },
    }),
    db.pomodoroSession.findMany({
      where: {
        userId,
        type: "work",
        startedAt: { gte: monthStart, lte: monthEnd },
      },
      select: {
        duration: true,
        taskId: true,
      },
    }),
  ]);

  const productivity = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const weeklyData = eachDayOfInterval({ start: weekStart, end: weekEnd }).map((day) => {
    const dayStr = format(day, "yyyy-MM-dd");
    const count = allTasks.filter((t) => format(new Date(t.date), "yyyy-MM-dd") === dayStr).length;
    return { day: format(day, "EEE"), count };
  });

  const monthlyWeeks = [];
  for (let i = 0; i < 4; i++) {
    const weekStart = subDays(now, (3 - i) * 7);
    const weekEnd = subDays(now, (2 - i) * 7);
    const count = allTasks.filter((t) => {
      const d = new Date(t.date);
      return d >= weekStart && d <= weekEnd;
    }).length;
    monthlyWeeks.push({ week: `Sem ${i + 1}`, count });
  }

  const categoryTimeMap: Record<string, number> = {};
  categoryTime.forEach((session) => {
    categoryTimeMap["Geral"] = (categoryTimeMap["Geral"] ?? 0) + session.duration;
  });

  const categoryTimeArray = Object.entries(categoryTimeMap).map(([category, time]) => ({
    category,
    time: Math.round(time / 60),
  }));

  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const day = subDays(today, i);
    const dayStr = format(day, "yyyy-MM-dd");
    const hasCompleted = allTasks.some(
      (t) => format(new Date(t.date), "yyyy-MM-dd") === dayStr
    );
    if (hasCompleted) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  return {
    totalTasks,
    completedTasks,
    overdueTasks,
    weekTasks,
    monthTasks,
    productivity,
    weeklyData,
    monthlyData: monthlyWeeks,
    categoryTime: categoryTimeArray,
    streak,
  };
}

export async function getUpcomingTasks(userId: string, days: number = 7) {
  const now = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + days);

  return db.task.findMany({
    where: {
      userId,
      isDeleted: false,
      date: { gte: now, lte: endDate },
      status: { not: "completed" },
    },
    include: { category: true },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });
}

export async function getOverdueTasks(userId: string) {
  return db.task.findMany({
    where: {
      userId,
      isDeleted: false,
      date: { lt: new Date() },
      status: { not: "completed" },
    },
    include: { category: true },
    orderBy: { date: "asc" },
  });
}

export async function getTodayTasks(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return db.task.findMany({
    where: {
      userId,
      isDeleted: false,
      date: { gte: today, lt: tomorrow },
    },
    include: { category: true, subtasks: true },
    orderBy: [{ startTime: "asc" }, { order: "asc" }],
  });
}
