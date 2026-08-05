export type Priority = "urgent" | "high" | "medium" | "low";
export type Status = "not_started" | "in_progress" | "paused" | "completed" | "cancelled";
export type RecurringType = "daily" | "weekly" | "monthly" | "yearly";
export type CalendarView = "month" | "week" | "day" | "agenda";
export type GoalType = "weekly" | "monthly";
export type PomodoroType = "work" | "break" | "long_break";
export type Theme = "light" | "dark" | "system";

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  date: string;
  startTime?: string | null;
  endTime?: string | null;
  duration?: number | null;
  priority: Priority;
  status: Status;
  color?: string | null;
  isFavorite: boolean;
  isDeleted: boolean;
  deletedAt?: string | null;
  recurringType?: RecurringType | null;
  recurringEnd?: string | null;
  reminderMinutes?: number | null;
  notes?: string | null;
  order: number;
  userId: string;
  categoryId?: string | null;
  category?: Category | null;
  tags?: TaskTag[];
  subtasks?: Subtask[];
  checklists?: Checklist[];
  attachments?: Attachment[];
  history?: TaskHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  userId: string;
  _count?: { tasks: number };
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  userId: string;
  createdAt: string;
}

export interface TaskTag {
  taskId: string;
  tagId: string;
  tag: Tag;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  order: number;
  taskId: string;
  createdAt: string;
}

export interface Checklist {
  id: string;
  title: string;
  checked: boolean;
  order: number;
  taskId: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  filename: string;
  path: string;
  mimetype?: string | null;
  size?: number | null;
  taskId: string;
  createdAt: string;
}

export interface TaskHistory {
  id: string;
  action: string;
  field?: string | null;
  oldValue?: string | null;
  newValue?: string | null;
  taskId: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string | null;
  type: GoalType;
  target: number;
  current: number;
  startDate: string;
  endDate: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PomodoroSession {
  id: string;
  duration: number;
  type: PomodoroType;
  taskId?: string | null;
  userId: string;
  startedAt: string;
  endedAt?: string | null;
}

export interface UserSettings {
  id: string;
  userId: string;
  theme: Theme;
  defaultView: CalendarView;
  startOfWeek: number;
  pomodoroWork: number;
  pomodoroBreak: number;
  pomodoroLong: number;
  notificationsOn: boolean;
  language: string;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  weekTasks: number;
  monthTasks: number;
  productivity: number;
  weeklyData: { day: string; count: number }[];
  monthlyData: { week: string; count: number }[];
  categoryTime: { category: string; time: number }[];
  streak: number;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  priority?: Priority;
  status?: Status;
  color?: string;
  categoryId?: string;
  tagIds?: string[];
  reminderMinutes?: number;
  recurringType?: RecurringType;
  recurringEnd?: string;
  notes?: string;
  subtasks?: { title: string }[];
  checklists?: { title: string }[];
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  id: string;
}

export interface CreateCategoryInput {
  name: string;
  color?: string;
  icon?: string;
}

export interface CreateTagInput {
  name: string;
  color?: string;
}

export interface CreateGoalInput {
  title: string;
  description?: string;
  type: GoalType;
  target: number;
  startDate: string;
  endDate: string;
}
