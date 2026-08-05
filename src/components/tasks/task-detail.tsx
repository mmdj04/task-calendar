"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Tag,
  Edit2,
  Copy,
  Trash2,
  Star,
  CheckCircle2,
  Circle,
  Paperclip,
  History,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description?: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  category?: string;
  color?: string;
  tags?: string[];
  notes?: string;
  subtasks?: { id: string; title: string; completed: boolean }[];
  checklists?: { id: string; text: string; checked: boolean }[];
  attachments?: { id: string; name: string; size: string }[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface TaskDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onDuplicate?: (task: Task) => void;
}

const priorityStyles: Record<Task["priority"], string> = {
  low: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const statusStyles: Record<Task["status"], string> = {
  pending: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  "in-progress": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export function TaskDetail({
  open,
  onOpenChange,
  task,
  onEdit,
  onDelete,
  onDuplicate,
}: TaskDetailProps) {
  const [favorited, setFavorited] = useState(false);
  const [subtasks, setSubtasks] = useState(task.subtasks ?? []);
  const [checklists, setChecklists] = useState(task.checklists ?? []);

  const toggleSubtask = (id: string) => {
    setSubtasks((prev) =>
      prev.map((st) => (st.id === id ? { ...st, completed: !st.completed } : st))
    );
  };

  const toggleChecklist = (id: string) => {
    setChecklists((prev) =>
      prev.map((cl) => (cl.id === id ? { ...cl, checked: !cl.checked } : cl))
    );
  };

  const completedSubtasks = subtasks.filter((st) => st.completed).length;
  const completedChecklists = checklists.filter((cl) => cl.checked).length;

  const history = [
    { time: task.createdAt ?? new Date(), action: "Task created" },
    ...(task.updatedAt ? [{ time: task.updatedAt, action: "Task updated" }] : []),
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[480px] overflow-y-auto p-4 sm:p-6">
        <SheetHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div
              className="h-3 w-3 rounded-full shrink-0 mt-1"
              style={{ backgroundColor: task.color ?? "#3b82f6" }}
            />
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setFavorited(!favorited)}
              >
                <Star
                  className={cn("h-4 w-4", favorited ? "fill-yellow-400 text-yellow-400" : "")}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onEdit?.(task)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onDuplicate?.(task)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => onDelete?.(task)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <SheetTitle className="text-xl leading-tight pr-0">{task.title}</SheetTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className={cn("text-xs", priorityStyles[task.priority])}>
              {task.priority}
            </Badge>
            <Badge variant="secondary" className={cn("text-xs", statusStyles[task.status])}>
              {task.status}
            </Badge>
            {task.category && (
              <Badge variant="outline" className="text-xs">
                {task.category}
              </Badge>
            )}
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {task.description && (
            <div>
              <h4 className="text-sm font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">{task.description}</p>
            </div>
          )}

          <Separator />

          <div className="space-y-3">
            <h4 className="text-sm font-medium">Metadata</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{format(task.date, "MMM d, yyyy")}</span>
              </div>
              {task.startTime && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {task.startTime}
                    {task.endTime ? ` - ${task.endTime}` : ""}
                  </span>
                </div>
              )}
            </div>
          </div>

          {task.tags && task.tags.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="gap-1 text-xs">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {subtasks.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">
                  Subtasks ({completedSubtasks}/{subtasks.length})
                </h4>
                <div className="space-y-2">
                  {subtasks.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => toggleSubtask(st.id)}
                      className="flex items-center gap-2 text-sm w-full text-left hover:bg-muted/50 p-1 rounded"
                    >
                      {st.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                      <span
                        className={cn(st.completed && "line-through text-muted-foreground")}
                      >
                        {st.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {checklists.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">
                  Checklist ({completedChecklists}/{checklists.length})
                </h4>
                <div className="space-y-2">
                  {checklists.map((cl) => (
                    <button
                      key={cl.id}
                      onClick={() => toggleChecklist(cl.id)}
                      className="flex items-center gap-2 text-sm w-full text-left hover:bg-muted/50 p-1 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={cl.checked}
                        readOnly
                        className="h-4 w-4"
                      />
                      <span
                        className={cn(cl.checked && "line-through text-muted-foreground")}
                      >
                        {cl.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {task.notes && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">Notes</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{task.notes}</p>
              </div>
            </>
          )}

          {task.attachments && task.attachments.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">Attachments</h4>
                <div className="space-y-2">
                  {task.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center gap-2 text-sm p-2 rounded border"
                    >
                      <Paperclip className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="truncate">{att.name}</span>
                      <span className="text-xs text-muted-foreground ml-auto shrink-0">
                        {att.size}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <History className="h-4 w-4" />
              History
            </h4>
            <div className="space-y-3">
              {history.map((entry, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <div className="relative">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground mt-1.5" />
                    {i < history.length - 1 && (
                      <div className="absolute left-[3px] top-4 h-full w-px bg-border" />
                    )}
                  </div>
                  <div>
                    <p>{entry.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(entry.time, "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <SheetFooter className="mt-6">
          <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
