import * as tagRepo from "@/repositories/tag.repository";
import type { CreateTagInput } from "@/types";

export async function getTags(userId: string) {
  return tagRepo.getTags(userId);
}

export async function createTag(userId: string, data: CreateTagInput) {
  return tagRepo.createTag(userId, data);
}

export async function updateTag(id: string, data: Partial<CreateTagInput>) {
  return tagRepo.updateTag(id, data);
}

export async function deleteTag(id: string) {
  return tagRepo.deleteTag(id);
}
