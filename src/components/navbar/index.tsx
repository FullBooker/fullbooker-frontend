"use client";

import React, { useEffect, useState } from "react";
import { SearchInput } from "./components/SearchInput";
import {
  ArrowRightLeft,
  Banknote,
  BellDot,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  HandCoins,
  History,
  LogOut,
  Moon,
  Plus,
  SunMedium,
  Tally3,
  UserRound,
  UserX,
  Wallet,
  X,
  LogIn,
  UserPlus,
  EyeOff,
  EyeIcon,
  GiftIcon,
} from "lucide-react";
import Image from "next/image";
import Profile from "./profile/Profile";
import { useTheme } from "next-themes";
import ProfileItem from "./profile/ProfileItem";
import Notification from "./notification/Notification";
import NotificationItem from "./notification/NotificationItem";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RootState } from "@/store";
import { connect } from "react-redux";
import { AuthData } from "@/domain/dto/output";
import { FC } from "react";
import ButtonAuth from "../auth/ButtonAuth";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import {
  addCommaSeparators,
  getInitials,
  hideMiddleCharacters,
} from "@/utilities";
import { UserProfile } from "@/domain/profile";
import CustomAvatar from "./components/customAvatar";
import BottomNavBar from "../bottomNavbar";
import { getToken, TOKEN_KEY } from "@/utilities/auth.cookie";
import Cookies from "js-cookie";
import { ModalID } from "@/domain/components";

type NavbarProps = {
  openNav: boolean;
  onOpenSideNav: () => void;
  isMobile: boolean;
  sigOut: () => void;
  isLoggedIn: boolean;
  authData: AuthData;
  loading: boolean;
  getUserProfile: () => void;
  profile: UserProfile;
  showBalance: boolean;
  toggleBalanceVisibility: (showBalance: boolean) => void;
  setActiveModal: (modalId: ModalID) => void;
};

