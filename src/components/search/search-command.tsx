"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command";
import { useAppStore } from "@/hooks/use-app-store";
import { searchTasksAction } from "@/actions";
import { formatDate } from "@/lib/utils";
import { CalendarIcon, TagIcon, ClockIcon } from "lucide-react";
import type { Task } from "@/types";

export function SearchCommand() {
  const { searchOpen, setSearchOpen } = useAppStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Task[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (!searchOpen) {
      setQuery("");
      setResults([]);
    }
  }, [searchOpen]);

  const saveRecentSearch = useCallback((term: string) => {
    setRecentSearches((prev) => {
      const updated = [term, ...prev.filter((s) => s !== term)].slice(0, 5);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleSearch = useCallback(
    async (term: string) => {
      setQuery(term);
      if (term.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const tasks = await searchTasksAction(term);
        setResults(tasks as unknown as Task[]);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleSelect = useCallback(
    (task: Task) => {
      saveRecentSearch(query);
      setSearchOpen(false);
      useAppStore.getState().setSelectedTask(task);
    },
    [query, saveRecentSearch, setSearchOpen]
  );

  const handleRecentSearch = useCallback((term: string) => {
    setQuery(term);
    handleSearch(term);
  }, [handleSearch]);

  const categoryColors: Record<string, string> = {};

  return (
    <CommandDialog open={searchOpen} onOpenChange={setSearchOpen} title="Buscar Tarefas" description="Pesquise suas tarefas">
      <CommandInput
        ref={inputRef}
        placeholder="Buscar tarefas..."
        value={query}
        onValueChange={handleSearch}
      />
      <CommandList>
        <CommandEmpty>
          {loading ? "Buscando..." : "Nenhum resultado encontrado."}
        </CommandEmpty>

        {!query && recentSearches.length > 0 && (
          <CommandGroup heading="Buscas Recentes">
            {recentSearches.map((term) => (
              <CommandItem
                key={term}
                value={term}
                onSelect={() => handleRecentSearch(term)}
              >
                <ClockIcon className="size-4 text-muted-foreground" />
                <span>{term}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {results.length > 0 && (
          <CommandGroup heading="Resultados">
            {results.map((task) => (
              <CommandItem
                key={task.id}
                value={`${task.title} ${task.category?.name ?? ""}`}
                onSelect={() => handleSelect(task)}
              >
                <CalendarIcon className="size-4 text-muted-foreground" />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="truncate">{task.title}</span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatDate(task.date)}</span>
                    {task.category && (
                      <>
                        <span>·</span>
                        <TagIcon className="size-3" />
                        <span>{task.category.name}</span>
                      </>
                    )}
                  </div>
                </div>
                <CommandShortcut>{task.priority}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
