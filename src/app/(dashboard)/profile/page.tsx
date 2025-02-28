"use client";

import { cn } from "@/lib/utils";
import { ImageUp } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { FC, use, useEffect, useState } from "react";
import DeactiveModalAccount from "@/components/layout/modal/DeactiveModal";

import { RootState } from "@/store";

import { connect } from "react-redux";
import { AuthData } from "@/domain/dto/output";
import { UserProfile } from "@/domain/profile";
import { authentication } from "../../../store/models/authentication";
import {
  UpdatePasswordPayload,
  UpdateUserProfilePayload,
} from "@/domain/dto/input";
import ProfileSetting from "@/components/views/profile/profileSetting";
import PasswordSetting from "@/components/views/profile/passwordSetting";
import { withAuth } from "@/components/views/dash/authGuard";

type ProfilePageProps = {
  profileLoading: boolean;
  authLoading: boolean;
  getUserProfile: () => void;
  profile: UserProfile;
  authData: AuthData;
};

const ProfilePage: FC<ProfilePageProps> = ({
  profileLoading,
  authLoading,
  getUserProfile,
  profile,
  authData,
}) => {
  const { theme = "light" } = useTheme();
  const [themeMode, setThemeMode] = useState("light");

  useEffect(() => {
    setThemeMode(theme);
  }, [theme]);

  useEffect(() => {
    getUserProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-12 h-fit py-6 md:py-10 px-4 md:px- max-w-7xl mx-auto">
      {/* BG Profile */}
      <div className="w-full flex flex-col">
        <div className="flex flex-col justify-center">
          <div className="hidden sm:flex ms-6 sm:-mb-[58px] sm:ms-6 md:-mb-16 md:ms-12 lg:-mb-24 lg:ms-16 items-center sm:items-end gap-4 md:gap-6 lg:gap-8">
            <Image
              src={`/assets/default-profile-picture-placeholder.jpg`}
              alt="Profile Picture"
              width={348}
              height={348}
              className="block w-[75px] h-[75px] sm:w-[110px] sm:h-[110px] md:w-[120px] md:h-[120px] lg:w-[200px] lg:h-[200px] rounded-full"
            />
            <div className="w-full flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
              <div className="flex flex-col gap-0 lg:gap-1">
                <span className="text-whiteColor sm:text-primary text-sm sm:text-base md:text-lg lg:text-2xl">
                  {profile?.first_name
                    ? `${profile?.first_name} ${profile?.last_name}`
                    : ""}
                </span>
                <div
                  className={`flex items-center gap-1 lg:gap-2 ${
                    themeMode === "light"
                      ? "text-whiteColor sm:text-textColor2"
                      : "text-whiteColor sm:text-textColor"
                  }`}
                >
                  <span className="text-xs lg:text-sm">
                    {profile?.first_name
                      ? `${profile?.first_name?.toLocaleLowerCase()}${profile?.last_name?.toLocaleLowerCase()}`
                      : ""}
                  </span>
                  <span className="text-base lg:text-xl">&bull;</span>
                  <span className="text-xs lg:text-sm">
                    {profile?.email ? profile?.email : ""}
                  </span>
                </div>
              </div>
              <button
                className={`flex w-fit h-fit py-[10px] px-[14px] lg:py-3 lg:px-4 items-center gap-2 border bg-background text-primary sm:bg-transparent ${
                  themeMode === "light"
                    ? "border-strokeColor2 text-textColor2"
                    : "border-whiteColor text-whiteColor"
                } rounded-full text-sm`}
              >
                <span className="text-xs lg:text-sm">
                  Upload Profile Picture
                </span>
                <ImageUp className="w-3 h-3 md:w-[14px] md:h-[14px] lg:w-4 lg:h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex sm:hidden mt-4 ms-4 xs:mt-6 xs:ms-[10px] items-end gap-4">
          <div className="flex items-end">
            <div
              className={`flex justify-center items-center bg-cover bg-center w-[60px] h-[60px] xs:w-[70px] xs:h-[70px] lg:w-[200px] lg:h-[200px] rounded-full ${
                themeMode === "light"
                  ? ""
                  : "border-[2px] border-whiteColor xs:border-0"
              }`}
              style={{
                backgroundImage: `url('/assets/img_profile_picture.png')`,
              }}
            >
              <div
                className={`z-10 flex xs:hidden justify-center p-[4px] ${
                  themeMode === "light"
                    ? "bg-[#1D1B1C] text-whiteColor"
                    : "bg-whiteColor text-[#1D1B1C]"
                } rounded-full -me-10 -mb-8`}
              >
                <ImageUp className="w-[10px] h-[10px]" />
              </div>
            </div>
          </div>

          <div className="w-full flex justify-between items-end">
            <div className="flex flex-col gap-[1px]">
              <span className="text-sm">
                {profile?.first_name
                  ? `${profile?.first_name} ${profile?.last_name}`
                  : ""}
              </span>
              <div
                className={`flex items-center gap-[3px] ${
                  themeMode === "light" ? "text-textColor2" : "text-textColor"
                }`}
              >
                <span className="text-xs lg:text-sm">
                  {profile?.first_name
                    ? `${profile?.first_name?.toLocaleLowerCase()}${profile?.last_name?.toLocaleLowerCase()}`
                    : ""}
                </span>
                <span className="text-base lg:text-xl">&bull;</span>
                <span className="text-xs lg:text-sm">
                  {profile?.email ? profile?.email : ""}
                </span>
              </div>
            </div>
            <button
              className={`hidden xs:flex h-fit py-[6px] px-[10px] items-center gap-2 border ${
                themeMode === "light"
                  ? "border-strokeColor2 text-textColor2"
                  : "border-whiteColor text-whiteColor"
              } rounded-full text-sm`}
            >
              <span className="text-[9px] sm:text-[11px]">
                Upload Profile Picture
              </span>
              <ImageUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Account */}
      <div
        className={`flex flex-col p-7 gap-4 bg-cardColor rounded-[20px] sm:mt-14 lg:mt-28  mb-10 ${
          themeMode === "light" ? "shadow-card-auth-shadow" : ""
        }`}
      >
        <ProfileSetting />
        <PasswordSetting />
        <div>
          <h1 className="text-lg md:text-xl lg:text-2xl font-medium">
            Deactivate Account
          </h1>
          <div className="md:w-3/4 lg:w-3/5 mt-1">
            <span className="text-[11px] md:text-[13px] text-textColor">
              Deactivate your account to take a break or say goodbye.
              Temporarily hide your profile or permanently delete it. Choose
              wisely, as permanent deactivation is irreversible.
            </span>
          </div>
          <div className="flex justify-start items-center mt-4 md:mt-3 lg:mt-4">
            <DeactiveModalAccount theme={themeMode} />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const profileLoading = state.loading.models.profile;
  const authLoading = state.loading.models.authentication;
  const { authData } = state.authentication;
  const { profile } = state.profile;
  return { profileLoading, authLoading, authData, profile };
};

const mapDispatchToProps = (dispatch: any) => ({
  getUserProfile: () => dispatch.profile.getUserProfile(),
  updateUserProfile: (payload: UpdateUserProfilePayload) =>
    dispatch.profile.updateUserProfile(payload),
  updatePassword: (payload: UpdatePasswordPayload) =>
    dispatch.authentication.updatePassword(payload),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuth(ProfilePage));
