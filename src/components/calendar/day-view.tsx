"use client";

import { useMemo } from "react";
import { format, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { HOURS } from "@/lib/constants";
import type { Task } from "@/types";

interface DayViewProps {
  currentDate: Date;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export function DayView({ currentDate, tasks, onTaskClick }: DayViewProps) {
  const dayTasks = useMemo(() => {
    const dateKey = format(currentDate, "yyyy-MM-dd");
    return tasks
      .filter((t) => t.date.slice(0, 10) === dateKey && t.startTime)
      .sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? ""));
  }, [currentDate, tasks]);

  const today = isToday(currentDate);

  const getTaskPosition = (task: Task) => {
    const [startH, startM] = (task.startTime ?? "00:00").split(":").map(Number);
    const endMinutes = task.endTime
      ? (() => {
          const [eH, eM] = task.endTime.split(":").map(Number);
          return eH * 60 + eM;
        })()
      : startH * 60 + (task.duration ?? 60);
    const top = (startH * 60 + startM) * (64 / 60);
    const height = Math.max((endMinutes - (startH * 60 + startM)) * (64 / 60), 24);
    return { top, height };
  };

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="flex border-b sticky top-0 bg-background z-10">
        <div className="w-16 shrink-0 border-r" />
        <div className="flex-1 py-3 px-4">
          <div className="text-sm text-muted-foreground">
            {format(currentDate, "EEEE")}
          </div>
          <div
            className={cn(
              "text-2xl font-bold",
              today && "text-primary"
            )}
          >
            {format(currentDate, "d 'de' MMMM")}
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        <div className="w-16 shrink-0 border-r">
          {HOURS.map((hour) => (
            <div key={hour} className="h-16 border-b flex items-start justify-end pr-2 pt-0.5">
              <span className="text-[10px] text-muted-foreground">{hour}</span>
            </div>
          ))}
        </div>

        <div className="flex-1 relative">
          {HOURS.map((_, i) => (
            <div key={i} className="h-16 border-b" />
          ))}

          {today && (
            <div
              className="absolute left-0 right-0 h-0.5 bg-red-500 z-20"
              style={{
                top: `${
                  (new Date().getHours() * 60 + new Date().getMinutes()) *
                  (64 / 60)
                }px`,
              }}
            >
              <div className="absolute -left-1.5 -top-1.5 w-3 h-3 rounded-full bg-red-500" />
            </div>
          )}

          {dayTasks.map((task) => {
            const { top, height } = getTaskPosition(task);
            return (
              <button
                key={task.id}
                onClick={() => onTaskClick?.(task)}
                className={cn(
                  "absolute left-2 right-4 rounded-lg px-3 py-1.5 text-sm overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-primary/30 z-10 border",
                  task.color
                    ? "text-white border-transparent"
                    : "bg-primary/10 text-primary border-primary/20"
                )}
                style={{
                  top: `${top}px`,
                  height: `${height}px`,
                  backgroundColor: task.color ?? undefined,
                }}
              >
                <div className="font-medium truncate">{task.title}</div>
                {height > 32 && (
                  <div className="text-xs opacity-80 mt-0.5">
                    {task.startTime}
                    {task.endTime ? ` - ${task.endTime}` : ""}
                  </div>
                )}
                {height > 52 && task.category && (
                  <div className="text-[10px] opacity-70 mt-0.5">
                    {task.category.name}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
