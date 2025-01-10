import {
  Banknote,
  Gamepad2,
  Home,
  User,
  DollarSign
} from "lucide-react";
import { SideNavItem } from "./types";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Home",
    path: "/",
    icon: <Home width={22} height={22} />,
  },
  {
    title: "Crash Games",
    path: "/crash-games",
    icon: <Gamepad2 width={22} height={22} />,
    submenu: false,
  },
  {
    title: "Promotions",
    path: "/main-menu/promotions",
    icon: <Banknote width={22} height={22} />,
    submenu: false,
  },
  {
    title: "Deposit",
    path: "/deposit",
    icon: <DollarSign width={22} height={22} />,
    submenu: false,
  },
  {
    title: "Profile",
    path: "/profile",
    icon: <User width={22} height={22} />,
    submenu: false,
  },
];
