"use client";

import { useTheme } from "next-themes";
import React from "react";
import { SIDENAV_ITEMS } from "@/constants";
import { SideNavItem } from "@/types";
import { ChevronUp, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LogoutButton from "./components/LogoutButton";

const Sidebar = ({
  theme,
  open,
  onClose,
  isMobile,
}: {
  theme: string | undefined;
  open: boolean;
  onClose: React.MouseEventHandler<HTMLSpanElement>;
  isMobile: boolean;
}) => {
  return (
    <div
      className={`w-65 xl:block duration-175 linear !z-50 absolute h-[100vh] overflow-auto bg-sidebarColor transition-all ${
        theme === "light" ? "border-strokeColor2" : "bg-dark"
      } lg:!z-50 xl:!z-50 2xl:!z-0 sidebar-container ${
        open ? "translate-x-0" : "-translate-x-96"
      } flex flex-col`}
    >
      <span
        className="absolute top-4 right-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <X className="w-4 h-4" />
      </span>
      <div className={`flex flex-col justify-between h-[100vh]`}>
        <div className="flex-grow">
          <div className={`mx-6 mb-5 ${isMobile ? "mt-12" : "mt-5"}`}>
            <Link href="/">
              <div data-hide-on-theme="dark">
                <Image
                  src="/assets/logo_light.png"
                  alt="MowinBet Logo"
                  width={238}
                  height={39.29}
                  className="w-[190px] h-[55px]"
                />
              </div>

              <div data-hide-on-theme="light">
                <Image
                  src="/assets/logo_dark.png"
                  alt="MowinBet Logo"
                  width={238}
                  height={39.29}
                  className="w-[190px] h-[55px]"
                />
              </div>
            </Link>
          </div>

          <div className="flex flex-col space-y-5">
            {SIDENAV_ITEMS.map((item, idx) => {
              return <MenuItem key={idx} item={item} />;
            })}
          </div>
        </div>
        <div className="flex flex-col items-center justify-end space-y-4 mb-4">
        <div className="flex flex-col justify-center">
          <Image
            src="/assets/ic_payment_mpesa.png"
            alt="Payment MPESA"
            width={80}
            height={30}
            className="xl:w-[100px] xl:h-40px] mb-3"
          />
          <Image
            src="/assets/ic_payment_airtel.png"
            alt="Payment airtel"
            width={80}
            height={30}
            className="xl:w-[100px] xl:h-40px]"
          />
        </div>

        <div className="flex items-center gap-4 sm:mt-6">
          <div className="items-center p-[10px] rounded-full h-fit bg-cardColor">
            {/* When the theme is dark, hide this div */}
            <div data-hide-on-theme="dark">
              <Image
                src="/assets/ic_instagram_light.png"
                alt="instagram_icon"
                width={100}
                height={100}
                className="w-4 h-4 lg:w-5 lg:h-5 xl:w-7 xl:h-7"
              />
            </div>

            {/* When the theme is light, hide this div */}
            <div data-hide-on-theme="light">
              <Image
                src="/assets/ic_instagram_dark.png"
                alt="instagram_icon"
                width={100}
                height={100}
                className="w-4 h-4 lg:w-5 lg:h-5 xl:w-7 xl:h-7"
              />
            </div>
          </div>
          <div className="items-center px-2 py-2 rounded-full h-fit bg-cardColor">
            {/* When the theme is dark, hide this div */}
            <div data-hide-on-theme="dark">
              <Image
                src="/assets/ic_tiktok_light.png"
                alt="tiktok_icon"
                width={100}
                height={100}
                className="w-4 h-4 lg:w-5 lg:h-5 xl:w-7 xl:h-7"
              />
            </div>

            {/* When the theme is light, hide this div */}
            <div data-hide-on-theme="light">
              <Image
                src="/assets/ic_tiktok_dark.png"
                alt="tiktok_icon"
                width={100}
                height={100}
                className="w-4 h-4 lg:w-5 lg:h-5 xl:w-7 xl:h-7"
              />
            </div>
          </div>
          <div className="items-center px-2 py-2 rounded-full h-fit bg-cardColor">
            {/* When the theme is dark, hide this div */}
            <div data-hide-on-theme="dark">
              <Image
                src="/assets/ic_twitter_light.png"
                alt="twitter_icon"
                width={100}
                height={100}
                className="w-4 h-4 lg:w-5 lg:h-5 xl:w-7 xl:h-7"
              />
            </div>

            {/* When the theme is light, hide this div */}
            <div data-hide-on-theme="light">
              <Image
                src="/assets/ic_twitter_dark.png"
                alt="twitter_icon"
                width={100}
                height={100}
                className="w-4 h-4 lg:w-5 lg:h-5 xl:w-7 xl:h-7"
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    
    </div>
  );
};

export default Sidebar;

const MenuItem = ({ item }: { item: SideNavItem }) => {
  const { theme = "light" } = useTheme();
  const [themeMode, setThemeMode] = useState("light");
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(true);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  useEffect(() => {
    setThemeMode(theme);
  }, [theme]);

  return (
    <div className="">
      {item.submenu ? (
        <>
          <button
            onClick={toggleSubMenu}
            className={`flex flex-row items-center py-2 px-6 rounded-lg w-full justify-between ${
              subMenuOpen ? "mb-2" : ""
            }`}
          >
            <div className="flex flex-row space-x-4 items-center">
              {item.icon}
              <span className="font-semibold text-base flex">{item.title}</span>
            </div>

            <div className={`${subMenuOpen ? "rotate-180" : ""} flex`}>
              <ChevronUp width={24} height={24} />
            </div>
          </button>

          {subMenuOpen && (
            <div className="flex flex-col space-y-4 items-start">
              {item.subMenuItems?.map((subItem, idx) => {
                return (
                  <div
                    key={idx}
                    className={`${
                      item.path + subItem.path === pathname
                        ? "px-4 w-full"
                        : "px-4 w-full"
                    }`}
                  >
                    <Link href={item.path + subItem.path}>
                      <div
                        className={`flex flex-row space-x-4 items-center ${
                          item.path + subItem.path === pathname
                            ? `opacity-100 py-4 px-3 rounded-md ${
                                themeMode === "light"
                                  ? "bg-[#e1e1e1]"
                                  : "bg-[#282626]"
                              }`
                            : `opacity-70 py-4 px-3 hover:rounded-md ${
                                themeMode === "light"
                                  ? "hover:bg-[#e1e1e1]"
                                  : "hover:bg-[#282626]"
                              }`
                        }`}
                      >
                        {subItem.icon}
                        <span className="font-normal text-sm">
                          {subItem.title}
                        </span>
                      </div>
                    </Link>
                    <div
                      className={`${
                        item.path + subItem.path === pathname ? "" : ""
                      }`}
                    ></div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-row items-center py-2 px-6 w-full justify-between hover:opacity-40">
          <Link
            href={item.path}
            className={`flex flex-row space-x-4 items-center w-full ${
              item.path === pathname
                ? "border-b-[3px] border-b-mainColor pb-3 w-1/2"
                : ""
            } `}
          >
            {item.icon}
            <span className="font-light text-base flex">{item.title}</span>
          </Link>
        </div>
      )}
    </div>
  );
};
