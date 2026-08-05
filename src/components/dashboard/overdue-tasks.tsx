"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { differenceInDays, format } from "date-fns";
import { AlertTriangle, Clock } from "lucide-react";
import type { Task } from "@/types";

interface OverdueTasksProps {
  tasks?: Task[];
}

export function OverdueTasks({ tasks = [] }: OverdueTasksProps) {
  if (tasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-green-500" />
            Overdue Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No overdue tasks. Great job!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-red-200 dark:border-red-900/50">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          Overdue Tasks
          <Badge variant="destructive" className="ml-auto text-xs">
            {tasks.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map((task) => {
            const daysOverdue = differenceInDays(new Date(), new Date(task.date));

            return (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50/50 p-3 dark:border-red-900/50 dark:bg-red-950/20"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Clock className="h-4 w-4 shrink-0 text-red-500" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    <p className="text-xs text-red-500">
                      Due {format(new Date(task.date), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="destructive" className="text-[10px] sm:text-xs whitespace-nowrap">
                    {daysOverdue}d overdue
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
