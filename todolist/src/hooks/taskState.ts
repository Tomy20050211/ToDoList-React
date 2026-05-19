import { useState } from "react";
import type { Task } from "../types/tasks";

export function useTask() {
  const [task, setTask] = useState<Task[]>([]);

  function addTask(title: string, description: string) {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      status: "pending"
    };

    setTask(prev => [...prev, newTask]);
  }

  return {
    task,
    addTask,
  };
}