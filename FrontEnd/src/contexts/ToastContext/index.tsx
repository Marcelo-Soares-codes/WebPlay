// src/contexts/ToastContext.tsx
import React, { createContext, useCallback, useContext, useState } from "react";

import { Toast } from "@/components/Toast";

interface ToastData {
  id: number;
  message: string;
  type: "success" | "error" | "warning";
  time: number;
}

interface ToastContextData {
  showToast: (
    message: string,
    type: "success" | "error" | "warning",
    time?: number,
  ) => void;
  hideToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextData | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback(
    (
      message: string,
      type: "success" | "error" | "warning",
      time: number = 3000,
    ) => {
      const id = Date.now(); // Usar timestamp como ID único
      const newToast: ToastData = { id, message, type, time };

      setToasts((prevToasts) => [...prevToasts, newToast]);

      // Remover o toast automaticamente após o tempo especificado
      setTimeout(() => {
        hideToast(id);
      }, time);
    },
    [],
  );

  const hideToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <div className="fixed top-6 right-6 z-50 flex flex-col space-y-4">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            isOpen={true}
            message={toast.message}
            time={toast.time}
            type={toast.type}
            onClose={() => hideToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextData => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
};
