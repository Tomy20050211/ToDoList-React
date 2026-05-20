import { useMemo } from "react";
import type { Task } from "../types/tasks";

export function useTaskCounters(task: Task[]) {
  return useMemo(() => {
    const pending = task.filter(item => item.status === "pending").length;
    const inProgress = task.filter(item => item.status === "in-progress").length;
    const done = task.filter(item => item.status === "done").length;

    return {
      pending,
      inProgress,
      done
    };
  }, [task]);
}