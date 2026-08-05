"use client";

import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

const DEFAULT_COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#84cc16",
  "#22c55e", "#14b8a6", "#06b6d4", "#3b82f6",
  "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
  "#ec4899", "#f43f5e", "#78716c", "#64748b",
];

interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
  colors?: string[];
}

export function ColorPicker({ value, onChange, colors = DEFAULT_COLORS }: ColorPickerProps) {
  return (
    <div className="grid grid-cols-8 gap-1.5">
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={cn(
            "size-7 rounded-full border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring/50",
            value === color
              ? "border-foreground ring-2 ring-foreground/30"
              : "border-transparent"
          )}
          style={{ backgroundColor: color }}
        >
          {value === color && (
            <CheckIcon className="size-3.5 mx-auto text-white drop-shadow-sm" />
          )}
        </button>
      ))}
    </div>
  );
}
