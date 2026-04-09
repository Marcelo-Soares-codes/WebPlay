import type { ReactNode } from "react";

import { Header } from "../Header";
import Sidebar from "../Sidebar";

interface TemplateAuthProps {
  children: ReactNode;
}

export const TemplateAuth = ({ children }: TemplateAuthProps) => {
  return (
    <main className="min-h-screen w-full bg-gray-50">
      <Header />
      <div className="flex h-full">
        <Sidebar />
        <div className="relative container h-full py-10">{children}</div>
      </div>
    </main>
  );
};
