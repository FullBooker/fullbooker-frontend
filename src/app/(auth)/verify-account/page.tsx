"use client";

import { Switch } from "@/components/themeToggle/auth/switch";
import Image from "next/image";
import ButtonAuth from "../../../components/auth/ButtonAuth";
import Card from "../../../components/auth/Card";
import Link from "next/link";
import { InputOTP, InputOTPSlot } from "@/components/auth/input-otp";
import { useSearchParams, useRouter } from "next/navigation";
import AuthLayout from "../layout";
import {
  ResendPhoneOTPPayload,
  VerifyPhoneOTPPayload,
} from "@/domain/dto/input";
import { RootState } from "@/store";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CircularProgress } from "@mui/material";
import { NotificationType } from "@/domain/notification";
import { FC, useEffect, useState } from "react";
import { connect } from "react-redux";
import useOtpTimer from "@/lib/useOTPTimer";

type VerifyAccountPageProps = {
  loading: boolean;
  verifyOTP: (payload: VerifyPhoneOTPPayload) => void;
  resendOTP: (payload: ResendPhoneOTPPayload) => void;
  type: NotificationType;
  message: string;
};

const VerifyAccountPage: FC<VerifyAccountPageProps> & {
  layout: any;
} = ({ loading, verifyOTP, type, message, resendOTP }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { timerDisplay, isResendDisabled, handleResendClick } = useOtpTimer();
  const defaultValues = {
    phone: searchParams?.get("phone") || "",
    otp: "",
  };

  interface FormData {
    phone: string;
    otp: string;
  }

  const schema = yup.object().shape({
    phone: yup
      .string()
      .min(10, "Phone number must be atleast 10 digits")
      .required("Phone number is required"),
    otp: yup
      .string()
      .min(4, "OTP must be atleast 4 digits")
      .required("OTP is required"),
  });

  const {
    control,
    setError,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    const { phone, otp } = data;
    verifyOTP({ phone, otp } as VerifyPhoneOTPPayload);
  };

  useEffect(() => {
    if (
      type === NotificationType.success &&
      message?.includes("Your phone number has been verified successfully")
    ) {
      router.push("/login");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, message]);

  return (
    <>
      <div className="flex flex-col min-h-screen justify-center lg:flex-row">
        <div className="w-full lg:w-6/12 xl:w-5/12 flex flex-col justify-center px-8 sm:px-24 lg:px-5 xl:px-6 2xl:px-12 my-0 xl:my-12">
          <div className="flex flex-col mb-20 md:mb-16 lg:mb-10">
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
              <div className="flex flex-col space-y-1.5 text-center">
                <h1 className="md:text-xl xl:text-2xl 2xl:text-2xl font-semibold">
                  Verify Your Account
                </h1>
                <span className="text-xs xl:text-base font-normal text-textColor">
                  Verification code has been sent to{" "}
                  <span className="text-primary">
                    {`${searchParams?.get("phone")}`}
                  </span>{" "}
                  enter you code below.
                </span>
              </div>
              <div className="w-full">
                <Controller
                  name="otp"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <InputOTP maxLength={5} value={value} onChange={onChange}>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                    </InputOTP>
                  )}
                />
                {errors?.otp?.message && (
                  <div className="flex flex-row justify-center space-x-1 mt-3 md:mt-6 lg:mt-10 -mb-2 md:-mb-4">
                    <p className="text-red-500">{errors?.otp?.message}</p>
                  </div>
                )}

                {/* OTP Timer */}
                <div className="flex flex-row justify-center space-x-1 mt-4 md:mt-6 lg:mt-10 -mb-2 md:-mb-4">
                  <span className="text-xs xl:text-sm text-textColor">
                    Resend Code
                  </span>
                  <span className="text-xs xl:text-sm text-mainColor">
                    {timerDisplay}
                  </span>
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
                    "Verify Account"
                  )}
                </ButtonAuth>
                <div className="flex flex-row justify-center text-center space-x-1 mt-4">
                  <span className="text-xs xl:text-sm text-textColor">
                    By register account, you agree to our
                    <Link
                      href="#"
                      className="ms-1 text-xs xl:text-sm text-mainColor underline underline-offset-2"
                    >
                      Terms of Service
                    </Link>
                  </span>
                </div>
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

VerifyAccountPage.layout = AuthLayout;

const mapStateToProps = (state: RootState) => {
  const loading = state.loading.models.authentication;
  const { message, type } = state.alert;
  return { loading, message, type };
};

const mapDispatchToProps = (dispatch: any) => ({
  verifyOTP: (payload: VerifyPhoneOTPPayload) =>
    dispatch.authentication.verifyOTP(payload),
  resendOTP: (payload: ResendPhoneOTPPayload) =>
    dispatch.authentication.resendOTP(payload),
});

export default connect(mapStateToProps, mapDispatchToProps)(VerifyAccountPage);
