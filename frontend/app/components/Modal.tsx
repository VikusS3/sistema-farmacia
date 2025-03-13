import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CircleX } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
}) => {
  // Cerrar modal con la tecla "Esc"
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className={`bg-background-200 text-text-100 p-6 rounded-md shadow-lg ${
            className || "w-96"
          } relative`}
        >
          {/* Botón de cierre */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1 text-text-200 hover:text-accent-100 transition"
            aria-label="Cerrar modal"
          >
            <CircleX className="h-6 w-6" />
          </button>

          {/* Título */}
          <h2 className="text-xl font-semibold mb-4">{title}</h2>

          {/* Contenido */}
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;
