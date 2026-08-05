"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTasksAction } from "@/actions";
import { useAppStore } from "@/hooks/use-app-store";
import { CalendarHeader } from "@/components/calendar/calendar-header";
import { DayView } from "@/components/calendar/day-view";
import { TaskForm } from "@/components/tasks/task-form";
import { TaskDetail } from "@/components/tasks/task-detail";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import type { Task } from "@/types";

export default function DayPage() {
  const currentDate = useAppStore((s) => s.currentDate);
  const selectedTask = useAppStore((s) => s.selectedTask);
  const setSelectedTask = useAppStore((s) => s.setSelectedTask);

  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);

  const dateStr = format(currentDate, "yyyy-MM-dd");

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks", dateStr],
    queryFn: () =>
      getTasksAction({
        startDate: dateStr,
        endDate: dateStr,
      }),
  });

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setTaskDetailOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader />
      <div className="flex-1 overflow-hidden p-4">
        {isLoading ? (
          <Skeleton className="h-full w-full rounded-lg" />
        ) : (
          <DayView
            currentDate={currentDate}
            tasks={(tasks ?? []) as any}
            onTaskClick={handleTaskClick}
          />
        )}
      </div>

      <TaskForm
        open={taskFormOpen}
        onOpenChange={setTaskFormOpen}
        initialData={{ date: dateStr }}
        onSubmit={() => setTaskFormOpen(false)}
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
