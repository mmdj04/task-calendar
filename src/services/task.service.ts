import * as taskRepo from "@/repositories/task.repository";
import type { CreateTaskInput, UpdateTaskInput, Priority, Status } from "@/types";
import { generateRecurringDates } from "@/lib/utils";

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
  return taskRepo.getTasks(userId, filters);
}

export async function getTaskById(id: string) {
  return taskRepo.getTaskById(id);
}

export async function createTask(userId: string, data: CreateTaskInput) {
  const task = await taskRepo.createTask(userId, data);

  if (data.recurringType) {
    const startDate = new Date(data.date);
    const recurringDates = generateRecurringDates(
      startDate,
      data.recurringType,
      data.recurringEnd ? new Date(data.recurringEnd) : null,
      50
    );

    for (let i = 1; i < recurringDates.length; i++) {
      await taskRepo.createTask(userId, {
        ...data,
        date: recurringDates[i].toISOString(),
        recurringType: undefined,
      });
    }
  }

  await taskRepo.addTaskHistory(task.id, "created");

  return task;
}

export async function updateTask(id: string, data: UpdateTaskInput) {
  const oldTask = await taskRepo.getTaskById(id);
  const task = await taskRepo.updateTask(id, data);

  if (oldTask) {
    const changes = Object.entries(data).filter(
      ([key, value]) => key !== "id" && value !== undefined && (oldTask as Record<string, unknown>)[key] !== value
    );

    for (const [field, newValue] of changes) {
      await taskRepo.addTaskHistory(
        id,
        "updated",
        field,
        String((oldTask as Record<string, unknown>)[field]),
        String(newValue)
      );
    }
  }

  return task;
}

export async function deleteTask(id: string) {
  const task = await taskRepo.deleteTask(id);
  await taskRepo.addTaskHistory(id, "deleted");
  return task;
}

export async function restoreTask(id: string) {
  return taskRepo.restoreTask(id);
}

export async function permanentDeleteTask(id: string) {
  return taskRepo.permanentDeleteTask(id);
}

export async function toggleFavorite(id: string) {
  return taskRepo.toggleFavorite(id);
}

export async function duplicateTask(id: string, userId: string) {
  return taskRepo.duplicateTask(id, userId);
}

export async function moveTask(id: string, newDate: string) {
  const oldTask = await taskRepo.getTaskById(id);
  const task = await taskRepo.moveTask(id, newDate);

  if (oldTask) {
    await taskRepo.addTaskHistory(
      id,
      "moved",
      "date",
      oldTask.date.toISOString(),
      newDate
    );
  }

  return task;
}

export async function searchTasks(userId: string, query: string) {
  return taskRepo.getTasks(userId, { search: query, isDeleted: false });
}

export async function getTaskHistory(taskId: string) {
  return taskRepo.getTaskHistory(taskId);
}
