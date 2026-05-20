export type ControllerInputProps = {
  value: string;
  placeholder?: string;
  submitText?: string;
  onChange: (nextValue: string) => void;
  onSubmit: () => void;
};
