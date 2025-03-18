"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

import { FC, useEffect, useState } from "react";

import { RootState } from "@/store";

import { connect } from "react-redux";
import { AuthData } from "@/domain/dto/output";
import { UserProfile } from "@/domain/profile";
import {
  UpdatePasswordPayload,
  UpdateUserProfilePayload,
} from "@/domain/dto/input";

import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CircularProgress } from "@mui/material";
import Button from "@/components/shared/button";

type ProfileSettingProps = {
  loading: boolean;
  updateUserProfile: (payload: UpdateUserProfilePayload) => void;
  profile: UserProfile;
  authData: AuthData;
};

const ProfileSetting: FC<ProfileSettingProps> = ({
  loading,
  updateUserProfile,
  profile,
  authData,
}) => {
  interface FormData {
    first_name: string | null;
    last_name: string | null;
    email?: string;
    phone_number?: string;
  }

  const schema = yup.object().shape({
    first_name: yup.string().required("First name is required"),
    last_name: yup.string().required("Last name is required"),
    email: yup.string().email("Provide a valid email address"),
    phone_number: yup.string().required("Phone number is required"),
  });

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      email: profile?.email || undefined,
      phone_number: profile?.phone_number || undefined,
    },
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    const {
      first_name,
      last_name,
      email,
    } = data;
    updateUserProfile({
      first_name: first_name,
      last_name: last_name,
      email: email,
    } as any);
  };

  return (
    <div>
      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-lg md:text-xl lg:text-2xl font-medium mb-4 md:mb-8">
          Profile
        </h1>
        <div className="w-full md:grid grid-cols-2 gap-4 mb-4">
          <div className={`flex flex-col space-y-2 mb-4 md:mb-0`}>
            <label
              htmlFor="first_name"
              className="text-xs lg:text-sm xl:text-base"
            >
              First Name
            </label>
            <Controller
              name="first_name"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  className={cn(
                    "flex w-full text-xs py-4 px-4 rounded-sm bg-transparent border border-inputBorderColor file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-placeholderColor focus-visible:outline-none focus-visible:border focus-visible:ring-[1px] focus-visible:ring-foreground focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  onChange={onChange}
                  value={value || (profile?.first_name as any)}
                  placeholder="Your first name"
                />
              )}
            />
            {errors?.first_name?.message && (
              <p className="text-red-500">{errors?.first_name?.message}</p>
            )}
          </div>
          <div className={`flex flex-col space-y-2 mb-4 md:mb-0`}>
            <label
              htmlFor="last_name"
              className="text-xs lg:text-sm xl:text-base"
            >
              Last Name
            </label>
            <Controller
              name="last_name"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <input
                  type="text"
                  name="last_name"
                  id="last_name"
                  className={cn(
                    "flex w-full text-xs py-4 px-4 rounded-sm bg-transparent border border-inputBorderColor file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-placeholderColor focus-visible:outline-none focus-visible:border focus-visible:ring-[1px] focus-visible:ring-foreground focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  placeholder="Your last name"
                  onChange={onChange}
                  value={value || (profile?.last_name as any)}
                />
              )}
            />
            {errors?.last_name?.message && (
              <p className="text-red-500">{errors?.last_name?.message}</p>
            )}
          </div>
          <div className={`flex flex-col space-y-2 mb-4 md:mb-0`}>
            <label
              htmlFor="phone_number"
              className="text-xs lg:text-sm xl:text-base"
            >
              Phone Number
            </label>
            <Controller
              name="phone_number"
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <input
                  type="text"
                  name="phone_number"
                  id="phone_number"
                  className={cn(
                    "flex w-full text-xs py-4 px-4 rounded-sm bg-transparent border border-inputBorderColor file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-placeholderColor focus-visible:outline-none focus-visible:border focus-visible:ring-[1px] focus-visible:ring-foreground focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  onChange={onChange}
                  value={value || (profile?.phone_number as any)}
                />
              )}
            />
            {errors?.last_name?.message && (
              <p className="text-red-500">{errors?.phone_number?.message}</p>
            )}
          </div>
          <div className={`flex flex-col space-y-2 mb-4 md:mb-0`}>
            <label htmlFor="email" className="text-xs lg:text-sm xl:text-base">
              E-mail
            </label>
            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <input
                  type="text"
                  name="email"
                  id="email"
                  className={cn(
                    "flex w-full text-xs py-4 px-4 rounded-sm bg-transparent border border-inputBorderColor file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-placeholderColor focus-visible:outline-none focus-visible:border focus-visible:ring-[1px] focus-visible:ring-foreground focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  placeholder="Enter Your e-mail"
                  onChange={onChange}
                  value={value || (profile?.email as any)}
                />
              )}
            />
            {errors?.last_name?.message && (
              <p className="text-red-500">{errors?.email?.message}</p>
            )}
          </div>
          {/* <div className="flex flex-col space-y-2 mb-4 md:mb-0">
            <label
              htmlFor="national_identification"
              className="text-xs lg:text-sm xl:text-base"
            >
              National Identification ID
            </label>
            <Controller
              name="national_id"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <input
                  type="text"
                  name="national_id"
                  id="national_id"
                  onChange={onChange}
                  value={value || (profile?.national_id as any)}
                  className={cn(
                    "flex w-full text-xs py-4 px-4 rounded-sm bg-transparent border border-inputBorderColor file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-placeholderColor focus-visible:outline-none focus-visible:border focus-visible:ring-[1px] focus-visible:ring-foreground focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  placeholder="Enter ID"
                />
              )}
            />
            {errors?.national_id?.message && (
              <p className="text-red-500">{errors?.national_id?.message}</p>
            )}
          </div>
          <div className="flex flex-col space-y-2 mb-4 md:mb-0">
            <label htmlFor="city" className="text-xs lg:text-sm xl:text-base">
              City
            </label>
            <Controller
              name="city"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <input
                  type="text"
                  name="city"
                  id="city"
                  className={cn(
                    "flex w-full text-xs py-4 px-4 rounded-sm bg-transparent border border-inputBorderColor file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-placeholderColor focus-visible:outline-none focus-visible:border focus-visible:ring-[1px] focus-visible:ring-foreground focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  placeholder="Enter city"
                  onChange={onChange}
                  value={value || (profile?.city as any)}
                />
              )}
            />
            {errors?.city?.message && (
              <p className="text-red-500">{errors?.city?.message}</p>
            )}
          </div> */}
        </div>
        {/* <div className="w-full flex flex-col space-y-2 mb-5">
          <label htmlFor="address" className="text-xs lg:text-sm xl:text-base">
            Your Address
          </label>
          <Controller
            name="address"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange, onBlur } }) => (
              <textarea
                name="address"
                id="address"
                className={cn(
                  "flex w-full text-xs py-4 px-4 rounded-sm bg-transparent border border-inputBorderColor file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-placeholderColor focus-visible:outline-none focus-visible:border focus-visible:ring-[1px] focus-visible:ring-foreground focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                )}
                placeholder="Enter your address"
                rows={8}
                onChange={onChange}
                value={value || (profile?.address as any)}
              />
            )}
          />
          {errors?.address?.message && (
            <p className="text-red-500">{errors?.address?.message}</p>
          )}
        </div> */}

        <div className="flex justify-end items-center">
          <Button
            width="w-full md:w-[20%]"
            bg="bg-primary"
            borderRadius="rounded"
            text="text-white font-base"
            padding="py-3"
            margin="mb-2"
            type="submit"
          >
            {loading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const loading = state.loading.models.profile;
  const { authData } = state.authentication;
  const { profile } = state.profile;
  return { loading, authData, profile };
};

const mapDispatchToProps = (dispatch: any) => ({
  updateUserProfile: (payload: UpdateUserProfilePayload) =>
    dispatch.profile.updateUserProfile(payload),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSetting);
