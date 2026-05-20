import { useTask } from "./hooks/taskState";
import { ControllerInput } from "./components/ui/ControllerInput";
import { useMemo, useState } from "react";
import type { TaskStatus } from "./types/state";
import "./App.css";

function formatSeconds(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const paddedSeconds = String(seconds).padStart(2, "0");
  return `${minutes}:${paddedSeconds}`;
}

function getCardClass(task: { status: TaskStatus; isDeleting: boolean; isNew: boolean }) {
  const classes = ["taskCard"];

  if (task.status === "done") classes.push("taskCard--done");
  else if (task.status === "in-progress") classes.push("taskCard--inProgress");
  else classes.push("taskCard--pending");

  if (task.isNew) classes.push("taskCard--new");
  if (task.isDeleting) classes.push("taskCard--deleting");

  return classes.join(" ");
}

function getStatusLabel(status: TaskStatus) {
  if (status === "in-progress") return "in progress";
  return status;
}

function App() {
  const { task, addTask, removeTask, startTask, stopTask, setStatus } = useTask();
  const [title, setTitle] = useState("");

  const counters = useMemo(() => {
    const pending = task.filter(item => item.status === "pending").length;
    const inProgress = task.filter(item => item.status === "in-progress").length;
    const done = task.filter(item => item.status === "done").length;
    return { pending, inProgress, done };
  }, [task]);

  function handleAddTask() {
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    addTask(cleanTitle);
    setTitle("");
  }

  return (
    <div className="app">
      <header className="appHeader">
        <h1 className="appTitle">ToDo List</h1>
        <div className="appCounters">
          <span className="counter">pending: {counters.pending}</span>
          <span className="counter">in-progress: {counters.inProgress}</span>
          <span className="counter">done: {counters.done}</span>
        </div>
      </header>

      <ControllerInput value={title} onChange={setTitle} onSubmit={handleAddTask} />

      <section className="taskList">
        {task.map(item => (
          <article key={item.id} className={getCardClass(item)}>
            <div className="taskMain">
              <h2 className="taskTitle">{item.title}</h2>
              <div className="taskMeta">
                <span className={`taskStatus taskStatus--${item.status}`}>
                  {getStatusLabel(item.status)}
                </span>
                <span className="taskTime">{formatSeconds(item.elapsedSeconds)}</span>
                <span className="taskRunning">
                  {item.isRunning ? "running" : "stopped"}
                </span>
              </div>
            </div>

            <div className="taskControls">
              <select
                className="taskSelect"
                value={item.status}
                onChange={event => setStatus(item.id, event.target.value as TaskStatus)}
              >
                <option value="pending">pending</option>
                <option value="in-progress">in-progress</option>
                <option value="done">done</option>
              </select>

              <div className="taskActions">
                <button
                  className="taskButton taskButton--primary"
                  onClick={() => startTask(item.id)}
                  disabled={item.isRunning || item.status === "done"}
                >
                  Iniciar
                </button>
                <button
                  className="taskButton"
                  onClick={() => stopTask(item.id)}
                  disabled={!item.isRunning}
                >
                  Detener
                </button>
                <button
                  className="taskButton taskButton--danger"
                  onClick={() => removeTask(item.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </article>
        ))}

        {task.length === 0 && (
          <p className="taskEmpty">No hay tareas. Agrega una para empezar.</p>
        )}
      </section>
    </div>
  );
}

export default App;
