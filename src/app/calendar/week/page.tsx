"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTasksAction } from "@/actions";
import { useAppStore } from "@/hooks/use-app-store";
import { CalendarHeader } from "@/components/calendar/calendar-header";
import { WeekView } from "@/components/calendar/week-view";
import { TaskForm } from "@/components/tasks/task-form";
import { TaskDetail } from "@/components/tasks/task-detail";
import { Skeleton } from "@/components/ui/skeleton";
import { startOfWeek, endOfWeek } from "date-fns";
import type { Task } from "@/types";

export default function WeekPage() {
  const currentDate = useAppStore((s) => s.currentDate);
  const selectedTask = useAppStore((s) => s.selectedTask);
  const setSelectedTask = useAppStore((s) => s.setSelectedTask);

  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks", weekStart.toISOString(), weekEnd.toISOString()],
    queryFn: () =>
      getTasksAction({
        startDate: weekStart.toISOString(),
        endDate: weekEnd.toISOString(),
      }),
  });

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setTaskFormOpen(true);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setTaskDetailOpen(true);
  };

  const handleTaskFormSubmit = () => {
    setTaskFormOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader />
      <div className="flex-1 overflow-hidden p-4">
        {isLoading ? (
          <Skeleton className="h-full w-full rounded-lg" />
        ) : (
          <WeekView
            currentDate={currentDate}
            tasks={(tasks ?? []) as any}
            onDayClick={handleDayClick}
            onTaskClick={handleTaskClick}
          />
        )}
      </div>

      <TaskForm
        open={taskFormOpen}
        onOpenChange={setTaskFormOpen}
        initialData={{ date: selectedDate.toISOString().split("T")[0] }}
        onSubmit={handleTaskFormSubmit}
        mode="create"
      />

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
