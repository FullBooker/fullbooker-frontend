"use client";

import { cn } from "@/lib/utils";
import { FC } from "react";

import { RootState } from "@/store";

import { connect } from "react-redux";
import { UpdatePasswordPayload } from "@/domain/dto/input";

import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CircularProgress } from "@mui/material";

type PasswordSettingProps = {
  loading: boolean;
  updatePassword: (payload: UpdatePasswordPayload) => void;
};

const defaultValues = {
  CurrentPassword: "",
  NewPassword: "",
  ConfirmPassword: "",
};

interface FormData {
  CurrentPassword: string;
  NewPassword: string;
  ConfirmPassword: string;
}

const schema = yup.object().shape({
  CurrentPassword: yup.string().required("Current password is required"),
  NewPassword: yup.string().required("New password is required"),
  ConfirmPassword: yup.string().required("Confirm your new password"),
});

const PasswordSetting: FC<PasswordSettingProps> = ({
  loading,
  updatePassword,
}) => {
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    const { CurrentPassword, NewPassword, ConfirmPassword } = data;
    updatePassword({
      CurrentPassword,
      NewPassword,
      ConfirmPassword,
    } as UpdatePasswordPayload);
  };

  return (
    <div>
      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-lg md:text-xl lg:text-2xl font-medium mb-4 md:mb-8">
          Password Setting
        </h1>
        <div className="flex flex-col gap-4 mb-5">
          <div className="w-full flex flex-col space-y-2">
            <label
              htmlFor="CurrentPassword"
              className="text-xs lg:text-sm xl:text-base"
            >
              Current Password
            </label>
            <Controller
              name="CurrentPassword"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <input
                  type="password"
                  name="CurrentPassword"
                  id="CurrentPassword"
                  className={cn(
                    "flex w-full text-xs py-4 px-4 rounded-sm bg-transparent border border-inputBorderColor file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-placeholderColor focus-visible:outline-none focus-visible:border focus-visible:ring-[1px] focus-visible:ring-foreground focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  placeholder="Enter current password"
                  onChange={onChange}
                  value={value}
                />
              )}
            />
            {errors?.CurrentPassword?.message && (
              <p className="text-red-500">{errors?.CurrentPassword?.message}</p>
            )}
          </div>
          <div className="w-full flex flex-col space-y-2">
            <label
              htmlFor="password"
              className="text-xs lg:text-sm xl:text-base"
            >
              New Password
            </label>
            <Controller
              name="NewPassword"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <input
                  type="password"
                  name="NewPassword"
                  id="NewPassword"
                  className={cn(
                    "flex w-full text-xs py-4 px-4 rounded-sm bg-transparent border border-inputBorderColor file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-placeholderColor focus-visible:outline-none focus-visible:border focus-visible:ring-[1px] focus-visible:ring-foreground focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  placeholder="Enter new password"
                  onChange={onChange}
                  value={value}
                />
              )}
            />
            {errors?.NewPassword?.message && (
              <p className="text-red-500">{errors?.NewPassword?.message}</p>
            )}
          </div>
          <div className="w-full flex flex-col space-y-2">
            <label
              htmlFor="ConfirmPassword"
              className="text-xs lg:text-sm xl:text-base"
            >
              Confirm Password
            </label>
            <Controller
              name="ConfirmPassword"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <input
                  type="password"
                  name="ConfirmPassword"
                  id="ConfirmPassword"
                  className={cn(
                    "flex w-full text-xs py-4 px-4 rounded-sm bg-transparent border border-inputBorderColor file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-placeholderColor focus-visible:outline-none focus-visible:border focus-visible:ring-[1px] focus-visible:ring-foreground focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  placeholder="Enter new password"
                  onChange={onChange}
                  value={value}
                />
              )}
            />
            {errors?.ConfirmPassword?.message && (
              <p className="text-red-500">{errors?.ConfirmPassword?.message}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end items-center">
          <button
            type="submit"
            className="px-[16px] py-[11px] lg:px-[20px] lg:py-[12px] xl:px-[22px] xl:py-[13px] bg-gradient-to-bl from-mainColor via-redMediumColor to-redDarkColor text-xs lg:text-sm xl:text-base text-whiteColor rounded-full transition-opacity duration-300 hover:opacity-40"
          >
            {loading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              " Edit Password"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const loading = state.loading.models.authentication;
  return { loading };
};

const mapDispatchToProps = (dispatch: any) => ({
  updatePassword: (payload: UpdatePasswordPayload) =>
    dispatch.authentication.updatePassword(payload),
});

export default connect(mapStateToProps, mapDispatchToProps)(PasswordSetting);
