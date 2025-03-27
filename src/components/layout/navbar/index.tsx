"use client";

import React, { useEffect, useState } from "react";
import { LogOut, Tally3, UserRound, Ticket } from "lucide-react";
import Image from "next/image";
import Profile from "./profile/Profile";
import { useTheme } from "next-themes";
import ProfileItem from "./profile/ProfileItem";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RootState } from "@/store";
import { connect } from "react-redux";
import { AuthData, ProductCategory } from "@/domain/dto/output";
import { FC } from "react";
import ButtonAuth from "../../auth/ButtonAuth";
import {
  AppBar,
  Box,
  CircularProgress,
  IconButton,
  Toolbar,
} from "@mui/material";
import { generateSlug, hideMiddleCharacters } from "@/utilities";
import { UserProfile } from "@/domain/profile";
import { getToken, AUTH_TOKEN_KEY } from "@/utilities/auth.cookie";
import Cookies from "js-cookie";
import { ModalID } from "@/domain/components";
import { SwitchToHostPayload } from "@/domain/dto/input";
import NavLinkDropDownItem from "../../shared/navLinkDropdown";
import Button from "../../shared/button";

type NavbarProps = {
  openNav: boolean;
  onOpenSideNav: () => void;
  isMobile: boolean;
  sigOut: () => void;
  isLoggedIn: boolean;
  authData: AuthData;
  emailPassowrdLoginRequestProcessing: boolean;
  googleLoginRequestProcessing: boolean;
  switchToHostRequestProcessing: boolean;
  signOutRequestProcessing: boolean;
  getUserProfile: () => void;
  profile: UserProfile;
  showBalance: boolean;
  toggleBalanceVisibility: (showBalance: boolean) => void;
  setActiveModal: (modalId: ModalID) => void;
  switchToHost: (payload: SwitchToHostPayload) => void;
  productCategories: Array<ProductCategory>;
  modalId: ModalID;
  setShouldRedirectToHostView: (shouldRedirectToHostView: boolean) => void;
};

