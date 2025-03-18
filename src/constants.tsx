import {
  Banknote,
  Gamepad2,
  Home,
  User,
  DollarSign,
  UserCircle,
} from "lucide-react";
import { SideNavItem } from "./types";
import {
  SessionPricingCategory,
  TicketPricingCategory,
} from "./domain/product";
import { County } from "./domain/location";
import { PricingType } from "./domain/constants";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Home",
    path: "/",
    icon: <Home width={22} height={22} />,
  },
  // {
  //   title: "Activities",
  //   path: "/activities",
  //   icon: <Gamepad2 width={22} height={22} />,
  //   submenu: false,
  // },
  // {
  //   title: "Events",
  //   path: "/events",
  //   icon: <Banknote width={22} height={22} />,
  //   submenu: false,
  // },
  // {
  //   title: "Workshops",
  //   path: "/deposit",
  //   icon: <DollarSign width={22} height={22} />,
  //   submenu: false,
  // },
  // {
  //   title: "Coorprate Clubs",
  //   path: "/clubs",
  //   icon: <User width={22} height={22} />,
  //   submenu: false,
  // },
  // {
  //   title: "Profile",
  //   path: "/profile",
  //   icon: <UserCircle width={22} height={22} />,
  //   submenu: false,
  // }
];

export const TICKET_PRICING_CATEGORIES: Array<TicketPricingCategory> = [
  {
    key: "early_bird",
    title: "Early bird",
    label: "ticket",
  },
  {
    key: "standard",
    title: "Standard",
    label: "ticket",
  },
  {
    key: "standard_at_the_gate",
    title: "Standard at the Gate",
    label: "ticket",
  },
  {
    key: "last_minute",
    title: "Last Minute",
    label: "ticket",
  },
  {
    key: "vip",
    title: "VIP",
    label: "ticket",
  },
  {
    key: "vvip",
    title: "VVIP",
    label: "ticket",
  },
];

export const SESSION_PRICING_CATEGORIES: Array<SessionPricingCategory> = [
  {
    key: PricingType.session,
    title: "Cost per Session",
    label: "session",
  },
  {
    key: PricingType.dayPass,
    title: "Day Pass",
    label: "day pass",
  },
  {
    key: PricingType.monthlySubscription,
    title: "Monthly Subscription",
    label: "subscription",
  },
];

export const KENYAN_COUNTIES: Array<County> = [
  { name: "Baringo", latitude: 0.4565, longitude: 35.6037 },
  { name: "Bomet", latitude: -0.7813, longitude: 35.3413 },
  { name: "Bungoma", latitude: 0.5692, longitude: 34.5584 },
  { name: "Busia", latitude: 0.4347, longitude: 34.2422 },
  { name: "Elgeyo Marakwet", latitude: 0.857, longitude: 35.478 },
  { name: "Embu", latitude: -0.5384, longitude: 37.4591 },
  { name: "Garissa", latitude: -0.4532, longitude: 39.646 },
  { name: "Homa Bay", latitude: -0.6226, longitude: 34.3318 },
  { name: "Isiolo", latitude: 0.3546, longitude: 38.0254 },
  { name: "Kajiado", latitude: -1.8539, longitude: 36.7914 },
  { name: "Kakamega", latitude: 0.2827, longitude: 34.7519 },
  { name: "Kericho", latitude: -0.1829, longitude: 35.4785 },
  { name: "Kiambu", latitude: -1.1727, longitude: 36.8355 },
  { name: "Kilifi", latitude: -3.5103, longitude: 39.9093 },
  { name: "Kirinyaga", latitude: -0.6593, longitude: 37.3755 },
  { name: "Kisii", latitude: -0.6814, longitude: 34.7666 },
  { name: "Kisumu", latitude: -0.1022, longitude: 34.7617 },
  { name: "Kitui", latitude: -1.3662, longitude: 38.0105 },
  { name: "Kwale", latitude: -4.1733, longitude: 39.452 },
  { name: "Laikipia", latitude: 0.188, longitude: 36.7741 },
  { name: "Lamu", latitude: -2.2696, longitude: 40.9006 },
  { name: "Machakos", latitude: -1.5177, longitude: 37.2634 },
  { name: "Makueni", latitude: -1.8029, longitude: 37.6209 },
  { name: "Mandera", latitude: 3.939, longitude: 41.858 },
  { name: "Marsabit", latitude: 2.2981, longitude: 37.9784 },
  { name: "Meru", latitude: 0.3557, longitude: 37.8088 },
  { name: "Migori", latitude: -1.063, longitude: 34.4733 },
  { name: "Mombasa", latitude: -4.0435, longitude: 39.6682 },
  { name: "Murang'a", latitude: -0.7839, longitude: 37.04 },
  { name: "Nairobi", latitude: -1.2864, longitude: 36.8172 },
  { name: "Nakuru", latitude: -0.3031, longitude: 36.08 },
  { name: "Nandi", latitude: 0.1887, longitude: 35.1041 },
  { name: "Narok", latitude: -1.1041, longitude: 35.8703 },
  { name: "Nyamira", latitude: -0.5669, longitude: 34.9341 },
  { name: "Nyandarua", latitude: -0.1805, longitude: 36.5796 },
  { name: "Nyeri", latitude: -0.4162, longitude: 36.9515 },
  { name: "Samburu", latitude: 1.215, longitude: 36.708 },
  { name: "Siaya", latitude: 0.0605, longitude: 34.2862 },
  { name: "Taita Taveta", latitude: -3.3161, longitude: 38.5015 },
  { name: "Tana River", latitude: -1.8151, longitude: 39.6175 },
  { name: "Tharaka Nithi", latitude: -0.2966, longitude: 37.7936 },
  { name: "Trans Nzoia", latitude: 1.0206, longitude: 35.0036 },
  { name: "Turkana", latitude: 3.3136, longitude: 35.5658 },
  { name: "Uasin Gishu", latitude: 0.5191, longitude: 35.2698 },
  { name: "Vihiga", latitude: 0.0731, longitude: 34.7257 },
  { name: "Wajir", latitude: 1.7466, longitude: 40.0573 },
  { name: "West Pokot", latitude: 1.5126, longitude: 35.1182 },
];

export enum CustomeEvents {
  successfullTicketBooking = "SUCCESSFUL_TICKET_BOOKING",
  switchedToHostingSuccessfullEvent = "SWITCHED_TO_HOSTING",
  successfullUserAuthentication = "SUCCESSFUL_USER_AUTHENTICATION",
}

export const productProfileSteps = [
  { key: "intro", step: 0 },
  { key: "classification", step: 1 },
  { key: "description", step: 2 },
  { key: "availability", step: 3 },
  { key: "gallery", step: 4 },
  { key: "pricing", step: 5 },
  { key: "pricing-summary", step: 6 },
  { key: "publishing", step: 7 },
];

export enum HomePageProductSection {
  popularNowProducts = "popular",
  upcomingProducts = "upcoming",
  nearByProducts = 'nearby',
  recommendedProducts = "recommended",
}
