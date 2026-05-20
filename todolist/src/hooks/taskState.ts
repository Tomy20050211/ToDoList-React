import { useEffect } from "react";
import { useLocalStorageState } from "./useLocalStorage";
import type { Task } from "../types/tasks";
import type { TaskStatus } from "../types/state";

function isTaskStatus(value: unknown): value is TaskStatus {
  return value === "pending" || value === "in-progress" || value === "done";
}

function normalizeTask(value: Partial<Task> & Pick<Task, "id" | "title">): Task {
  const status = isTaskStatus(value.status) ? value.status : "pending";

  return {
    id: value.id,
    title: value.title,
    status,
    elapsedSeconds: typeof value.elapsedSeconds === "number" ? value.elapsedSeconds : 0,
    isRunning: typeof value.isRunning === "boolean" ? value.isRunning : status === "in-progress",
    isDeleting: false,
    isNew: false,
  };
}

export function useTask() {
  const [task, setTask] = useLocalStorageState<Task[]>("todolist.tasks", []);

  useEffect(() => {
    setTask(prev =>
      prev.map(item => normalizeTask(item as Partial<Task> & Pick<Task, "id" | "title">)),
    );
  }, [setTask]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTask(prev =>
        prev.map(item =>
          item.isRunning
            ? { ...item, elapsedSeconds: item.elapsedSeconds + 1 }
            : item,
        ),
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, [setTask]);

  function addTask(title: string) {
    const id = crypto.randomUUID();

    const newTask: Task = {
      id,
      title,
      status: "in-progress",
      elapsedSeconds: 0,
      isRunning: true,
      isDeleting: false,
      isNew: true,
    };

    setTask(prev => [...prev, newTask]);

    window.setTimeout(() => {
      setTask(prev =>
        prev.map(item => (item.id === id ? { ...item, isNew: false } : item)),
      );
    }, 260);
  }

  function removeTask(id: string) {
    setTask(prev =>
      prev.map(item => (item.id === id ? { ...item, isDeleting: true } : item)),
    );

    window.setTimeout(() => {
      setTask(prev => prev.filter(item => item.id !== id));
    }, 220);
  }

  function startTask(id: string) {
    setTask(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        if (item.isDeleting) return item;
        if (item.status === "done") return item;
        return { ...item, isRunning: true, status: "in-progress" };
      }),
    );
  }

  function stopTask(id: string) {
    setTask(prev =>
      prev.map(item =>
        item.id === id && !item.isDeleting ? { ...item, isRunning: false } : item,
      ),
    );
  }

  function setStatus(id: string, status: TaskStatus) {
    setTask(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        if (item.isDeleting) return item;
        const isRunning = status === "done" ? false : item.isRunning;
        return { ...item, status, isRunning };
      }),
    );
  }

  return {
    task,
    addTask,
    removeTask,
    startTask,
    stopTask,
    setStatus,
  };
}
