import * as categoryRepo from "@/repositories/category.repository";
import type { CreateCategoryInput } from "@/types";

export async function getCategories(userId: string) {
  return categoryRepo.getCategories(userId);
}

export async function createCategory(userId: string, data: CreateCategoryInput) {
  return categoryRepo.createCategory(userId, data);
}

export async function updateCategory(id: string, data: Partial<CreateCategoryInput>) {
  return categoryRepo.updateCategory(id, data);
}

export async function deleteCategory(id: string) {
  return categoryRepo.deleteCategory(id);
}

export async function seedDefaultCategories(userId: string) {
  return categoryRepo.seedDefaultCategories(userId);
}