const Navbar: FC<NavbarProps> = ({
  openNav,
  onOpenSideNav,
  isMobile,
  isLoggedIn,
  sigOut,
  authData,
  profile,
  setActiveModal,
  switchToHost,
  productCategories,
  emailPassowrdLoginRequestProcessing,
  googleLoginRequestProcessing,
  switchToHostRequestProcessing,
  signOutRequestProcessing,
  modalId,
  setShouldRedirectToHostView,
}) => {
  const { theme = "light", setTheme } = useTheme();
  const [openProfile, setOpenProfile] = useState(false);
  const [themeMode, setThemeMode] = useState("light");
  const pathname = usePathname();
  const router = useRouter();
  const [authToken, setAuthToken] = useState<string | null>(getToken());

  const handleCloseLink = () => {
    setOpenProfile(false);
  };

  useEffect(() => {
    setThemeMode(theme);
  }, [theme]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentToken = Cookies.get(AUTH_TOKEN_KEY);
      if (currentToken !== authToken) {
        setAuthToken(currentToken as string);
      }
    }, 500);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken]);

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: "#FFF", marginBottom: 2 }}>
      <AppBar
        position="fixed"
        sx={{ backgroundColor: "#FFF", boxShadow: "none", zIndex: 10 }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
          className="flex justify-between items-center py-2
          px-4 sm:px-7"
        >
          <div className="flex justify-between items-center">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ color: "#000" }}
            >
              <div
                className={`flex flex-col xl:hidden justify-center items-center rounded-full flex-shrink-0 cursor-pointer`}
                onClick={() => onOpenSideNav()}
              >
                <div className="rotate-90">
                  <Tally3 className="w-[30px] h-[30px]" />
                </div>
              </div>
            </IconButton>
            <Link href="/" className="">
              <div className="sm:flex xs:flex lg:hidden md:hidden xl:hidden ">
                <Image
                  src="/assets/logo.svg"
                  alt="Fullbooker Logo"
                  width={110}
                  height={45}
                />
              </div>
              <div className="hidden xl:flex md:flex lg:flex">
                <Image
                  src="/assets/logo.svg"
                  alt="Fullbooker Logo"
                  width={190}
                  height={35}
                />
              </div>
            </Link>
          </div>
          <div className="hidden items-center lg:flex">
            <ul className="flex justify-between">
              {productCategories &&
                productCategories?.map(
                  (category: ProductCategory, index: number) => (
                    <li key={index}>
                      <div className="relative inline-block text-left">
                        <NavLinkDropDownItem
                          label={category?.name}
                          href={`/products/${generateSlug(category?.name)}_${
                            category?.id
                          }`}
                          level="category"
                        ></NavLinkDropDownItem>
                      </div>
                    </li>
                  )
                )}
            </ul>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1">
              <div className="flex md:flex gap-2">
                <Button
                  padding={`${
                    authToken
                      ? "py-2 px-4 md:py-2 md:px-4"
                      : "py-2 px-3 md:py-2 md:px-4"
                  }`}
                  borderRadius="rounded"
                  text="text-sm"
                  isSecondary={true}
                  onClick={() => {
                    if (isLoggedIn) {
                      switchToHost({
                        user: authData?.user?.id,
                      } as SwitchToHostPayload);
                    } else {
                      setShouldRedirectToHostView(true);
                      setActiveModal(ModalID.login);
                    }
                  }}
                >
                  {switchToHostRequestProcessing ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : authToken ? (
                    `${isMobile ? "Hosting" : "Switch to hosting"}`
                  ) : (
                    "Become a Host"
                  )}
                </Button>
                {!authToken && (
                  <Button
                    bg="bg-primary"
                    padding="py-2 px-3 md:py-2 md:px-10"
                    borderRadius="rounded"
                    text="text-xs md:text-sm text-white"
                    onClick={() => setActiveModal(ModalID.login)}
                    extraClasses="hidden md:flex"
                  >
                    {(googleLoginRequestProcessing ||
                      emailPassowrdLoginRequestProcessing) &&
                    modalId === ModalID.none ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                )}
              </div>
              {/* Profile & Dropdown */}
              {authToken && (
                <Profile
                  button={
                    <div className="hidden md:flex justify-center content-center items-center cursor-pointer ml-2">
                      <Image
                        src={`${
                          profile?.image ||
                          "/assets/default-profile-picture-placeholder.jpg"
                        } `}
                        alt={"Profile Image"}
                        width={isMobile ? 35 : 35}
                        height={isMobile ? 35 : 35}
                        className="rounded-full object-cover"
                        unoptimized={true}
                      />
                    </div>
                  }
                  openState={openProfile}
                  setOpenState={setOpenProfile}
                  classNames={
                    "py-2 top-[44px] -left-[140px] sm:top-[48px] sm:-left-[172px] md:top-[50px] md:-left-[180px] lg:top-[54px] lg:-left-[180px] xl:top-[56px] xl:-left-[180px] w-max"
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
                            {profile?.phone_number && (
                              <span className="text-[13px] sm:text-base lg:text-lg text-black">
                                {`${hideMiddleCharacters(
                                  profile?.phone_number
                                )}`}
                              </span>
                            )}
                            <span
                              className={`text-[11px] sm:text-sm ${
                                themeMode === "light"
                                  ? "text-black"
                                  : "text-white"
                              }`}
                            >
                              {profile?.first_name
                                ? `${profile?.first_name} ${profile?.last_name}`
                                : ""}
                            </span>
                          </div>
                        </>
                      )}
                      <div className="w-full flex flex-col gap-2 sm:gap-3">
                        <ProfileItem
                          theme={themeMode}
                          icon={
                            <UserRound className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                          }
                          text="My Profile"
                          href={
                            authToken
                              ? "/profile"
                              : `/login?redirect=${pathname?.slice(1)}`
                          }
                          onItemClick={handleCloseLink}
                        />
                        <ProfileItem
                          theme={themeMode}
                          icon={
                            <Ticket className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                          }
                          text="My Tickets"
                          href={
                            authToken
                              ? "/tickets"
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
                            <span className="text-white text-[10px] sm:text-xs font-medium">
                              {signOutRequestProcessing ? (
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
                                router.push(
                                  `/login?redirect=${pathname?.slice(1)}`
                                )
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
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

const mapStateToProps = (state: RootState) => {
  const googleLoginRequestProcessing =
    state.loading.effects.authentication.googleSocialSignin;
  const emailPassowrdLoginRequestProcessing =
    state.loading.effects.authentication.signIn;
  const switchToHostRequestProcessing =
    state.loading.effects.authentication.switchToHost;
  const signOutRequestProcessing = state.loading.effects.authentication.signOut;
  const { profile } = state.profile;
  const { isLoggedIn, authData } = state.authentication;
  const { productCategories } = state.settings;
  const { modalId } = state.components;
  return {
    isLoggedIn,
    authData,
    profile,
    productCategories,
    googleLoginRequestProcessing,
    switchToHostRequestProcessing,
    emailPassowrdLoginRequestProcessing,
    signOutRequestProcessing,
    modalId,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  sigOut: () => dispatch.authentication.signOut(),
  getUserProfile: () => dispatch.profile.getUserProfile(),
  toggleBalanceVisibility: (showBalance: boolean) =>
    dispatch.profile.toggleBalanceVisibility(showBalance),
  setActiveModal: (modalId: ModalID) =>
    dispatch.components.setActiveModal(modalId),
  switchToHost: (payload: SwitchToHostPayload) =>
    dispatch.authentication.switchToHost(payload),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
