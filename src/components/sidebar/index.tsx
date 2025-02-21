"use client";

import { useTheme } from "next-themes";
import React from "react";
import { SIDENAV_ITEMS } from "@/constants";
import { SideNavItem } from "@/types";
import { ChevronUp, LogOut, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LogoutButton from "./components/LogoutButton";
import CircularProgress from "@mui/material/CircularProgress";

const Sidebar = ({
  theme,
  open,
  onClose,
  isMobile,
  signOut,
}: {
  theme: string | undefined;
  open: boolean;
  onClose: React.MouseEventHandler<HTMLSpanElement>;
  isMobile: boolean;
  signOut: () => void;
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
                  src="/assets/logo.svg"
                  alt="Fullbooker Logo"
                  width={238}
                  height={39.29}
                  className="w-[190px] h-[55px]"
                />
              </div>

              <div data-hide-on-theme="light">
                <Image
                  src="/assets/logo_dark.png"
                  alt="Fullbooker Logo"
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
          <div className="flex flex-row items-center py-2 px-6 w-full justify-between hover:opacity-40">
            <button
              className={`w-full flex items-center justify-start gap-2 py-[18px] rounded-[10px] sm:rounded-[15px hover:bg-gradient-to-bl`}
              onClick={() => {
                signOut();
              }}
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-black me-3" />
              <span className="text-black font-medium">Logout</span>
            </button>
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
