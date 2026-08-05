import { db } from "@/lib/db";
import type { CreateTaskInput, UpdateTaskInput, Priority, Status } from "@/types";
import type { Prisma } from "@prisma/client";

const includeTask = {
  category: true,
  tags: { include: { tag: true } },
  subtasks: true,
  checklists: true,
  attachments: true,
};

export async function getTasks(
  userId: string,
  filters?: {
    startDate?: string;
    endDate?: string;
    status?: Status;
    priority?: Priority;
    categoryId?: string;
    search?: string;
    isFavorite?: boolean;
    isDeleted?: boolean;
  }
) {
  const where: Prisma.TaskWhereInput = {
    userId,
    isDeleted: filters?.isDeleted ?? false,
  };

  if (filters?.startDate || filters?.endDate) {
    where.date = {};
    if (filters.startDate) where.date.gte = new Date(filters.startDate);
    if (filters.endDate) where.date.lte = new Date(filters.endDate);
  }

  if (filters?.status) where.status = filters.status;
  if (filters?.priority) where.priority = filters.priority;
  if (filters?.categoryId) where.categoryId = filters.categoryId;
  if (filters?.isFavorite) where.isFavorite = true;

  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search } },
      { description: { contains: filters.search } },
      { notes: { contains: filters.search } },
    ];
  }

  return db.task.findMany({
    where,
    include: includeTask,
    orderBy: [{ date: "asc" }, { order: "asc" }],
  });
}

export async function getTaskById(id: string) {
  return db.task.findUnique({
    where: { id },
    include: includeTask,
  });
}

export async function createTask(userId: string, data: CreateTaskInput) {
  return db.task.create({
    data: {
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      startTime: data.startTime,
      endTime: data.endTime,
      duration: data.duration,
      priority: data.priority ?? "medium",
      status: data.status ?? "not_started",
      color: data.color,
      categoryId: data.categoryId,
      reminderMinutes: data.reminderMinutes,
      recurringType: data.recurringType,
      recurringEnd: data.recurringEnd ? new Date(data.recurringEnd) : null,
      notes: data.notes,
      userId,
      subtasks: data.subtasks
        ? { create: data.subtasks.map((s, i) => ({ title: s.title, order: i })) }
        : undefined,
      checklists: data.checklists
        ? { create: data.checklists.map((c, i) => ({ title: c.title, order: i })) }
        : undefined,
      tags: data.tagIds
        ? { create: data.tagIds.map((tagId) => ({ tagId })) }
        : undefined,
    },
    include: includeTask,
  });
}

export async function updateTask(id: string, data: UpdateTaskInput) {
  const { id: _id, tagIds, subtasks, checklists, ...rest } = data;

  const updateData: Prisma.TaskUpdateInput = {
    ...rest,
    date: rest.date ? new Date(rest.date) : undefined,
    recurringEnd: rest.recurringEnd ? new Date(rest.recurringEnd) : undefined,
  };

  if (tagIds !== undefined) {
    await db.taskTag.deleteMany({ where: { taskId: id } });
    updateData.tags = {
      create: tagIds.map((tagId) => ({ tagId })),
    };
  }

  return db.task.update({
    where: { id },
    data: updateData,
    include: includeTask,
  });
}

export async function deleteTask(id: string) {
  return db.task.update({
    where: { id },
    data: { isDeleted: true, deletedAt: new Date() },
  });
}

export async function restoreTask(id: string) {
  return db.task.update({
    where: { id },
    data: { isDeleted: false, deletedAt: null },
  });
}

export async function permanentDeleteTask(id: string) {
  return db.task.delete({ where: { id } });
}

export async function toggleFavorite(id: string) {
  const task = await db.task.findUnique({ where: { id }, select: { isFavorite: true } });
  return db.task.update({
    where: { id },
    data: { isFavorite: !task?.isFavorite },
    include: includeTask,
  });
}

export async function duplicateTask(id: string, userId: string) {
  const original = await db.task.findUnique({
    where: { id },
    include: { subtasks: true, checklists: true, tags: true },
  });

  if (!original) throw new Error("Task not found");

  return db.task.create({
    data: {
      title: `${original.title} (cópia)`,
      description: original.description,
      date: original.date,
      startTime: original.startTime,
      endTime: original.endTime,
      duration: original.duration,
      priority: original.priority,
      status: "not_started",
      color: original.color,
      categoryId: original.categoryId,
      reminderMinutes: original.reminderMinutes,
      notes: original.notes,
      userId,
      subtasks: {
        create: original.subtasks.map((s) => ({
          title: s.title,
          completed: false,
          order: s.order,
        })),
      },
      checklists: {
        create: original.checklists.map((c) => ({
          title: c.title,
          checked: false,
          order: c.order,
        })),
      },
      tags: {
        create: original.tags.map((t) => ({ tagId: t.tagId })),
      },
    },
    include: includeTask,
  });
}

export async function moveTask(id: string, newDate: string) {
  return db.task.update({
    where: { id },
    data: { date: new Date(newDate) },
    include: includeTask,
  });
}

export async function addTaskHistory(taskId: string, action: string, field?: string, oldValue?: string, newValue?: string) {
  return db.taskHistory.create({
    data: { taskId, action, field, oldValue, newValue },
  });
}

export async function getTaskHistory(taskId: string) {
  return db.taskHistory.findMany({
    where: { taskId },
    orderBy: { createdAt: "desc" },
  });
}
