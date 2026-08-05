"use client";

import { useMemo } from "react";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isToday,
  isSameDay,
} from "date-fns";
import { cn } from "@/lib/utils";
import { HOURS } from "@/lib/constants";
import type { Task } from "@/types";

interface WeekViewProps {
  currentDate: Date;
  tasks: Task[];
  onDayClick?: (date: Date) => void;
  onTaskClick?: (task: Task) => void;
}

export function WeekView({ currentDate, tasks, onDayClick, onTaskClick }: WeekViewProps) {
  const days = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    const end = endOfWeek(currentDate, { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach((task) => {
      if (!task.startTime) return;
      const key = task.date.slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(task);
    });
    return map;
  }, [tasks]);

  const getTaskPosition = (task: Task) => {
    const [startH, startM] = (task.startTime ?? "00:00").split(":").map(Number);
    const endMinutes = task.endTime
      ? (() => {
          const [eH, eM] = task.endTime.split(":").map(Number);
          return eH * 60 + eM;
        })()
      : startH * 60 + startM + 60;
    const top = (startH * 60 + startM) * (64 / 60);
    const height = Math.max((endMinutes - (startH * 60 + startM)) * (64 / 60), 20);
    return { top, height };
  };

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="flex border-b sticky top-0 bg-background z-10">
        <div className="w-16 shrink-0 border-r" />
        {days.map((day) => {
          const today = isToday(day);
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "flex-1 py-2 text-center border-r last:border-r-0",
                today && "bg-primary/5"
              )}
            >
              <div className="text-xs text-muted-foreground">
                {format(day, "EEE")}
              </div>
              <div
                className={cn(
                  "inline-flex items-center justify-center w-7 h-7 text-sm font-medium rounded-full",
                  today && "bg-primary text-primary-foreground"
                )}
              >
                {format(day, "d")}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-1">
        <div className="w-16 shrink-0 border-r">
          {HOURS.map((hour) => (
            <div key={hour} className="h-16 border-b flex items-start justify-end pr-2 pt-0.5">
              <span className="text-[10px] text-muted-foreground">{hour}</span>
            </div>
          ))}
        </div>

        {days.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const dayTasks = tasksByDate.get(dateKey) ?? [];
          const today = isToday(day);

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "flex-1 relative border-r last:border-r-0",
                today && "bg-primary/5"
              )}
              onClick={() => onDayClick?.(day)}
            >
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
                />
              )}

              {dayTasks.map((task) => {
                const { top, height } = getTaskPosition(task);
                return (
                  <button
                    key={task.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTaskClick?.(task);
                    }}
                    className={cn(
                      "absolute left-0.5 right-0.5 rounded px-1.5 py-0.5 text-[11px] leading-tight overflow-hidden cursor-pointer transition-opacity hover:opacity-90 z-10 border border-black/10",
                      task.color ? "text-white" : "bg-primary/20 text-primary"
                    )}
                    style={{
                      top: `${top}px`,
                      height: `${height}px`,
                      backgroundColor: task.color ?? undefined,
                    }}
                  >
                    <div className="font-medium truncate">{task.title}</div>
                    {height > 28 && task.startTime && (
                      <div className="opacity-80 text-[10px]">
                        {task.startTime}
                        {task.endTime ? ` - ${task.endTime}` : ""}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
