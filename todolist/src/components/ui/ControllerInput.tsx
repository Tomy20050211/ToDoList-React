import { type FormEvent } from "react";

type ControllerInputProps = {
  value: string;
  placeholder?: string;
  submitText?: string;
  onChange: (nextValue: string) => void;
  onSubmit: () => void;
};

export function ControllerInput({
  value,
  placeholder = "Nueva tarea…",
  submitText = "Agregar",
  onChange,
  onSubmit,
}: ControllerInputProps) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form className="taskForm" onSubmit={handleSubmit}>
      <input
        className="taskInput"
        value={value}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
      />
      <button className="taskButton taskButton--primary" type="submit" disabled={!value.trim()}>
        {submitText}
      </button>
    </form>
  );
}
