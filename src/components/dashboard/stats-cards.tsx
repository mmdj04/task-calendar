"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  Flame,
  ListTodo,
  TrendingUp,
  AlertTriangle,
  CalendarDays,
} from "lucide-react";
import type { DashboardStats } from "@/types";

interface StatsCardsProps {
  data?: DashboardStats;
}

export function StatsCards({ data }: StatsCardsProps) {
  const stats = [
    {
      title: "Total Tasks",
      value: data?.totalTasks ?? 0,
      icon: <ListTodo className="h-4 w-4" />,
      color: "text-blue-500",
    },
    {
      title: "Completed",
      value: data?.completedTasks ?? 0,
      icon: <CheckCircle2 className="h-4 w-4" />,
      color: "text-green-500",
    },
    {
      title: "Overdue",
      value: data?.overdueTasks ?? 0,
      icon: <AlertTriangle className="h-4 w-4" />,
      color: "text-red-500",
    },
    {
      title: "This Week",
      value: data?.weekTasks ?? 0,
      icon: <CalendarDays className="h-4 w-4" />,
      color: "text-purple-500",
    },
    {
      title: "This Month",
      value: data?.monthTasks ?? 0,
      icon: <Clock className="h-4 w-4" />,
      color: "text-orange-500",
    },
    {
      title: "Productivity",
      value: `${data?.productivity ?? 0}%`,
      icon: <TrendingUp className="h-4 w-4" />,
      color: "text-emerald-500",
    },
    {
      title: "Streak",
      value: data?.streak ?? 0,
      icon: <Flame className="h-4 w-4" />,
      color: "text-amber-500",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
      {stats.map((stat) => (
        <Card key={stat.title} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={cn("text-muted-foreground", stat.color)}>
              {stat.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
