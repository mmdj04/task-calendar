"use server";

import * as taskService from "@/services/task.service";
import * as categoryService from "@/services/category.service";
import * as tagService from "@/services/tag.service";
import * as goalService from "@/services/goal.service";
import * as dashboardRepo from "@/repositories/dashboard.repository";
import type { CreateTaskInput, UpdateTaskInput, CreateCategoryInput, CreateTagInput, CreateGoalInput, Priority, Status } from "@/types";

const DEMO_USER_ID = "demo-user";

export async function getTasksAction(filters?: {
  startDate?: string;
  endDate?: string;
  status?: Status;
  priority?: Priority;
  categoryId?: string;
  search?: string;
  isFavorite?: boolean;
  isDeleted?: boolean;
}) {
  return taskService.getTasks(DEMO_USER_ID, filters);
}

export async function getTaskByIdAction(id: string) {
  return taskService.getTaskById(id);
}

export async function createTaskAction(data: CreateTaskInput) {
  return taskService.createTask(DEMO_USER_ID, data);
}

export async function updateTaskAction(data: UpdateTaskInput) {
  return taskService.updateTask(data.id, data);
}

export async function deleteTaskAction(id: string) {
  return taskService.deleteTask(id);
}

export async function restoreTaskAction(id: string) {
  return taskService.restoreTask(id);
}

export async function permanentDeleteTaskAction(id: string) {
  return taskService.permanentDeleteTask(id);
}

export async function toggleFavoriteAction(id: string) {
  return taskService.toggleFavorite(id);
}

export async function duplicateTaskAction(id: string) {
  return taskService.duplicateTask(id, DEMO_USER_ID);
}

export async function moveTaskAction(id: string, newDate: string) {
  return taskService.moveTask(id, newDate);
}

export async function searchTasksAction(query: string) {
  return taskService.searchTasks(DEMO_USER_ID, query);
}

export async function getTaskHistoryAction(taskId: string) {
  return taskService.getTaskHistory(taskId);
}

export async function getCategoriesAction() {
  return categoryService.getCategories(DEMO_USER_ID);
}

export async function createCategoryAction(data: CreateCategoryInput) {
  return categoryService.createCategory(DEMO_USER_ID, data);
}

export async function updateCategoryAction(id: string, data: Partial<CreateCategoryInput>) {
  return categoryService.updateCategory(id, data);
}

export async function deleteCategoryAction(id: string) {
  return categoryService.deleteCategory(id);
}

export async function seedCategoriesAction() {
  return categoryService.seedDefaultCategories(DEMO_USER_ID);
}

export async function getTagsAction() {
  return tagService.getTags(DEMO_USER_ID);
}

export async function createTagAction(data: CreateTagInput) {
  return tagService.createTag(DEMO_USER_ID, data);
}

export async function updateTagAction(id: string, data: Partial<CreateTagInput>) {
  return tagService.updateTag(id, data);
}

export async function deleteTagAction(id: string) {
  return tagService.deleteTag(id);
}

export async function getGoalsAction(type?: "weekly" | "monthly") {
  return goalService.getGoals(DEMO_USER_ID, type);
}

export async function createGoalAction(data: CreateGoalInput) {
  return goalService.createGoal(DEMO_USER_ID, data);
}

export async function updateGoalAction(id: string, data: Partial<CreateGoalInput & { current: number; completed: boolean }>) {
  return goalService.updateGoal(id, data);
}

export async function deleteGoalAction(id: string) {
  return goalService.deleteGoal(id);
}

export async function updateGoalProgressAction(id: string, increment?: number) {
  return goalService.updateGoalProgress(id, increment);
}

export async function getDashboardStatsAction() {
  return dashboardRepo.getDashboardStats(DEMO_USER_ID);
}

export async function getUpcomingTasksAction(days?: number) {
  return dashboardRepo.getUpcomingTasks(DEMO_USER_ID, days);
}

export async function getOverdueTasksAction() {
  return dashboardRepo.getOverdueTasks(DEMO_USER_ID);
}

export async function getTodayTasksAction() {
  return dashboardRepo.getTodayTasks(DEMO_USER_ID);
}

export async function exportTasksAction() {
  const tasks = await taskService.getTasks(DEMO_USER_ID, { isDeleted: false });
  const categories = await categoryService.getCategories(DEMO_USER_ID);
  const tags = await tagService.getTags(DEMO_USER_ID);
  const goals = await goalService.getGoals(DEMO_USER_ID);

  return {
    tasks,
    categories,
    tags,
    goals,
    exportedAt: new Date().toISOString(),
    version: "1.0.0",
  };
}

export async function importTasksAction(data: {
  tasks?: CreateTaskInput[];
  categories?: CreateCategoryInput[];
  tags?: CreateTagInput[];
}) {
  const results = { tasks: 0, categories: 0, tags: 0 };

  if (data.categories) {
    for (const cat of data.categories) {
      try {
        await categoryService.createCategory(DEMO_USER_ID, cat);
        results.categories++;
      } catch {}
    }
  }

  if (data.tags) {
    for (const tag of data.tags) {
      try {
        await tagService.createTag(DEMO_USER_ID, tag);
        results.tags++;
      } catch {}
    }
  }

  if (data.tasks) {
    for (const task of data.tasks) {
      try {
        await taskService.createTask(DEMO_USER_ID, task);
        results.tasks++;
      } catch {}
    }
  }

  return results;
}
