"use client";

import { Switch } from "@/components/themeToggle/auth/switch";
import Image from "next/image";
import ButtonAuth from "../../auth/ButtonAuth";
import Card from "../../auth/Card";
import Link from "next/link";
import { InputOTP, InputOTPSlot } from "@/components/auth/input-otp";
import { useSearchParams, useRouter } from "next/navigation";
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

type PhoneOtpVerificationModalContentProps = {
  loading: boolean;
  verifyOTP: (payload: VerifyPhoneOTPPayload) => void;
  resendOTP: (payload: ResendPhoneOTPPayload) => void;
  type: NotificationType;
  message: string;
};

const PhoneOtpVerificationModalContent: FC<
  PhoneOtpVerificationModalContentProps
> = ({ loading, verifyOTP, type, message, resendOTP }) => {
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
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <Image
          src="/assets/logo.svg"
          alt="Fullbooker Logo"
          width={200}
          height={40}
          className="mx-auto mb-6"
        />
        <h2 className="text-xl font-semibold mb-2">
          An OTP code has been sent to +2547*****23
        </h2>
      </div>
      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
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
            <div className="flex flex-row justify-center space-x-1 mt-5 mb-5">
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
                "Verify"
              )}
            </ButtonAuth>
          </div>
      </form>
    </div>
  );
};

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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhoneOtpVerificationModalContent);
