import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/router";
import { useCallback } from "react";

import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";

export function Provider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const navigate = useCallback(
    (href: string) => {
      void router.push(href);
    },
    [router],
  );

  return (
    <NextUIProvider navigate={navigate}>
      <ToastProvider>
        <AuthProvider>{children}</AuthProvider>
      </ToastProvider>
    </NextUIProvider>
  );
}
