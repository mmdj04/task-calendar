import { describe, it, expect } from "vitest";
import {
  formatDate,
  getPriorityColor,
  getPriorityLabel,
  getStatusColor,
  getStatusLabel,
  calculateDuration,
  formatDuration,
} from "@/lib/utils";

describe("formatDate", () => {
  it("formats date string to dd/MM/yyyy", () => {
    const result = formatDate("2025-01-15");
    expect(result).toMatch(/15\/01\/2025/);
  });

  it("formats Date object", () => {
    const date = new Date(2025, 0, 15);
    const result = formatDate(date);
    expect(result).toMatch(/15\/01\/2025/);
  });
});

describe("getPriorityColor", () => {
  it("returns correct color for each priority", () => {
    expect(getPriorityColor("urgent")).toBe("bg-red-500");
    expect(getPriorityColor("high")).toBe("bg-orange-500");
    expect(getPriorityColor("medium")).toBe("bg-yellow-500");
    expect(getPriorityColor("low")).toBe("bg-green-500");
  });
});

describe("getPriorityLabel", () => {
  it("returns correct label for each priority", () => {
    expect(getPriorityLabel("urgent")).toBe("Urgente");
    expect(getPriorityLabel("high")).toBe("Alta");
    expect(getPriorityLabel("medium")).toBe("Média");
    expect(getPriorityLabel("low")).toBe("Baixa");
  });
});

describe("getStatusColor", () => {
  it("returns correct color for each status", () => {
    expect(getStatusColor("not_started")).toBe("bg-slate-400");
    expect(getStatusColor("in_progress")).toBe("bg-blue-500");
    expect(getStatusColor("paused")).toBe("bg-yellow-500");
    expect(getStatusColor("completed")).toBe("bg-green-500");
    expect(getStatusColor("cancelled")).toBe("bg-red-400");
  });
});

describe("getStatusLabel", () => {
  it("returns correct label for each status", () => {
    expect(getStatusLabel("not_started")).toBe("Não iniciada");
    expect(getStatusLabel("in_progress")).toBe("Em andamento");
    expect(getStatusLabel("paused")).toBe("Pausada");
    expect(getStatusLabel("completed")).toBe("Concluída");
    expect(getStatusLabel("cancelled")).toBe("Cancelada");
  });
});

describe("calculateDuration", () => {
  it("calculates duration between two times", () => {
    expect(calculateDuration("09:00", "10:30")).toBe(90);
    expect(calculateDuration("14:00", "15:00")).toBe(60);
    expect(calculateDuration("08:00", "08:30")).toBe(30);
  });

  it("handles overnight times", () => {
    expect(calculateDuration("23:00", "01:00")).toBe(120);
  });
});

describe("formatDuration", () => {
  it("formats minutes to hours and minutes", () => {
    expect(formatDuration(60)).toBe("1h");
    expect(formatDuration(90)).toBe("1h 30min");
    expect(formatDuration(30)).toBe("30min");
    expect(formatDuration(120)).toBe("2h");
  });
});
