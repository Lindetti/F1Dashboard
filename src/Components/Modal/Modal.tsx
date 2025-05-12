import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex justify-center items-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="relative bg-[#1A1A24] max-w-6xl w-full mx-auto rounded-lg border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {" "}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl font-bold cursor-pointer z-50 w-8 h-8 flex items-center justify-center leading-none"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
