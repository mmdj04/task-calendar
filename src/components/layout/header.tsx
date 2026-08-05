"use client";

import { useEffect, useState } from "react";
import {
  Menu,
  Search,
  Bell,
  Plus,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/hooks/use-app-store";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Header() {
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const setSearchOpen = useAppStore((s) => s.setSearchOpen);
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSearchOpen]);

  const cycleTheme = () => {
    const order: Array<"light" | "dark" | "system"> = [
      "light",
      "dark",
      "system",
    ];
    const idx = order.indexOf(theme);
    setTheme(order[(idx + 1) % order.length]);
  };

  const ThemeIcon =
    theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={toggleSidebar}
        className="shrink-0 lg:hidden"
      >
        <Menu className="size-5" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>

      <div className="flex-1" />

      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setSearchOpen(true)}
              />
            }
          >
            <Search className="size-4" />
            <span className="sr-only">Search</span>
          </TooltipTrigger>
          <TooltipContent>
            Search{" "}
            <kbd className="ml-1 inline-flex items-center rounded border bg-muted px-1.5 text-[10px]">
              Ctrl+K
            </kbd>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={<Button variant="ghost" size="icon-sm" onClick={cycleTheme} />}
          >
            {mounted ? (
              <ThemeIcon className="size-4" />
            ) : (
              <Monitor className="size-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </TooltipTrigger>
          <TooltipContent>Theme: {theme}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={<Button variant="ghost" size="icon-sm" />}
          >
            <Bell className="size-4" />
            <span className="sr-only">Notifications</span>
          </TooltipTrigger>
          <TooltipContent>Notifications</TooltipContent>
        </Tooltip>

        <Button size="sm" className="ml-2 hidden sm:inline-flex">
          <Plus className="size-4" />
          New Task
        </Button>
        <Button size="icon-sm" className="sm:hidden">
          <Plus className="size-4" />
          <span className="sr-only">New Task</span>
        </Button>
      </div>
    </header>
  );
}
