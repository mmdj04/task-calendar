import { db } from "@/lib/db";
import type { CreateCategoryInput } from "@/types";

export async function getCategories(userId: string) {
  return db.category.findMany({
    where: { userId },
    include: { _count: { select: { tasks: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getCategoryById(id: string) {
  return db.category.findUnique({ where: { id } });
}

export async function createCategory(userId: string, data: CreateCategoryInput) {
  return db.category.create({
    data: {
      name: data.name,
      color: data.color ?? "#6366f1",
      icon: data.icon ?? "folder",
      userId,
    },
  });
}

export async function updateCategory(id: string, data: Partial<CreateCategoryInput>) {
  return db.category.update({
    where: { id },
    data,
  });
}

export async function deleteCategory(id: string) {
  return db.category.delete({ where: { id } });
}

export async function seedDefaultCategories(userId: string) {
  const defaults = [
    { name: "Trabalho", color: "#6366f1", icon: "briefcase" },
    { name: "Pessoal", color: "#ec4899", icon: "user" },
    { name: "Saúde", color: "#22c55e", icon: "heart" },
    { name: "Estudos", color: "#f59e0b", icon: "book-open" },
    { name: "Casa", color: "#8b5cf6", icon: "home" },
  ];

  const existing = await db.category.findMany({ where: { userId } });
  const existingNames = existing.map((c) => c.name);

  const toCreate = defaults.filter((d) => !existingNames.includes(d.name));

  if (toCreate.length > 0) {
    await db.category.createMany({
      data: toCreate.map((c) => ({ ...c, userId })),
    });
  }

  return getCategories(userId);
}
