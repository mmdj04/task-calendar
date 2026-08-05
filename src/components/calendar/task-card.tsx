"use client";

import { cn } from "@/lib/utils";
import { getPriorityColor } from "@/lib/utils";
import type { Task } from "@/types";

interface TaskCardProps {
  task: Task;
  onClick?: (task: Task) => void;
  compact?: boolean;
}

export function TaskCard({ task, onClick, compact = false }: TaskCardProps) {
  return (
    <button
      onClick={() => onClick?.(task)}
      className={cn(
        "flex items-stretch w-full rounded-lg border bg-card text-card-foreground transition-all hover:shadow-md hover:border-primary/30 cursor-pointer text-left",
        task.status === "completed" && "opacity-60"
      )}
    >
      <div
        className="w-1 shrink-0 rounded-l-lg"
        style={{ backgroundColor: task.color ?? "hsl(var(--primary))" }}
      />

      <div className={cn("flex flex-col flex-1 min-w-0", compact ? "p-2" : "p-3")}>
        <div className="flex items-center gap-2">
          <div
            className={cn("w-1.5 h-1.5 rounded-full shrink-0", getPriorityColor(task.priority))}
          />
          <span
            className={cn(
              "font-medium truncate",
              compact ? "text-xs" : "text-sm",
              task.status === "completed" && "line-through text-muted-foreground"
            )}
          >
            {task.title}
          </span>
        </div>

        {!compact && task.startTime && (
          <div className="text-xs text-muted-foreground mt-1 ml-3.5">
            {task.startTime}
            {task.endTime ? ` - ${task.endTime}` : ""}
          </div>
        )}

        {!compact && task.category && (
          <div className="flex items-center gap-1.5 mt-1.5 ml-3.5">
            <span
              className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium text-white"
              style={{ backgroundColor: task.category.color }}
            >
              {task.category.name}
            </span>
          </div>
        )}
      </div>
    </button>
  );
}
