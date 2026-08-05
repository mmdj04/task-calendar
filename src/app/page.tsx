"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getDashboardStatsAction,
  getUpcomingTasksAction,
  getOverdueTasksAction,
  getTodayTasksAction,
} from "@/actions";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { ProductivityChart } from "@/components/dashboard/productivity-chart";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { RecentTasks } from "@/components/dashboard/recent-tasks";
import { OverdueTasks } from "@/components/dashboard/overdue-tasks";
import { Skeleton } from "@/components/ui/skeleton";

function StatsSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
      {Array.from({ length: 7 }).map((_, i) => (
        <Skeleton key={i} className="h-[100px] rounded-lg" />
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return <Skeleton className="h-[350px] rounded-lg" />;
}

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStatsAction,
  });

  const { data: upcomingTasks, isLoading: upcomingLoading } = useQuery({
    queryKey: ["upcoming-tasks"],
    queryFn: () => getUpcomingTasksAction(7),
  });

  const { data: overdueTasks, isLoading: overdueLoading } = useQuery({
    queryKey: ["overdue-tasks"],
    queryFn: getOverdueTasksAction,
  });

  const { data: todayTasks, isLoading: todayLoading } = useQuery({
    queryKey: ["today-tasks"],
    queryFn: getTodayTasksAction,
  });

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Overview of your productivity and tasks
        </p>
      </div>

      <section>
        {statsLoading ? (
          <StatsSkeleton />
        ) : (
          <StatsCards data={stats} />
        )}
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <section>
          {statsLoading ? (
            <ChartSkeleton />
          ) : (
            <ProductivityChart data={stats?.weeklyData ?? []} />
          )}
        </section>
        <section>
          {statsLoading ? (
            <ChartSkeleton />
          ) : (
            <CategoryChart data={stats?.categoryTime ?? []} />
          )}
        </section>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section>
          {todayLoading || upcomingLoading ? (
            <Skeleton className="h-[300px] rounded-lg" />
          ) : (
            <RecentTasks
              todayTasks={(todayTasks ?? []) as any}
              upcomingTasks={(upcomingTasks ?? []) as any}
            />
          )}
        </section>
        <section>
          {overdueLoading ? (
            <Skeleton className="h-[300px] rounded-lg" />
          ) : (
            <OverdueTasks tasks={(overdueTasks ?? []) as any} />
          )}
        </section>
      </div>
    </div>
  );
}
