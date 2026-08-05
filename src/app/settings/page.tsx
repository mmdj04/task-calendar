"use client";

import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { exportTasksAction, importTasksAction } from "@/actions";
import { useAppStore } from "@/hooks/use-app-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Sun,
  Moon,
  Monitor,
  Download,
  Upload,
  Palette,
  CalendarDays,
  Timer,
  Bell,
} from "lucide-react";
import type { Theme, CalendarView } from "@/types";

export default function SettingsPage() {
  const { theme, setTheme } = useAppStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [defaultView, setDefaultView] = useState<CalendarView>("month");
  const [startOfWeek, setStartOfWeek] = useState("0");
  const [pomodoroWork, setPomodoroWork] = useState("25");
  const [pomodoroBreak, setPomodoroBreak] = useState("5");
  const [pomodoroLong, setPomodoroLong] = useState("15");
  const [notifications, setNotifications] = useState(true);

  const exportMutation = useMutation({
    mutationFn: exportTasksAction,
    onSuccess: (data) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `task-calendar-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: "Export completed", description: "Your data has been exported." });
    },
  });

  const importMutation = useMutation({
    mutationFn: importTasksAction,
    onSuccess: (results) => {
      toast({
        title: "Import completed",
        description: `Imported ${results.tasks} tasks, ${results.categories} categories, and ${results.tags} tags.`,
      });
    },
  });

  const handleExport = () => {
    exportMutation.mutate();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        importMutation.mutate(data);
      } catch {
        toast({ title: "Invalid file", description: "Please select a valid JSON file." });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Light", icon: <Sun className="h-4 w-4" /> },
    { value: "dark", label: "Dark", icon: <Moon className="h-4 w-4" /> },
    { value: "system", label: "System", icon: <Monitor className="h-4 w-4" /> },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 md:p-6">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Customize your app preferences</p>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6 space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>Choose your preferred theme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              {themes.map((t) => (
                <Button
                  key={t.value}
                  variant={theme === t.value ? "default" : "outline"}
                  onClick={() => setTheme(t.value)}
                  className="flex items-center gap-2"
                >
                  {t.icon}
                  {t.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Calendar
            </CardTitle>
            <CardDescription>Configure calendar preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Default View</Label>
                <Select value={defaultView} onValueChange={(v) => setDefaultView(v as CalendarView)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="agenda">Agenda</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Start of Week</Label>
                <Select value={startOfWeek} onValueChange={(v) => setStartOfWeek(v ?? "0")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Sunday</SelectItem>
                    <SelectItem value="1">Monday</SelectItem>
                    <SelectItem value="6">Saturday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              Pomodoro Timer
            </CardTitle>
            <CardDescription>Customize pomodoro durations (minutes)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pomodoro-work">Work</Label>
                <Input
                  id="pomodoro-work"
                  type="number"
                  min="1"
                  max="120"
                  value={pomodoroWork}
                  onChange={(e) => setPomodoroWork(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pomodoro-break">Short Break</Label>
                <Input
                  id="pomodoro-break"
                  type="number"
                  min="1"
                  max="30"
                  value={pomodoroBreak}
                  onChange={(e) => setPomodoroBreak(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pomodoro-long">Long Break</Label>
                <Input
                  id="pomodoro-long"
                  type="number"
                  min="1"
                  max="60"
                  value={pomodoroLong}
                  onChange={(e) => setPomodoroLong(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Manage notification preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive reminders for upcoming tasks
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
          </CardContent>
        </Card>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Export or import your task data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleExport}
                disabled={exportMutation.isPending}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {exportMutation.isPending ? "Exporting..." : "Export Data"}
              </Button>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={importMutation.isPending}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {importMutation.isPending ? "Importing..." : "Import Data"}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Export creates a JSON backup of all your tasks, categories, tags, and goals.
              Import restores data from a previously exported file.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
