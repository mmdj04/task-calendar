"use client";

import { useEffect, useRef } from "react";
import { useNotifications } from "@/hooks";
import { useAppStore } from "@/hooks/use-app-store";
import { parseISO, differenceInMinutes } from "date-fns";

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { notify, permission, requestPermission } = useNotifications();
  const checkedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (permission === "default") {
      requestPermission();
    }
  }, [permission, requestPermission]);

  useEffect(() => {
    const interval = setInterval(() => {
      const { tasks } = useAppStore.getState();
      const now = new Date();

      for (const task of tasks) {
        if (!task.reminderMinutes || task.status === "completed" || task.isDeleted) {
          continue;
        }

        const taskDate = parseISO(task.date);
        if (task.startTime) {
          const [hours, minutes] = task.startTime.split(":").map(Number);
          taskDate.setHours(hours, minutes, 0, 0);
        }

        const reminderTime = new Date(taskDate.getTime() - task.reminderMinutes * 60 * 1000);
        const diffMinutes = differenceInMinutes(reminderTime, now);

        if (diffMinutes <= 0 && diffMinutes > -2 && !checkedRef.current.has(task.id)) {
          checkedRef.current.add(task.id);
          notify(`Lembrete: ${task.title}`, {
            body: `Sua tarefa começa em ${task.reminderMinutes} minutos.`,
            tag: `task-${task.id}`,
          });
        }

        if (diffMinutes > 2) {
          checkedRef.current.delete(task.id);
        }
      }
    }, 60_000);

    return () => clearInterval(interval);
  }, [notify]);

  return <>{children}</>;
}
