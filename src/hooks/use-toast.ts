"use client";

import { toast as baseToast } from "@/components/ui/toast";

export function useToast() {
  return {
    toast: (props: { title?: string; description?: string; variant?: string }) => {
      (baseToast as any)({
        ...props,
        type: (props.variant as any) ?? "info",
      });
    },
  };
}
