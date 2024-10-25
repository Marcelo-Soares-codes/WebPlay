import { Button, Tooltip } from "@nextui-org/react";
import { motion } from "framer-motion";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

type ItemSidebarProps = {
  isOpen: boolean;
  icon: React.ReactNode;
  title: string;
  to?: string;
  onClick?: () => void;
  className?: string;
};

export const ItemSidebar = ({
  isOpen,
  icon,
  title,
  to,
  onClick,
  className,
}: ItemSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    }
  };

  const isActive = to === location.pathname;

  return (
    <motion.li
      animate={{ justifyContent: isOpen ? "flex-start" : "center" }}
      className="flex items-center justify-start w-full"
      initial={false}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <Tooltip content={title} isDisabled={isOpen} placement="right">
        <Button
          className={`flex items-center text-sm border-1.5 text-primary hover:bg-secondary hover:text-white w-full ${
            isActive
              ? "border-tertiary bg-secondary/60 hover:bg-secondary/60 text-zinc-800 hover:text-zinc-900"
              : "border-none"
          } ${isOpen ? "justify-start" : "justify-center"} ${className}`}
          isIconOnly={!isOpen}
          variant="bordered"
          onClick={handleClick}
        >
          <motion.span
            animate={{ scale: isOpen ? 1 : 1.2 }}
            className="flex items-center"
            initial={{ scale: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {icon}
          </motion.span>
          {/* Esconda o título quando `isOpen` for falso */}
          <motion.span
            animate={{ opacity: isOpen ? 1 : 0 }}
            className={`ml-1 text-sm ${isOpen ? "" : "hidden"}`}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {title}
          </motion.span>
        </Button>
      </Tooltip>
    </motion.li>
  );
};
