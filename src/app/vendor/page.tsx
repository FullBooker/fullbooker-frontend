"use client";

import CarouselBanner from "@/components/carousel";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Banknote,
  CalendarDays,
  ChevronRight,
  Crown,
  Heart,
  Hourglass,
  UserRound,
  Music,
  Palette,
  Utensils,
  Mountain,
  Landmark,
  Trees,
  Theater,
  Trophy,
  ChevronLeft,
  Users,
  Dumbbell,
  Car,
  Bike,
  // Swimming,
  Mic,
  Target,
  Locate,
  Map,
  LocateIcon,
  MapPin,
  ChevronDown,
  SlidersHorizontal,
  SearchIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { truncateText } from "../helpers/general-helper";
import { connect } from "react-redux";
import { RootState } from "@/store";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import TablePaginationComponent from "@/components/ui/pagination";
import { ModalID } from "@/domain/components";
import VendorLayout from "./layout";
import { withAuth } from '../../components/views/dash/authGuard';


type VendorPageProps = {
  isLoggedIn: boolean;
  setActiveModal: (modalId: ModalID) => void;
};

const VendorPage: FC<VendorPageProps> & {layout: any} = ({ isLoggedIn, setActiveModal }) => {
  const { theme = "light" } = useTheme();
  const [themeMode, setThemeMode] = useState("light");
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const slides = [
    "/assets/img_banner1.png",
    "/assets/img_banner1.png",
    "/assets/img_banner1.png",
    "/assets/img_banner1.png",
  ];

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useEffect(() => {
    setThemeMode(theme);
  }, [theme]);

  return <div className="flex flex-col h-fit bg-white"></div>;
};

VendorPage.layout = VendorLayout

const mapStateToProps = (state: RootState) => {
  const { isLoggedIn } = state.authentication;
  return { isLoggedIn };
};

const mapDispatchToProps = (dispatch: any) => ({
  setActiveModal: (modalId: ModalID) =>
    dispatch.components.setActiveModal(modalId),
});

export default connect(mapStateToProps, mapDispatchToProps)(withAuth(VendorPage));
