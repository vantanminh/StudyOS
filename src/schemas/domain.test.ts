import { describe, expect, it } from "vitest";
import { createTaskInputSchema, studyTaskSchema } from "@/schemas/domain";

describe("task schemas", () => {
  it("parses create task input", () => {
    const parsed = createTaskInputSchema.parse({
      title: "Luyện Reading",
      type: "custom",
      priority: "medium",
      estimatedMinutes: 45,
    });
    expect(parsed.type).toBe("custom");
    expect(parsed.estimatedMinutes).toBe(45);
  });

  it("rejects empty title", () => {
    expect(() => createTaskInputSchema.parse({ title: "" })).toThrow();
  });

  it("validates full study task", () => {
    const task = studyTaskSchema.parse({
      id: "task_1",
      title: "Test",
      type: "practice",
      status: "planned",
      priority: "medium",
      estimatedMinutes: 30,
      actualMinutes: 0,
      progress: 0,
      source: "manual",
      needsReview: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    expect(task.id).toBe("task_1");
  });
});
