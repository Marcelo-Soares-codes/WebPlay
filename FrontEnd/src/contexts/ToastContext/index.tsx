import type React from "react";

import { createContext, useCallback, useContext, useState } from "react";

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
      const id = Date.now();
      const newToast: ToastData = { id, message, type, time };

      setToasts((currentToasts) => [...currentToasts, newToast]);
    },
    [],
  );

  const hideToast = useCallback((id: number) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id),
    );
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      <div className="relative min-h-screen w-full">
        <div className="fixed right-6 top-6 z-50 flex flex-col items-end justify-end space-y-4 p-6">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              isOpen
              message={toast.message}
              time={toast.time}
              type={toast.type}
              onClose={() => hideToast(toast.id)}
            />
          ))}
        </div>
        {children}
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
