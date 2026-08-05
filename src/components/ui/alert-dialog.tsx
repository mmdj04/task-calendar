"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

function AlertDialog({ open, onOpenChange, children }: AlertDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog>
  );
}

function AlertDialogTrigger({ children, ...props }: React.ComponentProps<typeof DialogTrigger>) {
  return <DialogTrigger {...props}>{children}</DialogTrigger>;
}

function AlertDialogContent({ children, ...props }: React.ComponentProps<typeof DialogContent>) {
  return (
    <DialogContent {...props}>
      {children}
    </DialogContent>
  );
}

function AlertDialogHeader({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <DialogHeader {...props}>{children}</DialogHeader>;
}

function AlertDialogTitle({ children, ...props }: React.ComponentProps<typeof DialogTitle>) {
  return <DialogTitle {...props}>{children}</DialogTitle>;
}

function AlertDialogDescription({ children, ...props }: React.ComponentProps<typeof DialogDescription>) {
  return <DialogDescription {...props}>{children}</DialogDescription>;
}

function AlertDialogFooter({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <DialogFooter {...props}>{children}</DialogFooter>;
}

function AlertDialogAction({ children, onClick, className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button onClick={onClick} className={className} {...props}>
      {children}
    </Button>
  );
}

function AlertDialogCancel({ children, onClick, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button variant="outline" onClick={onClick} {...props}>
      {children}
    </Button>
  );
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
};
