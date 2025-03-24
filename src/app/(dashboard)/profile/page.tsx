"use client";

import { ImageUp } from "lucide-react";
import Image from "next/image";
import { FC, useEffect, useState } from "react";

import { Dispatch, RootState } from "@/store";

import { connect } from "react-redux";
import { AuthData } from "@/domain/dto/output";
import { UserProfile } from "@/domain/profile";
import {
  UpdatePasswordPayload,
  UpdateUserProfilePayload,
} from "@/domain/dto/input";
import ProfileSetting from "@/components/views/profile/profileSetting";
import PasswordSetting from "@/components/views/profile/passwordSetting";
import { withAuth } from "@/components/views/dash/authGuard";
import MobileMiniAppBar from "@/components/layout/mobileMiniAppBar";
import { useTheme } from "next-themes";
import { UpdateProfileImagePayload } from "@/domain/dto/profile.input";
import { MediaType } from "@/domain/constants";

type ProfilePageProps = {
  profileLoading: boolean;
  authLoading: boolean;
  getUserProfile: () => void;
  profile: UserProfile;
  authData: AuthData;
  updateProfileImage: (payload: UpdateProfileImagePayload) => void;
};

const ProfilePage: FC<ProfilePageProps> = ({
  profileLoading,
  authLoading,
  getUserProfile,
  profile,
  authData,
  updateProfileImage,
}) => {
  const { theme = "light" } = useTheme();
  const [themeMode, setThemeMode] = useState("light");

  useEffect(() => {
    setThemeMode(theme);
  }, [theme]);
  useEffect(() => {
    getUserProfile();
  }, []);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      updateProfileImage({
        image: file,
      } as UpdateProfileImagePayload);
    }
  };

  return (
    <div>
      <MobileMiniAppBar title="My Profile" />
      <div className="flex flex-col gap-12 h-fit py-3 md:py-10 px-4 max-w-7xl mx-auto">
        {/* BG Profile */}
        <div className="w-full flex flex-col">
          <div className="flex flex-col justify-center">
            <div className="sm:flex ms-6 sm:-mb-[58px] sm:ms-6 md:-mb-16 md:ms-12 lg:-mb-24 lg:ms-16 items-center sm:items-end gap-4 md:gap-6 lg:gap-8">
              <Image
                 src={`${
                  profile?.image ||
                  "/assets/default-profile-picture-placeholder.jpg"
                } `}
                alt="Profile Picture"
                width={300}
                height={300}
                className="w-[75px] h-[75px] sm:w-[110px] sm:h-[110px] md:w-[120px] md:h-[120px] lg:w-[200px] lg:h-[200px] rounded-full object-cover"
                unoptimized={true}
              />
              <div className="w-full flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                <div className="flex flex-col gap-0 lg:gap-1">
                  <span className="text-black sm:text-primary text-sm sm:text-base md:text-lg lg:text-2xl">
                    {profile?.first_name
                      ? `${profile?.first_name} ${profile?.last_name}`
                      : ""}
                  </span>
                  <div
                    className={`flex items-center gap-1 lg:gap-2 ${
                      themeMode === "light"
                        ? "text-black sm:text-textColor2"
                        : "text-white sm:text-textColor"
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
                <label
                  className={`cursor-pointer flex w-fit h-fit py-[10px] px-[14px] lg:py-3 lg:px-4 items-center gap-2 border bg-background text-primary sm:bg-transparent ${
                    themeMode === "light"
                      ? "border-strokeColor2 text-textColor2"
                      : "border-whiteColor text-whiteColor"
                  } rounded-full text-sm`}
                >
                  <span className="text-xs lg:text-sm">
                    {profile?.image ? "Update" : "Upload"} Profile Picture
                  </span>
                  <ImageUp className="w-3 h-3 md:w-[14px] md:h-[14px] lg:w-4 lg:h-4" />

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Account */}
        <div
          className={`flex flex-col p-7 gap-4 bg-cardColor rounded md:rounded-[20px] mt-0 md:mt-10 lg:mt-28  mb-10 ${
            themeMode === "light" ? "shadow-card-auth-shadow" : ""
          }`}
        >
          <ProfileSetting />
          <PasswordSetting />
          {/* <div>
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
          </div> */}
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

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getUserProfile: () => dispatch.profile.getUserProfile(),
  updateUserProfile: (payload: UpdateUserProfilePayload) =>
    dispatch.profile.updateUserProfile(payload),
  updatePassword: (payload: UpdatePasswordPayload) =>
    dispatch.authentication.updatePassword(payload),
  updateProfileImage: (payload: UpdateProfileImagePayload) =>
    dispatch.profile.updateProfileImage(payload),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuth(ProfilePage));
