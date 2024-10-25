import { Header } from "../Header";
import Sidebar from "../Sidebar";

interface TemplateAuthProps {
  children: JSX.Element;
}

export const TemplateAuth = ({ children }: TemplateAuthProps) => {
  return (
    <main className="w-full min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="container py-10">{children}</div>
      </div>
    </main>
  );
};
