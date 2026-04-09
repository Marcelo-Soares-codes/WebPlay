import type React from "react";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AiOutlineWarning } from "react-icons/ai";
import {
  IoMdCheckmarkCircleOutline,
  IoMdCloseCircleOutline,
} from "react-icons/io";
import { MdClose } from "react-icons/md";

interface ToastProps {
  message: string;
  type: "success" | "error" | "warning";
  isOpen: boolean;
  time?: number;
  onClose: () => void;
}

const alertStyles = {
  success: "bg-green-600",
  error: "bg-red-600",
  warning: "bg-yellow-600",
};

const iconStyles = {
  success: <IoMdCheckmarkCircleOutline className="mr-2" size={20} />,
  error: <IoMdCloseCircleOutline className="mr-2" size={20} />,
  warning: <AiOutlineWarning className="mr-2" size={20} />,
};

const alertVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  isOpen,
  time = 3000,
  onClose,
}) => {
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    if (!isOpen) {
      setVisible(false);

      return;
    }

    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, time);

    return () => clearTimeout(timer);
  }, [isOpen, onClose, time]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          animate="visible"
          className={`relative w-full max-w-sm rounded-lg px-4 py-2 text-white shadow-md ${alertStyles[type]}`}
          exit="exit"
          initial="hidden"
          role="alert"
          transition={{ duration: 0.3 }}
          variants={alertVariants}
        >
          <div className="flex items-center">
            {iconStyles[type]}
            <span className="flex-grow text-xs">{message}</span>
            <button
              className="ml-4 flex items-center justify-center text-center text-lg font-bold"
              type="button"
              onClick={() => {
                setVisible(false);
                onClose();
              }}
            >
              <MdClose />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
