import { Banknote, Gamepad2, Home, User, DollarSign } from "lucide-react";
import { SideNavItem } from "./types";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Home",
    path: "/",
    icon: <Home width={22} height={22} />,
  },
  {
    title: "Activities",
    path: "/activities",
    icon: <Gamepad2 width={22} height={22} />,
    submenu: false,
  },
  {
    title: "Events",
    path: "/events",
    icon: <Banknote width={22} height={22} />,
    submenu: false,
  },
  {
    title: "Workshops",
    path: "/deposit",
    icon: <DollarSign width={22} height={22} />,
    submenu: false,
  },
  {
    title: "Coorprate Clubs",
    path: "/clubs",
    icon: <User width={22} height={22} />,
    submenu: false,
  },
];
