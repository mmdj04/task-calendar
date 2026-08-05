import { db } from "@/lib/db";
import type { CreateTagInput } from "@/types";

export async function getTags(userId: string) {
  return db.tag.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
}

export async function createTag(userId: string, data: CreateTagInput) {
  return db.tag.create({
    data: {
      name: data.name,
      color: data.color ?? "#64748b",
      userId,
    },
  });
}

export async function updateTag(id: string, data: Partial<CreateTagInput>) {
  return db.tag.update({
    where: { id },
    data,
  });
}

export async function deleteTag(id: string) {
  return db.tag.delete({ where: { id } });
}
