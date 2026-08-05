import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  format,
  parseISO,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  isSameDay,
  isBefore,
  isAfter,
  differenceInMinutes,
  differenceInDays,
  isToday,
  isTomorrow,
  isYesterday,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Priority, Status, RecurringType } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, fmt: string = "dd/MM/yyyy"): string {
  return format(typeof date === "string" ? parseISO(date) : date, fmt, { locale: ptBR });
}

export function formatTime(time: string): string {
  return time;
}

export function getPriorityColor(priority: Priority): string {
  const colors: Record<Priority, string> = {
    urgent: "bg-red-500",
    high: "bg-orange-500",
    medium: "bg-yellow-500",
    low: "bg-green-500",
  };
  return colors[priority];
}

export function getPriorityLabel(priority: Priority): string {
  const labels: Record<Priority, string> = {
    urgent: "Urgente",
    high: "Alta",
    medium: "Média",
    low: "Baixa",
  };
  return labels[priority];
}

export function getStatusColor(status: Status): string {
  const colors: Record<Status, string> = {
    not_started: "bg-slate-400",
    in_progress: "bg-blue-500",
    paused: "bg-yellow-500",
    completed: "bg-green-500",
    cancelled: "bg-red-400",
  };
  return colors[status];
}

export function getStatusLabel(status: Status): string {
  const labels: Record<Status, string> = {
    not_started: "Não iniciada",
    in_progress: "Em andamento",
    paused: "Pausada",
    completed: "Concluída",
    cancelled: "Cancelada",
  };
  return labels[status];
}

export function getRecurringLabel(type: RecurringType): string {
  const labels: Record<RecurringType, string> = {
    daily: "Diariamente",
    weekly: "Semanalmente",
    monthly: "Mensalmente",
    yearly: "Anualmente",
  };
  return labels[type];
}

export function getMonthDays(date: Date): Date[] {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return eachDayOfInterval({ start, end });
}

export function getWeekDays(date: Date, startOfWeekDay: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0): Date[] {
  const start = startOfWeek(date, { weekStartsOn: startOfWeekDay });
  const end = endOfWeek(date, { weekStartsOn: startOfWeekDay });
  return eachDayOfInterval({ start, end });
}

export function generateRecurringDates(
  startDate: Date,
  type: RecurringType,
  endDate?: Date | null,
  count: number = 365
): Date[] {
  const dates: Date[] = [startDate];
  const addFn = {
    daily: addDays,
    weekly: addWeeks,
    monthly: addMonths,
    yearly: addYears,
  }[type];

  let current = startDate;
  for (let i = 1; i < count; i++) {
    current = addFn(current, 1);
    if (endDate && isAfter(current, endDate)) break;
    dates.push(current);
  }
  return dates;
}

export function calculateDuration(startTime: string, endTime: string): number {
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);
  return (endH * 60 + endM) - (startH * 60 + startM);
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

export function getDateLabel(date: Date): string {
  if (isToday(date)) return "Hoje";
  if (isTomorrow(date)) return "Amanhã";
  if (isYesterday(date)) return "Ontem";
  return formatDate(date, "dd MMMM yyyy");
}

export { isSameDay, isBefore, isAfter, differenceInMinutes, differenceInDays, isToday, parseISO, format, startOfWeek, endOfWeek, startOfMonth, endOfMonth };
