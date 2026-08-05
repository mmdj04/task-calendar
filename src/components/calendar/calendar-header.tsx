"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  LayoutGrid,
  Columns3,
  Calendar,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/hooks/use-app-store";
import type { CalendarView } from "@/types";

const viewOptions: { value: CalendarView; label: string; icon: React.ElementType }[] = [
  { value: "month", label: "Mês", icon: LayoutGrid },
  { value: "week", label: "Semana", icon: Columns3 },
  { value: "day", label: "Dia", icon: Calendar },
  { value: "agenda", label: "Agenda", icon: List },
];

export function CalendarHeader() {
  const { currentDate, view, navigateDate, setView } = useAppStore();

  const periodLabel = (() => {
    switch (view) {
      case "month":
        return format(currentDate, "MMMM yyyy", { locale: ptBR });
      case "week":
        return format(currentDate, "'Semana de' d 'de' MMMM, yyyy", { locale: ptBR });
      case "day":
        return format(currentDate, "EEEE, d 'de' MMMM, yyyy", { locale: ptBR });
      default:
        return format(currentDate, "MMMM yyyy", { locale: ptBR });
    }
  })();

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigateDate("prev")}
            className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-accent transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigateDate("next")}
            className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-accent transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => navigateDate("today")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md border hover:bg-accent transition-colors"
        >
          <CalendarDays className="w-3.5 h-3.5" />
          Hoje
        </button>

        <h2 className="text-lg font-semibold capitalize">{periodLabel}</h2>
      </div>

      <div className="flex items-center gap-1 p-0.5 rounded-lg bg-muted">
        {viewOptions.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setView(value)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
              view === value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
