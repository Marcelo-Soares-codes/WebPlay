import { FaTh } from "react-icons/fa";
import { IoHome } from "react-icons/io5";

export const LinksSidebar = [
  {
    title: "início",
    to: "/",
    icon: <IoHome size={16} />,
  },
  {
    title: "Todos os Jogos",
    to: "/all-games",
    icon: <FaTh size={16} />,
  },
];
