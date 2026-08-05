"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { X, Plus, Trash2, GripVertical } from "lucide-react";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["pending", "in-progress", "completed"]),
  category: z.string().optional(),
  color: z.string().optional(),
  tags: z.array(z.string()).default([]),
  reminderMinutes: z.string().optional(),
  notes: z.string().optional(),
  recurring: z.enum(["none", "daily", "weekly", "monthly"]).default("none"),
  subtasks: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        completed: z.boolean(),
      })
    )
    .default([]),
  checklists: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
        checked: z.boolean(),
      })
    )
    .default([]),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<TaskFormData>;
  onSubmit: (data: TaskFormData) => void;
  mode?: "create" | "edit";
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

export function TaskForm({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  mode = "create",
}: TaskFormProps) {
  const [tagInput, setTagInput] = useState("");

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema) as never,
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      date: initialData?.date ?? new Date().toISOString().split("T")[0],
      startTime: initialData?.startTime ?? "",
      endTime: initialData?.endTime ?? "",
      priority: initialData?.priority ?? "medium",
      status: initialData?.status ?? "pending",
      category: initialData?.category ?? "",
      color: initialData?.color ?? "#3b82f6",
      tags: initialData?.tags ?? [],
      reminderMinutes: initialData?.reminderMinutes ?? "",
      notes: initialData?.notes ?? "",
      recurring: initialData?.recurring ?? "none",
      subtasks: initialData?.subtasks ?? [],
      checklists: initialData?.checklists ?? [],
    },
  });

  const {
    fields: subtaskFields,
    append: appendSubtask,
    remove: removeSubtask,
  } = useFieldArray({ control: form.control, name: "subtasks" });

  const {
    fields: checklistFields,
    append: appendChecklist,
    remove: removeChecklist,
  } = useFieldArray({ control: form.control, name: "checklists" });

  const tags = form.watch("tags");
  const selectedColor = form.watch("color");

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      form.setValue("tags", [...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    form.setValue(
      "tags",
      tags.filter((t) => t !== tag)
    );
  };

  const handleSubmit = (data: TaskFormData) => {
    onSubmit(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create Task" : "Edit Task"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title *</label>
              <Input placeholder="Task title" {...form.register("title")} />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="Add a description..." rows={3} {...form.register("description")} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date *</label>
                <Input type="date" {...form.register("date")} />
                {form.formState.errors.date && (
                  <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Start Time</label>
                <Input type="time" {...form.register("startTime")} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">End Time</label>
                <Input type="time" {...form.register("endTime")} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...form.register("priority")}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...form.register("status")}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...form.register("category")}
                >
                  <option value="">None</option>
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                  <option value="health">Health</option>
                  <option value="finance">Finance</option>
                  <option value="learning">Learning</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Recurring</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...form.register("recurring")}
                >
                  <option value="none">None</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Color</label>
              <div className="flex items-center gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={cn(
                      "h-6 w-6 rounded-full border-2 transition-all",
                      selectedColor === color
                        ? "border-foreground scale-110"
                        : "border-transparent"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => form.setValue("color", color)}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" variant="outline" size="icon" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea placeholder="Additional notes..." rows={3} {...form.register("notes")} />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Subtasks</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendSubtask({
                      id: crypto.randomUUID(),
                      title: "",
                      completed: false,
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Subtask
                </Button>
              </div>
              {subtaskFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Subtask title"
                    {...form.register(`subtasks.${index}.title`)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSubtask(index)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Checklist</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendChecklist({
                      id: crypto.randomUUID(),
                      text: "",
                      checked: false,
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Item
                </Button>
              </div>
              {checklistFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    {...form.register(`checklists.${index}.checked`)}
                  />
                  <Input
                    placeholder="Checklist item"
                    {...form.register(`checklists.${index}.text`)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeChecklist(index)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {mode === "create" ? "Create Task" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
      </DialogContent>
    </Dialog>
  );
}
