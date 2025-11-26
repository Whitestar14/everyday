import { describe, it, expect, beforeEach } from "vitest";
import {
  parseTaskInput,
  extractHighlightFragments,
} from "@/services/ParsingService";

describe("ParsingService", () => {
  let referenceDate: Date;

  beforeEach(() => {
    referenceDate = new Date("2025-01-01T09:00:00Z");
  });

  describe("parseTaskInput", () => {
    it("parses start date with 'starting on' phrase", () => {
      const result = parseTaskInput("Project starting on Jan 5", { referenceDate });
      expect(result.startDate).toContain("2025-01-05");
      expect(result.cleanText).toBe("Project");
      expect(result.meta?.extractedStartFragment).toMatch(/starting on/i);
    });

    it("parses due date with 'due by' phrase", () => {
      const result = parseTaskInput("Report due by tomorrow", { referenceDate });
      expect(result.dueDate).toBeDefined();
      expect(result.cleanText).toBe("Report");
      expect(result.meta?.extractedDueFragment).toMatch(/due by/i);
    });

    it("parses multiple dates and assigns first as dueDate", () => {
      const result = parseTaskInput("Meeting Jan 10 and Jan 12", { referenceDate });
      expect(result.dueDate).toContain("2025-01-10");
      expect(result.meta?.additionalDates?.[0].date).toContain("2025-01-12");
      expect(result.cleanText).toBe("Meeting");
    });

    it("normalizes recurrence daily", () => {
      const result = parseTaskInput("Workout every day", { referenceDate });
      expect(result.recurrence?.type).toBe("daily");
      expect(result.cleanText).toBe("Workout");
    });

    it("normalizes recurrence weekly", () => {
      const result = parseTaskInput("Standup weekly", { referenceDate });
      expect(result.recurrence?.type).toBe("weekly");
    });

    it("normalizes recurrence monthly", () => {
      const result = parseTaskInput("Rent due every month", { referenceDate });
      expect(result.recurrence?.type).toBe("monthly");
    });

    it("normalizes recurrence yearly", () => {
      const result = parseTaskInput("Anniversary every year", { referenceDate });
      expect(result.recurrence?.type).toBe("yearly");
    });

    it("normalizes recurrence weekday/weekend", () => {
      const weekday = parseTaskInput("Work every weekday", { referenceDate });
      expect(weekday.recurrence?.type).toBe("weekday");

      const weekend = parseTaskInput("Relax every weekend", { referenceDate });
      expect(weekend.recurrence?.type).toBe("weekend");
    });

    it("normalizes recurrence custom weekly (Monday)", () => {
      const result = parseTaskInput("Class every Monday", { referenceDate });
      expect(result.recurrence?.type).toBe("custom-weekly");
      expect(result.recurrence?.daysOfWeek).toEqual([1]);
    });

    it("handles unparseable start date gracefully", () => {
      const result = parseTaskInput("Task starting on someday", { referenceDate });
      expect(result.errors?.[0]).toMatch(/couldn't parse date/i);
      expect(result.cleanText).toBe("Task");
    });

    it("handles unparseable due date gracefully", () => {
      const result = parseTaskInput("Task due on someday", { referenceDate });
      expect(result.errors?.[0]).toMatch(/couldn't parse date/i);
      expect(result.cleanText).toBe("Task");
    });

    it("adds error if DATE_HINTS present but no parseable date", () => {
      const result = parseTaskInput("Task tomorrowish", { referenceDate });
      expect(result.errors?.[0]).toMatch(/Couldn't parse date/i);
    });

    it("cleans up whitespace and punctuation", () => {
      const result = parseTaskInput("   Task   due by Jan 5,   ", { referenceDate });
      expect(result.cleanText).toBe("Task");
    });
  });

  describe("extractHighlightFragments", () => {
    it("extracts recurrence fragments", () => {
      const frags = extractHighlightFragments("Workout every day");
      expect(frags.some(f => f.type === "recurrence")).toBe(true);
    });

    it("extracts start fragments", () => {
      const frags = extractHighlightFragments("Project starting on Jan 5");
      expect(frags.some(f => f.type === "start")).toBe(true);
    });

    it("extracts due fragments", () => {
      const frags = extractHighlightFragments("Report due by tomorrow");
      expect(frags.some(f => f.type === "due")).toBe(true);
    });

    it("extracts chrono date fragments", () => {
      const frags = extractHighlightFragments("Meeting Jan 10", referenceDate);
      expect(frags.some(f => f.type === "date")).toBe(true);
    });

    it("resolves overlaps with priority (start > recurrence > date)", () => {
      const frags = extractHighlightFragments("starting on Jan 5 every day", referenceDate);
      const types = frags.map(f => f.type);
      // Ensure start fragment wins over overlapping date/recurrence
      expect(types).toContain("start");
      expect(types.includes("recurrence") || types.includes("date")).toBe(true);
    });

    it("groups contiguous same-type fragments", () => {
      const frags = extractHighlightFragments("every day every week", referenceDate);
      const recurrences = frags.filter(f => f.type === "recurrence");
      expect(recurrences.length).toBe(1); // grouped
    });

    it("returns empty array for blank input", () => {
      expect(extractHighlightFragments("")).toEqual([]);
    });
  });
});
