import { LinksSidebar } from "./links";
import { ItemSidebar } from "./SidebarItem"; // Componente de ItemSidebar

const Sidebar = () => {
  // Seleciona os links corretos com base na rota
  const links = LinksSidebar;

  return (
    <aside className="hidden sm:flex">
      <div
        className={`sticky top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r-1 border-zinc-400 z-50 text-white flex flex-col py-2 transition-width duration-300 w-14 md:w-16 px-2`}
      >
        {/* Navigation */}
        <nav className="flex-grow flex flex-col items-center justify-between py-2">
          <ul className="space-y-4">
            {/* Itera sobre os links corretos com base na rota */}
            {links.map((link, index) => (
              <ItemSidebar
                key={index}
                icon={link.icon}
                isOpen={false}
                title={link.title}
                to={link.to}
              />
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
