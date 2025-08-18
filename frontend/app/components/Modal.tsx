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
        className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm overflow-y-auto"
      >
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className={`bg-background-100 text-text-200 p-6 rounded-xl shadow-2xl border border-background-300 max-h-screen overflow-y-auto ${
            className || "w-96"
          } relative mt-10 mb-10`}
        >
          {/* Botón de cierre */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 text-text-300 hover:text-primary-100 transition"
            aria-label="Cerrar modal"
          >
            <CircleX className="h-6 w-6" />
          </button>

          {/* Título */}
          <h2 className="text-xl font-semibold text-text-100 mb-4">{title}</h2>

          {/* Contenido */}
          <div className="text-text-200">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;
