"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchTasksAction } from "@/actions";
import { useAppStore } from "@/hooks/use-app-store";
import { TaskDetail } from "@/components/tasks/task-detail";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, CalendarDays, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { Task } from "@/types";
import { getPriorityColor, getPriorityLabel } from "@/lib/utils";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const selectedTask = useAppStore((s) => s.selectedTask);
  const setSelectedTask = useAppStore((s) => s.setSelectedTask);
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);

  const { data: results, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchTasksAction(query),
    enabled: query.length >= 2,
  });

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setTaskDetailOpen(true);
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 md:p-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-4">Search</h1>
        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks by title, category, or description..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
            autoFocus
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        {query.length < 2 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
            <Search className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">Start typing to search</p>
            <p className="text-sm">Search by task title, category, or description</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-4 max-w-2xl">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[80px] w-full rounded-lg" />
            ))}
          </div>
        ) : results && results.length > 0 ? (
          <div className="space-y-4 max-w-2xl">
            <p className="text-sm text-muted-foreground">
              Found {results.length} result{results.length !== 1 ? "s" : ""}
            </p>
            {results.map((task) => (
              <Card
                key={task.id}
                className="cursor-pointer transition-colors hover:bg-accent/50"
                onClick={() => handleTaskClick(task)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="h-3 w-3 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: task.color ?? "#3b82f6" }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium truncate">
                          {highlightMatch(task.title, query)}
                        </h3>
                        {task.category && (
                          <Badge
                          variant="outline"
                          className="text-xs shrink-0"
                          style={{ borderColor: task.category.color, color: task.category.color }}
                          >
                          <Tag className="h-3 w-3 mr-1" />
                          {highlightMatch(task.category.name, query)}
                          </Badge>
                        )}
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {highlightMatch(task.description, query)}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <CalendarDays className="h-3 w-3" />
                          {format(new Date(task.date), "MMM d, yyyy")}
                        </div>
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full",
                            getPriorityColor(task.priority as any)
                          )}
                        />
                        <span className="text-xs text-muted-foreground">
                          {getPriorityLabel(task.priority as any)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
            <p className="text-lg font-medium">No results found</p>
            <p className="text-sm">Try a different search term</p>
          </div>
        )}
      </div>

      {selectedTask && (
        <TaskDetail
          open={taskDetailOpen}
          onOpenChange={setTaskDetailOpen}
          task={selectedTask as any}
        />
      )}
    </div>
  );
}