const Navbar: FC<NavbarProps> = ({
  openNav,
  onOpenSideNav,
  isMobile,
  isLoggedIn,
  sigOut,
  authData,
  loading,
  profile,
  getUserProfile,
  showBalance,
  toggleBalanceVisibility,
  setActiveModal,
}) => {
  const { theme = "light", setTheme } = useTheme();
  const [openProfile, setOpenProfile] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [themeMode, setThemeMode] = useState("light");
  const today = new Date();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authToken, setAuthToken] = useState<string | null>(getToken());

  const titles = [
    {
      title: (
        <span className="text-[12px] sm:text-xs md:text-sm">
          Deposit <span className="font-bold text-mainColor">KSH 100</span>{" "}
          Successful
        </span>
      ),
      icon: (
        <HandCoins className="w-4 h-4 sm:w-5 sm:h-5 xl:w-5 xl:h-5 text-mainColor" />
      ),
      href: "/transaction-history",
      info: "Deposit",
      date: new Date(),
    },
    {
      title: (
        <span className="text-[12px] sm:text-xs md:text-sm">
          Deposit <span className="font-bold text-mainColor">Aviatrix</span>{" "}
          Successful
        </span>
      ),
      icon: (
        <HandCoins className="w-4 h-4 sm:w-5 sm:h-5 xl:w-5 xl:h-5 text-mainColor" />
      ),
      href: "/transaction-history",
      info: "Deposit",
      date: new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 12
      ),
    },
    {
      title: (
        <span className="text-[12px] sm:text-xs md:text-sm">
          Deposit <span className="font-bold text-mainColor">F777 Fighter</span>{" "}
          Successful
        </span>
      ),
      icon: (
        <HandCoins className="w-4 h-4 sm:w-5 sm:h-5 xl:w-5 xl:h-5 text-mainColor" />
      ),
      href: "/transaction-history",
      info: "Deposit",
      date: new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 25
      ),
    },
    {
      title: (
        <span className="text-[12px] sm:text-xs md:text-sm">
          Deposit{" "}
          <span className="font-bold text-mainColor">Cricket Crash</span>{" "}
          Successful
        </span>
      ),
      icon: (
        <HandCoins className="w-4 h-4 sm:w-5 sm:h-5 xl:w-5 xl:h-5 text-mainColor" />
      ),
      href: "/transaction-history",
      info: "Deposit",
      date: new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 30
      ),
    },
    {
      title: (
        <span className="text-[12px] sm:text-xs md:text-sm">
          Deposit <span className="font-bold text-mainColor">Limbo Cat</span>{" "}
          Successful
        </span>
      ),
      icon: (
        <HandCoins className="w-4 h-4 sm:w-5 sm:h-5 xl:w-5 xl:h-5 text-mainColor" />
      ),
      href: "/transaction-history",
      info: "Deposit",
      date: new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 39
      ),
    },
  ];

  const handleCloseLink = () => {
    setOpenProfile(false);
  };

  useEffect(() => {
    setThemeMode(theme);
  }, [theme]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentToken = Cookies.get(TOKEN_KEY);
      if (currentToken !== authToken) {
        setAuthToken(currentToken as string);
      }
    }, 500);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken]);

  useEffect(() => {
    if (authToken) {
      getUserProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   if (isMobile) {
  //     const newSearchParams = new URLSearchParams(searchParams.toString());
  //     const dataValue = searchParams.get("data");

  //     dataValue === "true"
  //       ? newSearchParams.delete("data")
  //       : newSearchParams.set("data", "true");

  //     // Update the URL using the useNavigation hook
  //     router.push(`${pathname}?${newSearchParams.toString()}`);
  //   }
  // }, []);

  return (
    <div
      className={`sticky top-0 z-40 bg-background ${
        openNav && isMobile && themeMode === "dark"
          ? "bg-black opacity-30 z-40"
          : openNav && isMobile && themeMode === "light"
          ? "blur-sm bg-white opacity-30 z-40"
          : "bg-background"
      }`}
    >
      <div
        className={`flex gap-1 sm:gap-2 justify-between items-center py-4 ${
          pathname === "/" || pathname.startsWith("/promotions/detail/")
            ? "px-4 sm:px-7"
            : ""
        }`}
      >
        <div className="">
        <Link href="/" className="">
            <div data-hide-on-theme="dark">
              <Image
                src="/assets/logo.svg"
                alt="Fullbooker Logo"
                // layout="fill"
                // objectFit="contain"
                width={238}
                height={39.29}
                // className="w-[190px] h-[55px]"
                // style={{
                //   width: "100px",
                //   height: "100px",
                //   clipPath: "inset(0 50px 0 0)"
                // }}
              />
            </div>

            <div data-hide-on-theme="light">
              <Image
               src="/assets/logo.svg"
                alt="Fullbooker Logo"
                // layout="fill"
                // objectFit="contain"
                width={238}
                height={39.29}
                // className="w-[190px] h-[55px]"
                // style={{
                //   width: "100px",
                //   height: "100px",
                //   clipPath: "inset(0 200px 0 0)"
                // }}
              />
            </div>
          </Link>
          <div
            className={`flex flex-col xl:hidden px-[10px] py-[12px] md:px-3 md:py-[14px] sm:me-3 justify-center items-center ${
              themeMode === "light"
                ? "border-[1px] border-strokeColor2"
                : "border border-inputBorderColor"
            } rounded-full flex-shrink-0 cursor-pointer`}
            onClick={onOpenSideNav}
          >
            <div className="rotate-90 -mb-1">
              <Tally3 className="w-4 h-4 sm:w-5 sm:h-5 xl:w-5 xl:h-5" />
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <ul className="flex justify-between">
            <li>
              <Link href="/main-menu/promotions" className="flex md:flex items-center text-xs md:text-sm lg:text-sm h-fit px-3 py-2 md:px-4 md:py-3 lg:px-5 lg:py-[10px] gap-2 rounded-sm  font-medium transition-opacity duration-300 hover:opacity-4 text-black">
              Activities  
              </Link>
            </li>
            <li>
              <Link href="/main-menu/promotions" className="flex md:flex items-center text-xs md:text-sm lg:text-sm h-fit px-3 py-2 md:px-4 md:py-3 lg:px-5 lg:py-[10px] gap-2 rounded-sm font-medium transition-opacity duration-300 hover:opacity-4 text-black">
              Events  
              </Link>
            </li>
            <li>
              <Link href="/main-menu/promotions" className="flex md:flex items-center text-xs md:text-sm lg:text-sm h-fit px-3 py-2 md:px-4 md:py-3 lg:px-5 lg:py-[10px] gap-2 rounded-sm font-medium transition-opacity duration-300 hover:opacity-4 text-black">
              Experiences  
              </Link>
            </li>
            <li>
              <Link href="/main-menu/promotions" className="flex md:flex items-center text-xs md:text-sm lg:text-sm h-fit px-3 py-2 md:px-4 md:py-3 lg:px-5 lg:py-[10px] gap-2 rounded-sm font-medium transition-opacity duration-300 hover:opacity-4 text-black">
              Workshops  
              </Link>
            </li>
            <li>
              <Link href="/main-menu/promotions" className="flex md:flex items-center text-xs md:text-sm lg:text-sm h-fit px-3 py-2 md:px-4 md:py-3 lg:px-5 lg:py-[10px] gap-2 rounded-sm font-medium transition-opacity duration-300 hover:opacity-4 text-black">
              Coorprate Clubs  
              </Link>
            </li>
          </ul>
          </div>
        <div className="flex items-center gap-1">
          {!authToken && (
            <div className="flex md:flex gap-2">
              {/* <button
                onClick={() => setActiveModal(ModalID.register)}
                className="flex md:flex items-center text-xs md:text-sm lg:text-sm h-fit px-3 py-2 md:px-4 md:py-3 lg:px-5 lg:py-[10px] rounded-lg bg-gradient-to-bl from-mainColor via-redMediumColor to-redDarkColor text-whiteColor font-medium"
              >
                Become a Host
                <UserPlus className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
              </button> */}
              <button
                onClick={() => setActiveModal(ModalID.login)}
                className="flex md:flex items-center text-xs md:text-sm lg:text-sm h-fit px-3 py-2 md:px-4 md:py-3 lg:px-5 lg:py-[10px] rounded-lg bg-gradient-to-bl from-mainColor via-redMediumColor to-redDarkColor text-whiteColor font-medium me-3"
              >
                Sign In
                {/* <LogIn className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" /> */}
              </button>
            </div>
          )}
          {/* Profile & Dropdown */}
          {authToken && (
            <Profile
              button={
                <div className="flex gap-1 lg:gap-3 justify-center content-center items-center cursor-pointer me-1 sm:me-1 xl:me-2">
                  <div className="w-[37px] h-[37px] sm:w-10 sm:h-10 md:w-11 md:h-11 xl:w-11 xl:h-11 lg:w-10 lg:h-10 ">
                    <CustomAvatar
                      name={getInitials(
                        `${authData?.user?.first_name} ${authData?.user?.last_name}`
                      )}
                    />
                  </div>
                  <div className="hidden md:block h-fit">
                    <ChevronDown
                      className={`${
                        !openProfile ? "block" : "hidden"
                      } w-5 h-fit lg:w-6 lg:h-6 xl:w-7 xl:h-7`}
                    />
                    {openProfile && (
                      <ChevronUp className="w-5 h-fit lg:w-6 lg:h-6 xl:w-7 xl:h-7" />
                    )}
                  </div>
                </div>
              }
              openState={openProfile}
              setOpenState={setOpenProfile}
              classNames={
                "py-2 top-[44px] -left-[140px] sm:top-[48px] sm:-left-[172px] md:top-[50px] md:-left-[140px] lg:top-[54px] lg:-left-[130px] xl:top-[56px] xl:-left-[105px] w-max"
              }
            >
              <div
                className={`flex h-full w-full flex-col justify-start rounded-[15px] sm:rounded-[20px] bg-cardColor bg-no-repeat ${
                  themeMode === "light"
                    ? "shadow-card-auth-shadow border-[1px] border-strokeColor2"
                    : "border-[1px] border-inputBorderColor"
                }`}
              >
                <div className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-4 lg:p-5 items-center">
                  {authToken && (
                    <>
                      <div className="flex flex-col gap-[1px] sm:gap-1 items-center">
                        {authData?.user?.phone_number && (
                          <span className="text-[13px] sm:text-base lg:text-lg">
                            {`${hideMiddleCharacters(authData?.user?.phone_number)}`}
                          </span>
                        )}
                        <span
                          className={`text-[11px] sm:text-sm ${
                            themeMode === "light"
                              ? "text-textColor2"
                              : "text-textColor"
                          }`}
                        >
                          {authData?.user?.first_name
                            ? `${authData?.user?.first_name} ${authData?.user?.last_name}`
                            : ""}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="w-full flex flex-col gap-2 sm:gap-3">
                    <ProfileItem
                      theme={themeMode}
                      icon={<UserRound className="w-4 h-4 sm:w-5 sm:h-5" />}
                      text="View My Profile"
                      href={
                        authToken
                          ? "/profile"
                          : `/login?redirect=${pathname?.slice(1)}`
                      }
                      onItemClick={handleCloseLink}
                    />
                    
                  </div>
                  <div className="-mt-1 -mb-1 h-[1.5px] w-full bg-gray-200 dark:bg-white/20 " />
                  <div className="flex flex-col gap-3 w-full hover:opacity-40">
                    {authToken ? (
                      <button
                        className={`w-full flex items-center justify-between gap-2 py-[10px] px-[8px] sm:py-[14px] sm:px-[12px] rounded-[10px] sm:rounded-[15px] ${
                          themeMode === "light"
                            ? ""
                            : "border-[1.5px] border-inputBorderColor"
                        } bg-gradient-to-br from-[#121211] to-[#21211F] hover:bg-gradient-to-bl`}
                        onClick={() => sigOut()}
                      >
                        <span className="text-whiteColor text-[10px] sm:text-xs font-medium">
                          {loading ? (
                            <CircularProgress size={18} color="inherit" />
                          ) : (
                            "Logout"
                          )}
                        </span>
                        <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-whiteColor" />
                      </button>
                    ) : (
                      <>
                        <ButtonAuth
                          type="submit"
                          onClick={() =>
                            router.push(`/login?redirect=${pathname?.slice(1)}`)
                          }
                        >
                          Login
                        </ButtonAuth>
                        <ButtonAuth
                          type="submit"
                          onClick={() =>
                            router.push(
                              `/register?redirect=${pathname?.slice(1)}`
                            )
                          }
                        >
                          Sign Up
                        </ButtonAuth>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Profile>
          )}
          {/* <div
            className={`flex items-center px-[10px] py-[10px] md:px-3 md:py-3 ${
              themeMode === "light"
                ? "border-[1px] border-strokeColor2"
                : "border border-inputBorderColor"
            } rounded-full flex-shrink-0 cursor-pointer transition-opacity duration-300 hover:opacity-50`}
            onClick={() => {
              setTheme(`${theme === "light" ? "dark" : "light"}`);
            }}
          >
            {themeMode === "light" ? (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 xl:w-5 xl:h-5" />
            ) : (
              <SunMedium className="w-4 h-4 sm:w-5 sm:h-5 xl:w-5 xl:h-5" />
            )}
          </div> */}
        </div>
      </div>
      {!pathname.startsWith("/crash-game/detail/") && <BottomNavBar />}
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const loading = state.loading.models.authentication;
  const { profile, showBalance } = state.profile;
  const { isLoggedIn, authData } = state.authentication;
  return { isLoggedIn, authData, loading, profile, showBalance };
};

const mapDispatchToProps = (dispatch: any) => ({
  sigOut: () => dispatch.authentication.signOut(),
  getUserProfile: () => dispatch.profile.getUserProfile(),
  toggleBalanceVisibility: (showBalance: boolean) =>
    dispatch.profile.toggleBalanceVisibility(showBalance),
  setActiveModal: (modalId: ModalID) => dispatch.components.setActiveModal(modalId)
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
