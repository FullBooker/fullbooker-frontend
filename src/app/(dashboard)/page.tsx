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
  Target
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { truncateText } from "../helpers/general-helper";
import { connect } from "react-redux";
import { RootState } from "@/store";
import { GamesApiResponse } from "@/domain/dto/output";
import { Game } from "@/domain/games";
import { ActiveGamePayload, GamesFilters } from "@/domain/dto/input";
import { Promotion } from "@/domain/promotions";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import TablePaginationComponent from "@/components/ui/pagination";

type HomePageProps = {
  isLoggedIn: boolean;
};

const HomePage: FC<HomePageProps> = ({
  isLoggedIn,
}) => {
  const [filters, setFilters] = useState<GamesFilters>({
    page: 1,
    pageSize: 12,
  });

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
      icon: Users
    },
    {
      name: "Concerts",
      icon: Music
    },
    {
      name: "Gyms",
      icon: Dumbbell
    },
    {
      name: "Go karting",
      icon: Car
    },
    {
      name: "Quad biking",
      icon: Bike
    },
    // {
    //   name: "Swimming",
    //   icon: Swimming
    // },
    {
      name: "Stand Ups",
      icon: Mic
    },
    {
      name: "Car shows",
      icon: Car
    },
    {
      name: "Paintballing",
      icon: Target
    },
    {
      name: "Sports",
      icon: Trophy
    },
    {
      name: "Arts",
      icon: Palette
    },
    {
      name: "Food",
      icon: Utensils
    },
    {
      name: "Adventure",
      icon: Mountain
    },
    {
      name: "Culture",
      icon: Landmark
    }
  ];

  return (
    <div className="flex flex-col gap-5 h-fit px-4 sm:px-7">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row gap-8 py-8 bg-gray-100 px-8">
        <div className="flex-1">
          <h1 className="text-5xl font-semibold mb-4">
            Seamless Ticket booking at Your Fingertips
          </h1>
          <p className="text-textColor mb-6">
            FullBooker makes booking for events and recreational activities
            quick and hassle-free
          </p>

          {/* Search Inputs */}
          <div className="flex flex-col gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Type your preferred destination"
                className="w-full p-3 rounded-lg border border-inputBorderColor"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Image
                  src="/assets/location-icon.png"
                  alt="Location"
                  width={20}
                  height={20}
                />
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search for activities and events"
                className="w-full p-3 rounded-lg border border-inputBorderColor"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Image
                  src="/assets/search-icon.png"
                  alt="Search"
                  width={20}
                  height={20}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex justify-center items-start">
          <div className="w-[400px] h-[400px] flex justify-between gap-5 items-center">
            <div>
              <Image
                src="/assets/popular-event.svg"
                alt="Hero"
                objectFit="contain"
                className="w-[250px] h-[250px]"
                height={250}
                width={250}
              />
            </div>
            <div className="">
              <p className="font-bold text-2xl">50,000+</p>
              <p className="text-sm text-textColor">
                Recreational Activities and Events for you to choose from
              </p>
            </div>
          </div>
          {/* <div className=" w-[200px] h-[200px] flex justify-between">
              <Image
                src="/assets/image_60.png"
                alt="Hero"
                objectFit="contain"
                className="w-[200px] h-[200px]"
                height={200}
                width={420}
              />
          </div> */}
        </div>
      </div>

      {/* Activity Categories */}
      <div className="py-8">
        <div className="flex items-center justify-center gap-8">
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 flex-shrink-0">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
            {categories.map((category, index) => (
              <div key={index} className="flex flex-col items-center gap-2 min-w-[80px] flex-shrink-0">
                <div className="w-12 h-12 rounded-ful flex items-center justify-center">
                  {React.createElement(category.icon, {
                    size: 24,
                    className: "text-gray-600"
                  })}
                </div>
                <span className="text-sm text-center">{category.name}</span>
              </div>
            ))}
          </div>

          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 flex-shrink-0">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Popular Now Section */}
      <div className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Popular now</h2>
          <Link href="/popular" className="text-mainColor">See all</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(10).fill(null).map((_, index) => (
            <div key={index} className="relative group rounded-lg overflow-hidden">
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

      {/* <div className="w-full flex flex-col gap-5">
        <div className="flex items-center gap-3 px-4 sm:px-7">
          <Image
            src="/assets/ic_promotions.png"
            alt="Promotions"
            width={100}
            height={100}
            className="w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8"
          />

          <h1 className="text-sm md:text-base lg:text-lg font-semibold">
            Offers & Promotions
          </h1>
        </div>
        {promotionsloading ? (
          <div className="flex flex-col gap-4 sm:gap-6 p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array(8)
                .fill(null)
                .map((_, index) => (
                  <div key={index} className="group">
                    <div className={baseStyle}>
                      <div
                        className={`flex items-center justify-center w-full h-full ${shimmerStyle}`}
                      >
                        <div className="w-full h-full rounded-[20px]"></div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 sm:gap-6">
            {promotions?.length > 0 ? (
              <Carousel setApi={setApi} className="w-full">
                <CarouselContent className="px-4 sm:px-7 pb-7">
                  {promotions?.map((promotion: Promotion, index) => (
                    <CarouselItem
                      key={index}
                      className="basis-12/12 mr-1 sm:basis-12/12 sm:mr-1 md:basis-12/12 md:mr-2 lg:basis-12/12 lg:mr-2 xl:basis-12/12 xl:mr-2 2xl:basis-12/12 2xl:mr-2"
                    >
                      <Link
                        href={`/promotions/detail/${promotion?.id}`}
                        className={`flex flex-col gap-0 w-[275px] sm:w-[280px] md:w-[330px] lg:w-[380px] xl:w-[400px] 2xl:w-[420px] ${
                          themeMode === "light"
                            ? "shadow-card-auth-shadow"
                            : "bg-cardColor"
                        } rounded-[20px]`}
                      >
                        <div
                          className="flex flex-col justify-end w-full h-[170px] sm:h-[180px] md:h-[190px] lg:h-[200px] px-7 rounded-t-[10px] bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${promotion?.promo_image})`,
                          }}
                        >
                          <div className="flex w-fit p-2 lg:p-[10px] gap-2 -mb-5 items-center bg-gradient-to-bl from-mainColor via-redMediumColor to-redDarkColor text-whiteColor rounded-full text-sm">
                            <Banknote className="w-[18px] h-[18px] md:w-5 mg:h-5 lg:w-6 lg:h-6" />
                            <span className="text-xs sm:text-sm md:text-base">
                              Promotion
                            </span>
                          </div>
                        </div>
                        <div className="mt-5 pt-4 md:pt-6 pb-7 px-7 w-full">
                          <div className="flex flex-col gap-5">
                            <h1 className="text-sm lg:hidden font-semibold">
                              {truncateText(promotion.title)}
                            </h1>
                            <h1 className="hidden lg:inline-block text-base font-semibold">
                              {promotion.title}
                            </h1>
                            <div className="flex items-center gap-2">
                              <CalendarDays
                                className={`w-[18px] h-[18px] md:w-5 mg:h-5 lg:w-6 lg:h-6 ${
                                  themeMode === "light"
                                    ? "text-placeholderColor"
                                    : "text-textColor"
                                }`}
                              />
                              <span className="text-sm md:text-base text-textColor">
                                {promotion?.created_at?.split(" ")[0]}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex items-center justify-center gap-2 pb-10">
                  {promotions.map((_, index) => (
                    <div
                      key={index + 1}
                      className={`transition-all h-[6px] w-7 md:w-8 md:h-2 lg:w-10 ${
                        themeMode === "light" ? "bg-[#D3D3D3]" : "bg-[#282828]"
                      } rounded-full ${
                        current === index + 1
                          ? "w-[68px] md:w-[74px] lg:w-20 bg-gradient-to-bl from-mainColor via-redMediumColor to-redDarkColor"
                          : `${
                              themeMode === "light"
                                ? "bg-[#D3D3D3]"
                                : "bg-[#282828]"
                            }`
                      }`}
                    />
                  ))}
                </div>
              </Carousel>
            ) : (
              <div className="flex items-center justify-center gap-2 pb-10">
                <p className="text-red-500">
                  Oops! There are no promotions at the moment
                </p>
              </div>
            )}
          </div>
        )}
      </div> */}
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const { isLoggedIn } = state.authentication;
  return { isLoggedIn };
};

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
