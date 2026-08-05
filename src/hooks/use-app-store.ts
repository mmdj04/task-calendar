"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CalendarView, Theme, Task, Category, Tag } from "@/types";

interface AppState {
  currentDate: Date;
  view: CalendarView;
  theme: Theme;
  sidebarOpen: boolean;
  searchOpen: boolean;
  selectedTask: Task | null;
  tasks: Task[];
  categories: Category[];
  tags: Tag[];
  filters: {
    status?: string;
    priority?: string;
    categoryId?: string;
    search?: string;
  };

  setCurrentDate: (date: Date) => void;
  setView: (view: CalendarView) => void;
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSearchOpen: (open: boolean) => void;
  setSelectedTask: (task: Task | null) => void;
  setTasks: (tasks: Task[]) => void;
  setCategories: (categories: Category[]) => void;
  setTags: (tags: Tag[]) => void;
  setFilters: (filters: Partial<AppState["filters"]>) => void;
  resetFilters: () => void;
  navigateDate: (direction: "prev" | "next" | "today") => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentDate: new Date(),
      view: "month",
      theme: "system",
      sidebarOpen: true,
      searchOpen: false,
      selectedTask: null,
      tasks: [],
      categories: [],
      tags: [],
      filters: {},

      setCurrentDate: (date) => set({ currentDate: date }),
      setView: (view) => set({ view }),
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSearchOpen: (open) => set({ searchOpen: open }),
      setSelectedTask: (task) => set({ selectedTask: task }),
      setTasks: (tasks) => set({ tasks }),
      setCategories: (categories) => set({ categories }),
      setTags: (tags) => set({ tags }),
      setFilters: (filters) =>
        set((s) => ({ filters: { ...s.filters, ...filters } })),
      resetFilters: () => set({ filters: {} }),
      navigateDate: (direction) => {
        const { currentDate, view } = get();
        const newDate = new Date(currentDate);

        if (direction === "today") {
          set({ currentDate: new Date() });
          return;
        }

        const multiplier = direction === "next" ? 1 : -1;

        if (view === "month") newDate.setMonth(newDate.getMonth() + multiplier);
        else if (view === "week") newDate.setDate(newDate.getDate() + 7 * multiplier);
        else if (view === "day") newDate.setDate(newDate.getDate() + multiplier);
        else newDate.setDate(newDate.getDate() + 7 * multiplier);

        set({ currentDate: newDate });
      },
    }),
    {
      name: "task-calendar-storage",
      partialize: (state) => ({
        theme: state.theme,
        view: state.view,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);
