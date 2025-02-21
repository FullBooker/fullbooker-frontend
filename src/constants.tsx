import { Banknote, Gamepad2, Home, User, DollarSign, UserCircle } from "lucide-react";
import { SideNavItem } from "./types";
import {
  SessionPricingCategory,
  TicketPricingCategory,
} from "./domain/product";

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
  {
    title: "Profile",
    path: "/profile",
    icon: <UserCircle width={22} height={22} />,
    submenu: false,
  }
];

export const TICKET_PRICING_CATEGORIES: Array<TicketPricingCategory> = [
  {
    key: "early_bird",
    title: "Early bird ticket",
  },
  {
    key: "standard",
    title: "Standard Ticket",
  },
  {
    key: "standard_at_the_gate",
    title: "Standard at the Gate",
  },
  {
    key: "last_minute",
    title: "Last Minute Ticket",
  },
  {
    key: "vip",
    title: "VIP ticket",
  },
  {
    key: "vvip",
    title: "VVIP Ticket",
  },
];

export const SESSION_PRICING_CATEGORIES: Array<SessionPricingCategory> = [
  {
    key: "session",
    title: "Cost per Session",
  },
  {
    key: "day_pass",
    title: "Day Pass",
  },
  {
    key: "monthly_subscription",
    title: "Monthly Subscription",
  },
];
