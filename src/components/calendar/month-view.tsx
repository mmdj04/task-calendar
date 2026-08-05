"use client";

import { useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  format,
} from "date-fns";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";

interface MonthViewProps {
  currentDate: Date;
  tasks: Task[];
  onDayClick?: (date: Date) => void;
  onTaskClick?: (task: Task) => void;
}

export function MonthView({ currentDate, tasks, onDayClick, onTaskClick }: MonthViewProps) {
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach((task) => {
      const key = task.date.slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(task);
    });
    return map;
  }, [tasks]);

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-7 border-b">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-1.5 sm:py-2 text-center text-[10px] sm:text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 flex-1 auto-rows-fr">
        {days.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const dayTasks = tasksByDate.get(dateKey) ?? [];
          const inMonth = isSameMonth(day, currentDate);
          const selected = isSameDay(day, currentDate);
          const today = isToday(day);

          return (
            <button
              key={dateKey}
              onClick={() => onDayClick?.(day)}
              className={cn(
                "relative flex flex-col items-start p-1 sm:p-1.5 min-h-[60px] sm:min-h-[80px] border-b border-r transition-colors hover:bg-accent/50 text-left",
                !inMonth && "text-muted-foreground/40 bg-muted/30",
                selected && "bg-accent",
                today && "font-semibold"
              )}
            >
              <span
                className={cn(
                  "inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 text-[10px] sm:text-xs rounded-full",
                  today && "bg-primary text-primary-foreground",
                  !today && selected && "bg-accent-foreground/10"
                )}
              >
                {format(day, "d")}
              </span>

              <div className="flex flex-col gap-px mt-0.5 w-full overflow-hidden">
                {dayTasks.slice(0, 2).map((task) => (
                  <button
                    key={task.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTaskClick?.(task);
                    }}
                    className={cn(
                      "flex items-center gap-0.5 px-0.5 sm:px-1 py-px rounded text-[8px] sm:text-[10px] leading-tight truncate w-full text-left transition-opacity hover:opacity-80",
                      task.color
                        ? "text-white"
                        : "bg-primary/10 text-primary"
                    )}
                    style={
                      task.color
                        ? { backgroundColor: task.color }
                        : undefined
                    }
                  >
                    <span className="truncate">{task.title}</span>
                  </button>
                ))}
                {dayTasks.length > 2 && (
                  <span className="text-[8px] sm:text-[10px] text-muted-foreground px-0.5 sm:px-1">
                    +{dayTasks.length - 2} mais
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
