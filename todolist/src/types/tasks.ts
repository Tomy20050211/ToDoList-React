import type { TaskStatus } from "./state";

export interface Task {
    id: string;
    title: string;
    status: TaskStatus;
    elapsedSeconds: number;
    isRunning: boolean;
    isDeleting: boolean;
    isNew: boolean;
};
