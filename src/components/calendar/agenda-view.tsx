"use client";

import { useMemo } from "react";
import { format, isToday, isTomorrow, isPast, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { getPriorityColor, getPriorityLabel } from "@/lib/utils";
import type { Task } from "@/types";

interface AgendaViewProps {
  currentDate: Date;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export function AgendaView({ currentDate, tasks, onTaskClick }: AgendaViewProps) {
  const groupedTasks = useMemo(() => {
    const upcoming = tasks
      .filter((t) => !t.isDeleted && t.date)
      .sort((a, b) => a.date.localeCompare(b.date) || (a.startTime ?? "").localeCompare(b.startTime ?? ""));

    const map = new Map<string, Task[]>();
    upcoming.forEach((task) => {
      const key = task.date.slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(task);
    });
    return Array.from(map.entries());
  }, [tasks]);

  const formatDateHeader = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return "Hoje";
    if (isTomorrow(date)) return "Amanhã";
    return format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
  };

  const isOverdue = (task: Task) => {
    if (task.status === "completed" || task.status === "cancelled") return false;
    if (!task.startTime) return false;
    const taskDate = parseISO(`${task.date}T${task.startTime}`);
    return isPast(taskDate);
  };

  if (groupedTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <div className="text-4xl mb-3">📋</div>
        <p className="text-lg font-medium">Nenhuma tarefa encontrada</p>
        <p className="text-sm">Crie uma nova tarefa para começar</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-auto p-4 space-y-6">
      {groupedTasks.map(([dateStr, dayTasks]) => {
        const date = parseISO(dateStr);
        const todayDate = isToday(date);

        return (
          <div key={dateStr}>
            <div className="flex items-center gap-2 mb-3">
              <h3
                className={cn(
                  "text-sm font-semibold capitalize",
                  todayDate && "text-primary"
                )}
              >
                {formatDateHeader(dateStr)}
              </h3>
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">
                {dayTasks.length} {dayTasks.length === 1 ? "tarefa" : "tarefas"}
              </span>
            </div>

            <div className="space-y-1.5">
              {dayTasks.map((task) => {
                const overdue = isOverdue(task);
                return (
                  <button
                    key={task.id}
                    onClick={() => onTaskClick?.(task)}
                    className={cn(
                      "flex items-center gap-3 w-full p-3 rounded-lg border transition-colors text-left hover:bg-accent/50",
                      overdue && "border-red-300 bg-red-50/50 dark:border-red-800 dark:bg-red-950/30"
                    )}
                  >
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full shrink-0",
                        getPriorityColor(task.priority)
                      )}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-sm font-medium truncate",
                            task.status === "completed" && "line-through text-muted-foreground"
                          )}
                        >
                          {task.title}
                        </span>
                        {task.category && (
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded-full shrink-0 text-white"
                            style={{ backgroundColor: task.category.color }}
                          >
                            {task.category.name}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {task.startTime && (
                          <span className="text-xs text-muted-foreground">
                            {task.startTime}
                            {task.endTime ? ` - ${task.endTime}` : ""}
                          </span>
                        )}
                        <span className="text-[10px] text-muted-foreground">
                          {getPriorityLabel(task.priority)}
                        </span>
                      </div>
                    </div>

                    {task.status === "completed" && (
                      <span className="text-xs text-green-600 dark:text-green-400 shrink-0">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
