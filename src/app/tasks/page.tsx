"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasksAction, createTaskAction, deleteTaskAction, getCategoriesAction } from "@/actions";
import { TaskList } from "@/components/tasks/task-list";
import { TaskForm } from "@/components/tasks/task-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, X } from "lucide-react";
import type { Status, Priority } from "@/types";

export default function TasksPage() {
  const queryClient = useQueryClient();
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks", "list", statusFilter, priorityFilter, categoryFilter, searchQuery],
    queryFn: () =>
      getTasksAction({
        status: statusFilter !== "all" ? (statusFilter as Status) : undefined,
        priority: priorityFilter !== "all" ? (priorityFilter as Priority) : undefined,
        categoryId: categoryFilter !== "all" ? categoryFilter : undefined,
        search: searchQuery || undefined,
        isDeleted: false,
      }),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesAction,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTaskAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const hasFilters =
    statusFilter !== "all" ||
    priorityFilter !== "all" ||
    categoryFilter !== "all" ||
    searchQuery !== "";

  const resetFilters = () => {
    setStatusFilter("all");
    setPriorityFilter("all");
    setCategoryFilter("all");
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 md:p-6">
        <div className="flex items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Tasks</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage and organize your tasks</p>
          </div>
          <Button onClick={() => setTaskFormOpen(true)} size="sm" className="shrink-0">
            <Plus className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Add </span>Task
          </Button>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground hidden md:block" />
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v ?? "all")}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v ?? "all")}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-[60px] w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <TaskList
            tasks={(tasks ?? []) as any}
            onDelete={(task) => deleteMutation.mutate(task.id)}
          />
        )}
      </div>

      <TaskForm
        open={taskFormOpen}
        onOpenChange={setTaskFormOpen}
        onSubmit={() => {
          setTaskFormOpen(false);
          queryClient.invalidateQueries({ queryKey: ["tasks"] });
        }}
        mode="create"
      />
    </div>
  );
}
