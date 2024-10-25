import {
  Navbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { Image, Link } from "@nextui-org/react";
import { useState } from "react";

import { LinksSidebar } from "../Sidebar/links";

import { LinksHeader } from "./Links";

import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {}

export const Header = ({}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Navbar
      className="shadow-md border-b border-zinc-400"
      height={75}
      maxWidth="full"
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <Link href="/">
          <Image
            className="object-contain mx-auto"
            height={60}
            src="./logo.png"
            width={60}
          />
        </Link>
      </NavbarContent>
      <NavbarContent justify="end">
        {user?.name && (
          <Dropdown>
            <DropdownTrigger>
              <span className="cursor-pointer text-sm font-medium hover:text-gray-700">
                {user.name}
              </span>
            </DropdownTrigger>
            <DropdownMenu aria-label="User menu options">
              <DropdownItem
                key="logout"
                className="!text-red-600 hover:bg-none"
                onClick={handleLogout}
              >
                Sair
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </NavbarContent>
      <NavbarMenu className="py-8">
        {LinksSidebar.map((link, index) => (
          <NavbarMenuItem key={index}>
            <LinksHeader
              icon={link.icon}
              isOpen={false}
              title={link.title}
              to={link.to}
            />
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};
