import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import { teamColors } from "../../TeamColors";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  teamName?: string;
}

const Modal = ({ isOpen, onClose, children, teamName }: ModalProps) => {
  if (!isOpen) return null;
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const borderColor = teamName ? teamColors[teamName] : "#374151"; // gray-700 as fallback

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex justify-center items-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
      >
        <div
          className="relative bg-[#1A1A24] max-w-6xl w-full mx-auto rounded-lg"
          style={{ border: `1px solid ${borderColor}` }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl font-bold cursor-pointer z-50 w-8 h-8 flex items-center justify-center leading-none"
          >
            ×
          </button>
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;
