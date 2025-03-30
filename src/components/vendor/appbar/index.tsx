"use client";

import React, { FC, useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import {
  Grid,
  Home,
  LogOut,
  ShoppingBag,
  Tally3,
  Ticket,
  UserRound,
  X,
} from "lucide-react";
import { RootState } from "@/store";
import { connect } from "react-redux";
import { ModalID } from "@/domain/components";
import { SwitchToHostPayload } from "@/domain/dto/input";
import { AuthData } from "@/domain/dto/output";
import { UserProfile } from "@/domain/profile";
import { getToken, AUTH_TOKEN_KEY } from "@/utilities/auth.cookie";
import Cookies from "js-cookie";
import Profile from "@/components/vendor/profile/Profile";
import CustomAvatar from "@/components/layout/navbar/components/customAvatar";
import { getInitials, hideMiddleCharacters } from "@/utilities";
import { useTheme } from "next-themes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProfileItem from "@/components/vendor/profile/ProfileItem";
import { CircularProgress } from "@mui/material";
import ButtonAuth from "@/components/auth/ButtonAuth";
import Image from "next/image";
import Link from "next/link";

type VendorAppBarProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
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
  switchToHost: (payload: SwitchToHostPayload) => void;
};

const VendorAppBar: FC<VendorAppBarProps> = ({
  open,
  setOpen,
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
  switchToHost,
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

  const handleCloseLink = () => {
    setOpenProfile(false);
  };

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: "#FFF", marginBottom: 2 }}>
      <AppBar position="fixed" sx={{ backgroundColor: "#FFF" }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div className="flex justify-between items-center">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ color: "#000" }}
            >
              <div className="rotate-90 -mb-1" onClick={() => setOpen(!open)}>
                {open ? (
                  <X className="w-6 h-6 sm:w-6 sm:h-6 xl:w-6 xl:h-6" />
                ) : (
                  <Tally3 className="w-6 h-6 sm:w-6 sm:h-6 xl:w-6 xl:h-6" />
                )}
              </div>
            </IconButton>
            <Link href="/">
              <Image
                src="/assets/logo.svg"
                alt="Fullbooker Logo"
                width={120}
                height={34}
              />
            </Link>
          </div>
          <div>
            {authToken && (
              <Profile
                button={
                  <div className="md:flex justify-center content-center items-center cursor-pointer ml-2">
                    <Image
                      src={`${
                        profile?.image ||
                        "/assets/default-profile-picture-placeholder.jpg"
                      }`}
                      alt={"Host Profile Image"}
                      width={isMobile ? 35 : 35}
                      height={isMobile ? 35 : 35}
                      className="rounded-lg"
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
                          {authData?.user?.phone_number && (
                            <span
                              className={`text-[13px] sm:text-base lg:text-lg ${
                                theme === "light" ? "text-black" : "text-white"
                              }`}
                            >
                              {`${hideMiddleCharacters(
                                authData?.user?.phone_number
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
                        icon={<Home className="w-4 h-4 sm:w-5 sm:h-5" />}
                        text="Home"
                        href="/"
                        onItemClick={handleCloseLink}
                      />

                      <ProfileItem
                        theme={themeMode}
                        icon={<Grid className="w-4 h-4 sm:w-5 sm:h-5" />}
                        text="Dashboard"
                        href={
                          authToken
                            ? "/vendor"
                            : `/login?redirect=${pathname?.slice(1)}`
                        }
                        onItemClick={handleCloseLink}
                      />
                      <ProfileItem
                        theme={themeMode}
                        icon={<ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />}
                        text="My Products"
                        href={
                          authToken
                            ? "/vendor/products"
                            : `/login?redirect=${pathname?.slice(1)}`
                        }
                        onItemClick={handleCloseLink}
                      />
                      <ProfileItem
                        theme={themeMode}
                        icon={<UserRound className="w-4 h-4 sm:w-5 sm:h-5" />}
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
        </Toolbar>
      </AppBar>
    </Box>
  );
};

const mapStateToProps = (state: RootState) => {
  const loading = state.loading.models.authentication;
  const { profile } = state.profile;
  const { isLoggedIn, authData } = state.authentication;
  return { isLoggedIn, authData, loading, profile };
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

export default connect(mapStateToProps, mapDispatchToProps)(VendorAppBar);
