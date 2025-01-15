"use client";

import ButtonAuth from "@/components/auth/ButtonAuth";
import Card from "@/components/auth/Card";
import FormInputAuth from "@/components/auth/FormInputAuth";
import { InputOTP, InputOTPSlot } from "@/components/auth/input-otp";
import { Switch } from "@/components/themeToggle/auth/switch";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { connect } from "react-redux";
import { FC, useEffect } from "react";

import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CircularProgress } from "@mui/material";
import { NotificationType } from "@/domain/notification";
import {
  ForgotPasswordPayload,
  ResendPhoneOTPPayload,
  ResetPasswordPayload,
} from "@/domain/dto/input";
import { RootState } from "@/store";
import useOtpTimer from "@/lib/useOTPTimer";

type ResetPasswordPageProps = {
  loading: boolean;
  resetPassword: (payload: ResetPasswordPayload) => void;
  message: string;
  type: NotificationType;
  resendOTP: (payload: ResendPhoneOTPPayload) => void;
};

const ResetPasswordPage: FC<ResetPasswordPageProps> = ({
  loading,
  resetPassword,
  message,
  type,
  resendOTP,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { timerDisplay, isResendDisabled, handleResendClick } = useOtpTimer();

  const defaultValues = {
    Phone: searchParams.get("phone") || "",
    OTP: "",
    Password: "",
    ConfirmPassword: "",
  };

  interface FormData {
    Phone: string;
    OTP: string;
    Password: string;
    ConfirmPassword: string;
  }

  const schema = yup.object().shape({
    Phone: yup
      .string()
      .min(10, "Phone number must be atleast 10 digits")
      .required("Phone number is required"),
    OTP: yup.string().required("OTP code is required"),
    Password: yup.string().required("Password is required"),
    ConfirmPassword: yup.string().required("Confirm your password is required"),
  });
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
    const { Phone, ConfirmPassword, OTP, Password } = data;
    resetPassword({
      Phone,
      ConfirmPassword,
      OTP,
      Password,
    } as ResetPasswordPayload);
  };

  useEffect(() => {
    if (
      type === NotificationType.success &&
      message?.includes("Your password has been reset successfully")
    ) {
      router.push("/login");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, message]);

  return (
    <>
      <div className="flex flex-col min-h-screen justify-center lg:flex-row">
        <div className="w-full lg:w-6/12 xl:w-5/12 flex flex-col justify-center px-8 sm:px-24 lg:px-5 xl:px-6 2xl:px-12 my-0 xl:my-12">
          <div className="flex flex-col mb-20 md:mb-16 lg:mb-10 space-y-2 lg:space-y-4">
            <div className="flex items-center justify-between">
              {/* When the theme is dark, hide this div */}
              <div data-hide-on-theme="dark">
                <Image
                  src="/assets/logo_light.png"
                  alt="MowinBet Logo"
                  width={238}
                  height={39.29}
                  className="w-[130px] h-[45px] sm:w-[150px] sm:h-[50px] md:w-[200px] md:h-[60px]"
                />
              </div>

              {/* When the theme is light, hide this div */}
              <div data-hide-on-theme="light">
                <Image
                  src="/assets/logo_dark.png"
                  alt="MowinBet Logo"
                  width={238}
                  height={39.29}
                  className="w-[130px] h-[45px] sm:w-[150px] sm:h-[50px] md:w-[200px] md:h-[60px]"
                />
              </div>
              <Switch />
            </div>
          </div>
          <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <div className="flex flex-col items-center text-center space-y-1.5">
                <h1 className="md:text-xl xl:text-2xl 2xl:text-2xl font-semibold">
                  Reset Your Password
                </h1>
                <span className="text-xs xl:text-base font-normal text-textColor">
                  Enter your new password
                </span>
              </div>
              <div className="flex flex-col w-full space-y-2">
                <div className="flex flex-col space-y-3 md:space-y-4 lg:space-y-6 xl:space-y-8">
                  <div className="flex flex-col gap-2 mb-3 md:gap-4">
                    <div className="flex items-center justify-between gap-0 sm:justify-center sm:gap-24 lg:justify-between">
                      <span className="text-sm md:text-base whitespace-nowrap">
                        OTP Code
                      </span>
                      <div className="flex flex-row justify-center space-x-1 whitespace-nowrap">
                        <span className="text-[11px] xs:text-xs md:text-sm text-textColor">
                          Resend Code
                        </span>
                        <span className="text-[11px] xs:text-xs md:text-sm text-mainColor">
                          {timerDisplay}
                        </span>
                      </div>
                    </div>
                    <Controller
                      name="OTP"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <InputOTP
                          is="reset-password"
                          maxLength={5}
                          value={value}
                          onChange={onChange}
                        >
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                        </InputOTP>
                      )}
                    />
                    {errors?.OTP?.message && (
                      <div className="flex flex-row justify-center space-x-1 mt-3 md:mt-6 lg:mt-10 -mb-2 md:-mb-4">
                        <p className="text-red-500">{errors?.OTP?.message}</p>
                      </div>
                    )}
                  </div>
                  <Controller
                    name="Password"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <FormInputAuth
                        id="Password"
                        name="Password"
                        type="Password"
                        placeholder="Your password"
                        is_password={true}
                        onChange={onChange}
                        value={value}
                        error={errors?.Password?.message}
                      >
                        Password
                      </FormInputAuth>
                    )}
                  />
                  <Controller
                    name="ConfirmPassword"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <FormInputAuth
                        id="ConfirmPassword"
                        name="ConfirmPassword"
                        type="ConfirmPassword"
                        placeholder="Retype password"
                        is_password={true}
                        onChange={onChange}
                        value={value}
                        error={errors?.ConfirmPassword?.message}
                      >
                        Confirm Password
                      </FormInputAuth>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col w-full">
                {!isResendDisabled && (
                  <div className="flex flex-col w-full mb-3">
                    <ButtonAuth
                      onClick={() => {
                        resendOTP({
                          phone: searchParams?.get("phone"),
                        } as ResendPhoneOTPPayload);
                        handleResendClick();
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        "Resend Code"
                      )}
                    </ButtonAuth>
                  </div>
                )}
                <ButtonAuth type="submit">
                  {loading ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    "Change Password"
                  )}
                </ButtonAuth>
              </div>
            </Card>
          </form>
        </div>
        <div className="hidden lg:w-6/12 lg:block lg:self-center xl:w-7/12 pr:4 py-4 xl:py-7 xl:pr-7">
          <div className="lg:shrink-0">
            <Image
              src={`/assets/img_bg_auth.png`}
              alt={`Image Background Auth`}
              width={1030}
              height={900}
              className="w-full h-full object-fill"
            />
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => {
  const loading = state.loading.models.authentication;
  const { message, type } = state.alert;
  return { loading, type, message };
};

const mapDispatchToProps = (dispatch: any) => ({
  resetPassword: (payload: ResetPasswordPayload) =>
    dispatch.authentication.resetPassword(payload),
  resendOTP: (payload: ResendPhoneOTPPayload) =>
    dispatch.authentication.resendOTP(payload),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordPage);
