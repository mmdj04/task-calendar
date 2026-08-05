"use client";

import { create } from "zustand";
import type { PomodoroType } from "@/types";

interface PomodoroState {
  isRunning: boolean;
  type: PomodoroType;
  timeLeft: number;
  totalTime: number;
  sessions: number;
  currentTaskId: string | null;

  start: (type: PomodoroType, duration: number, taskId?: string) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  tick: () => void;
  complete: () => void;
}

export const usePomodoroStore = create<PomodoroState>()((set, get) => ({
  isRunning: false,
  type: "work",
  timeLeft: 25 * 60,
  totalTime: 25 * 60,
  sessions: 0,
  currentTaskId: null,

  start: (type, duration, taskId) =>
    set({
      isRunning: true,
      type,
      timeLeft: duration,
      totalTime: duration,
      currentTaskId: taskId ?? null,
    }),

  pause: () => set({ isRunning: false }),
  resume: () => set({ isRunning: true }),

  reset: () =>
    set({
      isRunning: false,
      type: "work",
      timeLeft: 25 * 60,
      totalTime: 25 * 60,
      currentTaskId: null,
    }),

  tick: () => {
    const { timeLeft, isRunning } = get();
    if (!isRunning || timeLeft <= 0) return;
    set({ timeLeft: timeLeft - 1 });
  },

  complete: () => {
    const { type, sessions } = get();
    if (type === "work") {
      set({ sessions: sessions + 1 });
    }
    set({ isRunning: false });
  },
}));
