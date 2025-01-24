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

type HomePageProps = {
  isLoggedIn: boolean;
  setActiveModal: (modalId: ModalID) => void;
};

const HomePage: FC<HomePageProps> = ({ isLoggedIn, setActiveModal }) => {
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

  const baseStyle = `
    h-[210px] sm:h-[220px] md:h-[232px] lg:h-[246px] xl:h-[254px] 2xl:h-[268px] rounded-[20px] overflow-hidden
  `;

  const shimmerStyle = `
    shimmer animate shimmer-slow bg-gray-200 animate-shimmer-slow
  `;

  const categories = [
    {
      name: "Kids",
      icon: Users,
    },
    {
      name: "Concerts",
      icon: Music,
    },
    {
      name: "Gyms",
      icon: Dumbbell,
    },
    {
      name: "Go karting",
      icon: Car,
    },
    {
      name: "Quad biking",
      icon: Bike,
    },
    // {
    //   name: "Swimming",
    //   icon: Swimming
    // },
    {
      name: "Stand Ups",
      icon: Mic,
    },
    {
      name: "Car shows",
      icon: Car,
    },
    {
      name: "Paintballing",
      icon: Target,
    },
    {
      name: "Sports",
      icon: Trophy,
    },
    {
      name: "Arts",
      icon: Palette,
    },
    {
      name: "Food",
      icon: Utensils,
    },
    {
      name: "Adventure",
      icon: Mountain,
    },
    {
      name: "Culture",
      icon: Landmark,
    },
  ];

  return (
    <div className="flex flex-col h-fit bg-gray-100">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row gap-8 py-3 lg:py-8 md:py-8 xl:py-8 px-2 md:px-3 lg:px-4">
        <div
          className="flex-1 py-1
          px-4 sm:px-7"
        >
          <h1 className="text-3xl lg:text-5xl md:text-5xl xl:text-5xl font-semibold mb-4 lg:mb-8 lg:w-[50%]">
            Seamless Ticket booking at Your Fingertips
          </h1>
          <p className="text-black mb-4 lg:mb-6">
            FullBooker makes booking for events and recreational activities
            quick and hassle-free
          </p>

          {/* Search Inputs */}
          <div className="flex items-center w-full mb-5 lg:mb-8 md:mb-8 xl:mb-8">
            <div className="">
              <MapPin className="h-10 w-10 text-white fill-primary" />
            </div>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Type your preferred destination"
                className="w-full p-3 rounded-full border bg-white shadow-md outline-none border-none pl-3"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronDown className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="flex items-center w-full">
            <div className="relative left-0 right-0 w-full rounded-lg border border-inputBorderColor">
              <div className="absolute top-3 left-2">
                <SearchIcon className="h-6 w-6 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search for activities and events"
                className="w-full p-3 bg-gray-100 rounded-lg outline-none border-none pl-10"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <SlidersHorizontal className="h-6 w-6 text-black fill-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex-row justify-center items-start h-[250px] px-2 md:px-3 lg:px-4">
          <div className="w-full flex justify-between">
            <div className="lg:flex md:flex xl:flex sm:w-[50%] xs:w-[50%]">
              <Image
                src="/assets/popular-event.svg"
                alt="Hero"
                objectFit="contain"
                className="w-[100%] h-[200px]"
                height={200}
                width={500}
              />
            </div>
            <div className="ml-5 sm:w-[50%] xs:w-[50%] pt-8">
              <p className="font-bold text-3xl lg:text-5xl md:text-5xl xl:text-5xl items-center mb-4">
                50,000+
              </p>
              <p className="text-sm text-black w-[70%]">
                Recreational Activities and Events for you to choose from
              </p>
              <div className="flex justify-cente mt-4 w-[90%] lg:w-[70%] md:w-[70%] xl:w-[70%]">
                <div className="border-b-4 lg:border-b-8 md:border-b-8 xl:border-b-8 border-darkOrange w-[70%]"></div>
                <div className="border-b-4 lg:border-b-8 md:border-b-8 xl:border-b-8 border-gray-400 w-[30%]"></div>
              </div>
            </div>
          </div>
          <div className="w-full h-[160px] bg-black mt-4 rounded-sm p-4">
            <div className="mb-20">
              <p className="text-white text-left">
                Find your favorite events here
              </p>
            </div>
            <div>
              <p className="text-white text-right">Find events near you here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Categories */}
      <div className="py-3 lg:py-6 md:py-6 xl:py-6 bg-white px-2 md:px-3 lg:px-4 ">
        <div
          className="flex items-center gap-8  py-4
          px-4 sm:px-7"
        >
          <button className="rounded-full bg-white hover:bg-gray-200 flex-shrink-0 border border-gray-800">
            <ChevronLeft className="w-10 h-10 text-black" />
          </button>

          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
            {categories.map((category, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 min-w-[80px] flex-shrink-0"
              >
                <div className="w-6 h-6 lg:w-12 md:w-12 xl:w-12 lg:h-12 md:h-12 xl:h-12 rounded-ful flex items-center justify-center">
                  {React.createElement(category.icon, {
                    size: 24,
                    className: "text-gray-600",
                  })}
                </div>
                <span className="text-sm text-center">{category.name}</span>
              </div>
            ))}
          </div>

          <button className="rounded-full bg-white hover:bg-gray-200 flex-shrink-0 border border-gray-800">
            <ChevronRight className="w-10 h-10 text-black" />
          </button>
        </div>
      </div>

      {/* Popular Now Section */}
      <div className="py-2 lg:py-8 md:py-8 xl:py-8 px-2 md:px-3 lg:px-4 bg-white">
        <div
          className="flex justify-between items-center mb-6 py-4
          px-4 sm:px-7"
        >
          <h2 className="text-xl font-semibold">Popular now</h2>
          <Link href="/popular" className="text-mainColor">
            See all
          </Link>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-4
          px-4 sm:px-7"
        >
          {Array(10)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="relative group rounded-lg overflow-hidden"
              >
                <Image
                  src={"/assets/quad.png"}
                  alt={"Event"}
                  width={300}
                  height={200}
                  className="w-full h-[200px] object-cover shadow-md rounded-sm"
                />
                <div className="absolute top-3 right-3">
                  <button className="p-2 rounded-full bg-white/80">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{"Quad Biking"}</h3>
                  <div className="flex items-center gap-2 text-sm text-textColor">
                    <CalendarDays className="w-4 h-4" />
                    <span>Every day from 8:00 AM to 10:00 PM</span>
                  </div>
                  <button className="w-full mt-4 py-2 px-4 bg-mainColor text-white rounded-full">
                    Book this Activity
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="py-8 px-2 md:px-3 lg:px-4 bg-white text-center">
        <div className=" px-4 sm:px-7">
          <p className="mb-10">Explore more events and activities</p>
          <button
            className="sm:w-full xs:w-full lg:w-[10%] md:w-[25%] w-full bg-primary text-black py-2 rounded-md mb-2"
            onClick={() => setActiveModal(ModalID.login)}
          >
            Sign In/Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const { isLoggedIn } = state.authentication;
  return { isLoggedIn };
};

const mapDispatchToProps = (dispatch: any) => ({
  setActiveModal: (modalId: ModalID) =>
    dispatch.components.setActiveModal(modalId),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
