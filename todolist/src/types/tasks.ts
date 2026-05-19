import type { TaskStatus } from "./state";

export interface Task {
    id: string;
    title: string;
    description: string;
    status:TaskStatus
};