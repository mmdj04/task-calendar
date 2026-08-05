"use client";

import { useEffect, useRef, useState } from "react";
import { usePomodoroStore } from "@/hooks/use-pomodoro-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  PlayIcon,
  PauseIcon,
  RotateCcwIcon,
  MinimizeIcon,
  MaximizeIcon,
} from "lucide-react";

const DURATIONS = { work: 25 * 60, break: 5 * 60, long_break: 15 * 60 };
const LABELS = { work: "Foco", break: "Pausa", long_break: "Pausa Longa" };

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function PomodoroWidget() {
  const { isRunning, type, timeLeft, totalTime, sessions, start, pause, resume, reset, tick, complete } =
    usePomodoroStore();
  const [minimized, setMinimized] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(
        "data:audio/wav;base64,UklGRl9vT19teleQAVlbm0ZAAABkYXRhQ1JDT05JAAAAAA=="
      );
    }
  }, []);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isRunning, timeLeft, tick]);

  useEffect(() => {
    if (isRunning && timeLeft === 0) {
      audioRef.current?.play().catch(() => {});
      complete();
    }
  }, [isRunning, timeLeft, complete]);

  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

  const handleModeSwitch = (mode: "work" | "break" | "long_break") => {
    start(mode, DURATIONS[mode]);
  };

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 rounded-xl border bg-card shadow-lg transition-all duration-300",
        minimized ? "w-14 h-14" : "w-64"
      )}
    >
      {minimized ? (
        <Button
          variant="ghost"
          size="icon"
          className="w-full h-full rounded-xl"
          onClick={() => setMinimized(false)}
        >
          <MaximizeIcon className="size-5" />
        </Button>
      ) : (
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{LABELS[type]}</span>
            <Button variant="ghost" size="icon-xs" onClick={() => setMinimized(true)}>
              <MinimizeIcon className="size-4" />
            </Button>
          </div>

          <div className="relative h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-primary transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="text-center text-3xl font-mono font-bold tracking-tighter">
            {formatTime(timeLeft)}
          </div>

          <div className="flex justify-center gap-1">
            {(["work", "break", "long_break"] as const).map((mode) => (
              <Button
                key={mode}
                variant={type === mode ? "default" : "ghost"}
                size="xs"
                onClick={() => handleModeSwitch(mode)}
              >
                {LABELS[mode]}
              </Button>
            ))}
          </div>

          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => (isRunning ? pause() : resume())}
            >
              {isRunning ? <PauseIcon className="size-4" /> : <PlayIcon className="size-4" />}
            </Button>
            <Button variant="outline" size="icon" onClick={reset}>
              <RotateCcwIcon className="size-4" />
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Sessões concluídas: {sessions}
          </p>
        </div>
      )}
    </div>
  );
}
