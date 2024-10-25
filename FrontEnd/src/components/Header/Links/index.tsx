import { Button, Tooltip } from "@nextui-org/react";
import { motion } from "framer-motion";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

type LinksHeaderProps = {
  isOpen: boolean;
  icon: React.ReactNode;
  title: string;
  to?: string;
  onClick?: () => void;
  className?: string;
};

export const LinksHeader = ({
  isOpen,
  icon,
  title,
  to,
  onClick,
  className,
}: LinksHeaderProps) => {
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
      className="flex items-start justify-start w-full"
      initial={false}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <Tooltip content={title} isDisabled={isOpen} placement="right">
        <Button
          className={`border-none flex items-center justify-start text-sm border-1.5 text-zinc-800 hover:text-zinc-900 w-full ${
            isActive
              ? "border-tertiary text-primary hover:text-primary/60"
              : "border-none"
          }} ${className}`}
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
            animate={{ opacity: 1 }}
            className={`ml-1 text-sm`}
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
