import { useEffect, useState } from "react";

type Serializer<T> = (value: T) => string;
type Deserializer<T> = (raw: string) => T;

function defaultSerialize<T>(value: T) {
  return JSON.stringify(value);
}

function defaultDeserialize<T>(raw: string) {
  return JSON.parse(raw) as T;
}

export function useLocalStorageState<T>(
  key: string,
  initialValue: T,
  options?: {
    serialize?: Serializer<T>;
    deserialize?: Deserializer<T>;
  },
) {
  const serialize = options?.serialize ?? defaultSerialize;
  const deserialize = options?.deserialize ?? defaultDeserialize;

  const [value, setValue] = useState<T>(() => {
    const raw = localStorage.getItem(key);
    if (!raw) return initialValue;
    try {
      return deserialize(raw);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, serialize(value));
  }, [key, serialize, value]);

  return [value, setValue] as const;
}
