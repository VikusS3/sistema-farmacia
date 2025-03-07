import { useState } from "react";
import { useHookForm } from "./useHookForm";

interface UseCrudFormProps<T> {
  initialValues: T;
  add: (values: T) => Promise<void>;
  update: (id: number, values: T) => Promise<void>;
  fetchById: (id: number) => Promise<T>;
}

export function useCrudForm<T>({
  initialValues,
  add,
  update,
  fetchById,
}: UseCrudFormProps<T>) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { handleChange, handleSubmit, reset, setValues, values } = useHookForm({
    initialValues: initialValues as Required<T>,
    onSubmit: async (values) => {
      if (editingId) {
        await update(editingId, values);
      } else {
        await add(values);
      }
      reset();
      setEditingId(null);
      setModalOpen(false);
    },
  });

  const handleEdit = async (id: number) => {
    const data = await fetchById(id);
    setValues(data as Required<T>);
    setEditingId(id);
    setModalOpen(true);
  };

  const openModalForCreate = () => {
    reset();
    setEditingId(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    reset();
    setEditingId(null);
    setModalOpen(false);
  };

  return {
    editingId,
    modalOpen,
    handleChange,
    handleSubmit,
    reset,
    setValues,
    values,
    handleEdit,
    openModalForCreate,
    closeModal,
  };
}
