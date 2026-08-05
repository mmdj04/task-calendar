"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getGoalsAction,
  createGoalAction,
  updateGoalProgressAction,
  deleteGoalAction,
  updateGoalAction,
} from "@/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Target,
  Minus,
  CheckCircle2,
  Circle,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { Goal, GoalType } from "@/types";

export default function GoalsPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingGoal, setDeletingGoal] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("weekly");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [target, setTarget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [goalType, setGoalType] = useState<GoalType>("weekly");

  const { data: weeklyGoals, isLoading: weeklyLoading } = useQuery({
    queryKey: ["goals", "weekly"],
    queryFn: () => getGoalsAction("weekly"),
  });

  const { data: monthlyGoals, isLoading: monthlyLoading } = useQuery({
    queryKey: ["goals", "monthly"],
    queryFn: () => getGoalsAction("monthly"),
  });

  const createMutation = useMutation({
    mutationFn: createGoalAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      resetForm();
      setDialogOpen(false);
    },
  });

  const progressMutation = useMutation({
    mutationFn: ({ id, increment }: { id: string; increment: number }) =>
      updateGoalProgressAction(id, increment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGoalAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      setDeleteDialogOpen(false);
      setDeletingGoal(null);
    },
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTarget("");
    setStartDate("");
    setEndDate("");
    setGoalType("weekly");
  };

  const handleSubmit = () => {
    if (!title.trim() || !target || !startDate || !endDate) return;

    createMutation.mutate({
      title,
      description: description || undefined,
      target: parseInt(target),
      startDate,
      endDate,
      type: goalType,
    });
  };

  const renderGoalCard = (goal: any) => {
    const progress = goal.target > 0 ? Math.round((goal.current / goal.target) * 100) : 0;
    const isCompleted = goal.completed || progress >= 100;

    return (
      <Card key={goal.id} className={cn("relative", isCompleted && "border-green-200 dark:border-green-900")}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {isCompleted ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
              )}
              <div>
                <CardTitle className="text-base">{goal.title}</CardTitle>
                {goal.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">{goal.description}</p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => {
                setDeletingGoal(goal as any);
                setDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {goal.current} / {goal.target}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {format(new Date(goal.startDate), "MMM d")} - {format(new Date(goal.endDate), "MMM d")}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => progressMutation.mutate({ id: goal.id, increment: -1 })}
                disabled={goal.current <= 0}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => progressMutation.mutate({ id: goal.id, increment: 1 })}
                disabled={isCompleted}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const currentGoals = activeTab === "weekly" ? weeklyGoals : monthlyGoals;
  const isLoading = activeTab === "weekly" ? weeklyLoading : monthlyLoading;

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 md:p-6">
        <div className="flex items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Goals</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Track your weekly and monthly goals</p>
          </div>
          <Button onClick={() => { resetForm(); setDialogOpen(true); }} size="sm" className="shrink-0">
            <Plus className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Add </span>Goal
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 w-full sm:w-auto">
            <TabsTrigger value="weekly" className="gap-1 sm:gap-2 text-xs sm:text-sm flex-1 sm:flex-none">
              <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Weekly
            </TabsTrigger>
            <TabsTrigger value="monthly" className="gap-1 sm:gap-2 text-xs sm:text-sm flex-1 sm:flex-none">
              <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Monthly
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weekly">
            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-[180px] rounded-lg" />
                ))}
              </div>
            ) : weeklyGoals && weeklyGoals.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {weeklyGoals.map((g: any) => renderGoalCard(g))}
              </div>
            ) : (
              <EmptyState
                icon={<Target className="h-12 w-12" />}
                title="No weekly goals"
                description="Set weekly goals to track your progress"
              />
            )}
          </TabsContent>

          <TabsContent value="monthly">
            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-[180px] rounded-lg" />
                ))}
              </div>
            ) : monthlyGoals && monthlyGoals.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {monthlyGoals.map((g: any) => renderGoalCard(g))}
              </div>
            ) : (
              <EmptyState
                icon={<TrendingUp className="h-12 w-12" />}
                title="No monthly goals"
                description="Set monthly goals to track your progress"
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>New Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Goal title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe your goal"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Goal Type</Label>
              <Select value={goalType} onValueChange={(v) => setGoalType(v as GoalType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="target">Target</Label>
              <Input
                id="target"
                type="number"
                min="1"
                placeholder="Target count"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!title.trim() || !target || !startDate || !endDate}>
              Create Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Goal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingGoal?.title}&quot;?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingGoal && deleteMutation.mutate(deletingGoal.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
      <div className="mb-4 opacity-50">{icon}</div>
      <p className="text-lg font-medium">{title}</p>
      <p className="text-sm">{description}</p>
    </div>
  );
}
