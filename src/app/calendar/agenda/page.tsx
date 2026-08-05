"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTasksAction } from "@/actions";
import { useAppStore } from "@/hooks/use-app-store";
import { CalendarHeader } from "@/components/calendar/calendar-header";
import { AgendaView } from "@/components/calendar/agenda-view";
import { TaskDetail } from "@/components/tasks/task-detail";
import { Skeleton } from "@/components/ui/skeleton";
import type { Task } from "@/types";

export default function AgendaPage() {
  const currentDate = useAppStore((s) => s.currentDate);
  const selectedTask = useAppStore((s) => s.selectedTask);
  const setSelectedTask = useAppStore((s) => s.setSelectedTask);

  const [taskDetailOpen, setTaskDetailOpen] = useState(false);

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks", "agenda"],
    queryFn: () => getTasksAction({ isDeleted: false }),
  });

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setTaskDetailOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader />
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-[60px] w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <AgendaView
            currentDate={currentDate}
            tasks={(tasks ?? []) as any}
            onTaskClick={handleTaskClick}
          />
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
