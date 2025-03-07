"use client";

import React, { FC } from "react";
import { useTheme } from "next-themes";
import { SideNavItem } from "@/types";
import {
  ArrowRightLeft,
  BadgeDollarSign,
  ChevronDown,
  ChevronUp,
  Crosshair,
  Home,
  LayoutGrid,
  LogOut,
  MoreHorizontal,
  MoreVertical,
  Receipt,
  Settings,
  UserRound,
  Wallet,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { RootState } from "@/store";
import { AuthData } from "@/domain/dto/output";
import { CircularProgress } from "@mui/material";
import CustomAvatar from "@/components/layout/navbar/components/customAvatar";
import { getInitials, hideMiddleCharacters } from "@/utilities";
import Profile from "@/components/layout/navbar/profile/Profile";
import ProfileItem from "@/components/layout/navbar/profile/ProfileItem";
import Drawer from "@mui/material/Drawer";

const drawerWidth = 300;

const SIDENAV_ITEMS: SideNavItem[] = [
  // {
  //   title: "Overview",
  //   path: "/vendor",
  //   icon: <LayoutGrid width={22} height={22} />,
  // },
  {
    title: "Products",
    path: "/vendor/products",
    icon: <Wallet width={22} height={22} />,
    submenu: false,
  },
  // {
  //   title: "Sales",
  //   path: "/vendor/sales",
  //   icon: <ArrowRightLeft width={22} height={22} />,
  //   submenu: false,
  // },
  // {
  //   title: "Bills",
  //   path: "/vendor/bills",
  //   icon: <Receipt width={22} height={22} />,
  //   submenu: false,
  // },
  // {
  //   title: "Expenses",
  //   path: "/vendor/expenses",
  //   icon: <BadgeDollarSign width={22} height={22} />,
  //   submenu: false,
  // },
  // {
  //   title: "Goals",
  //   path: "/vendor/goals",
  //   icon: <Crosshair width={22} height={22} />,
  //   submenu: false,
  // },
  // {
  //   title: "Settings",
  //   path: "/vendor/settings",
  //   icon: <Settings width={22} height={22} />,
  //   submenu: false,
  // },
];

type SidebarProps = {
  theme: string | undefined;
  open: boolean;
  onClose: React.MouseEventHandler<HTMLSpanElement>;
  isMobile: boolean;
  signOut: () => void;
  authData: AuthData;
  loading: boolean;
};

const Sidebar: FC<SidebarProps> = ({
  theme,
  open,
  onClose,
  isMobile,
  signOut,
  authData,
  loading,
}) => {
  const [openProfile, setOpenProfile] = useState(false);
  const router = useRouter();
  const [themeMode, setThemeMode] = useState("light");
  const handleCloseLink = () => {
    setOpenProfile(false);
  };
  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#191919",
        },
      }}
      anchor="left"
    >
      <div className={`flex flex-col justify-between h-[100vh]`}>
        <div className="flex-grow">
          <div
            className={`mx-6 mb-5 ${
              isMobile ? "mt-5" : "mt-5"
            } flex justify-between items-center`}
          >
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
            <span className="cursor-pointer lg:hidden xl:hidden" onClick={onClose}>
              <X className="w-6 h-6 sm:w-6 sm:h-6 xl:w-6 6xl:h-6 text-white" />
            </span>
          </div>

          <div className="flex flex-col space-y-5">
            {SIDENAV_ITEMS.map((item, idx) => {
              return <MenuItem key={idx} item={item} />;
            })}
          </div>
        </div>
        <div className="flex flex-col flex-grow items-center justify-end space-y-4 mb-4 mx-6">
          <button
            className={`w-full flex items-center justify-start gap-2 py-[18px] px-[15px] rounded-[10px] sm:rounded-[15px] bg-gray-950 hover:bg-gradient-to-bl`}
            onClick={() => signOut()}
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-whiteColor" />
            <span className="text-whiteColor text-[14px] font-medium">
              {loading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                "Logout"
              )}
            </span>
          </button>
        </div>
        <div className="hidden md:flex flex-col items-center justify-end space-y-4 mb-10 mx-6 mt-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="me-2">
                <Profile
                  button={
                    <div className="w-[37px] h-[37px] sm:w-10 sm:h-10 md:w-11 md:h-11 xl:w-11 xl:h-11 lg:w-10 lg:h-10 ">
                      <CustomAvatar
                        name={getInitials(
                          `${authData?.user?.first_name} ${authData?.user?.last_name}`
                        )}
                      />
                    </div>
                  }
                  openState={openProfile}
                  setOpenState={setOpenProfile}
                  classNames={
                    "py-2 top-[44px] -left-[140px] sm:top-[48px] sm:-left-[172px] md:top-[50px] md:-left-[140px] lg:top-[54px] lg:-left-[130px] xl:top-[56px] xl:-left-[105px] w-max"
                  }
                >
                  <></>
                </Profile>
              </div>
              <div className="me-12">
                <div className="text-white cursor-pointer text-sm">
                  {`${authData?.user?.first_name} ${authData?.user?.last_name}`}
                </div>
                <div
                  className="text-white cursor-pointer font-thin text-sm"
                  onClick={() => router.push("/profile")}
                >
                  View profile
                </div>
              </div>
            </div>
            <div>
              <MoreVertical className="w-5 h-fit lg:w-6 lg:h-6 xl:w-7 xl:h-7 text-white" />
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

const mapStateToProps = (state: RootState) => {
  const loading = state.loading.models.authentication;
  const { authData } = state.authentication;
  return { authData, loading };
};

const mapDispatchToProps = (dispatch: any) => ({
  signOut: () => dispatch.authentication.signOut(),
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);

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
            } text-white`}
          >
            <div className="flex flex-row space-x-4 items-center">
              {item.icon}
              <span className="font-semibold text-base flex text-white">
                {item.title}
              </span>
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
                        <span className="font-normal text-sm text-white">
                          {subItem.title}
                        </span>
                      </div>
                    </Link>
                    <div
                      className={`${
                        item.path + subItem.path === pathname ? "" : ""
                      } text-white`}
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
            className={`flex flex-row space-x-4 items-center w-full text-white px-3 ${
              item.path === pathname
                ? "bg-mainColor pt-3 rounded-sm pb-3 w-1/2"
                : ""
            } `}
          >
            {item.icon}
            <span className="font-light text-base flex text-white">
              {item.title}
            </span>
          </Link>
        </div>
      )}
    </div>
  );
};
