/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

type HookForm<T> = {
  initialValues: T;
  onSubmit: (values: T) => void;
};

export const useHookForm = <T extends Record<string, any>>({
  initialValues,
  onSubmit,
}: HookForm<T>) => {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  const reset = () => {
    setValues(initialValues);
  };

  return { values, handleChange, handleSubmit, reset, setValues };
};
