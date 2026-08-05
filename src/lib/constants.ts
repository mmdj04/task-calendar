export const PRIORITY_COLORS: Record<string, string> = {
  urgent: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#22c55e",
};

export const STATUS_COLORS: Record<string, string> = {
  not_started: "#94a3b8",
  in_progress: "#3b82f6",
  paused: "#eab308",
  completed: "#22c55e",
  cancelled: "#f87171",
};

export const DEFAULT_CATEGORIES = [
  { name: "Trabalho", color: "#6366f1", icon: "briefcase" },
  { name: "Pessoal", color: "#ec4899", icon: "user" },
  { name: "Saúde", color: "#22c55e", icon: "heart" },
  { name: "Estudos", color: "#f59e0b", icon: "book-open" },
  { name: "Casa", color: "#8b5cf6", icon: "home" },
];

export const TASK_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6",
  "#ec4899", "#f43f5e", "#14b8a6", "#84cc16",
];

export const HOURS = Array.from({ length: 24 }, (_, i) =>
  `${i.toString().padStart(2, "0")}:00`
);

export const WEEK_DAYS_PT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
export const WEEK_DAYS_FULL_PT = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export const KEYBOARD_SHORTCUTS = {
  "ctrl+k": "Abrir pesquisa",
  "ctrl+n": "Nova tarefa",
  "ctrl+d": "Dashboard",
  "ctrl+m": "Calendário mensal",
  "ctrl+w": "Calendário semanal",
  "ctrl+1": "Hoje",
  "ctrl+left": "Período anterior",
  "ctrl+right": "Próximo período",
  "escape": "Fechar modal",
};

export const POMODORO_DEFAULTS = {
  work: 25 * 60,
  break: 5 * 60,
  longBreak: 15 * 60,
};
