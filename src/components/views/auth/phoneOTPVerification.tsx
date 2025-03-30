"use client";

import { Switch } from "@/components/themeToggle/auth/switch";
import Image from "next/image";
import ButtonAuth from "../../auth/ButtonAuth";
import Card from "../../auth/Card";
import Link from "next/link";
import { InputOTP, InputOTPSlot } from "@/components/auth/input-otp";
import { useSearchParams, useRouter } from "next/navigation";
import {
  RequestOTPPayload,
  ResendPhoneOTPPayload,
  VerifyOTPPayload,
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
import { hideMiddleCharacters } from "@/utilities/helpers";
import Button from "@/components/shared/button";

type PhoneOtpVerificationModalContentProps = {
  loading: boolean;
  verifyOTP: (payload: VerifyOTPPayload) => void;
  resendOTP: (payload: RequestOTPPayload) => void;
  type: NotificationType;
  message: string;
  identifierToBeVerified: string;
};

const PhoneOtpVerificationModalContent: FC<
  PhoneOtpVerificationModalContentProps
> = ({
  loading,
  verifyOTP,
  type,
  message,
  resendOTP,
  identifierToBeVerified,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { timerDisplay, isResendDisabled, handleResendClick } = useOtpTimer();
  const defaultValues = {
    identifier: identifierToBeVerified || "",
    otp: "",
  };

  interface FormData {
    identifier: string;
    otp: string;
  }

  const schema = yup.object().shape({
    identifier: yup.string().required("Identifier is required"),
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
    const { identifier, otp } = data;
    verifyOTP({ identifier, otp } as VerifyOTPPayload);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <Image
          src="/assets/logo.svg"
          alt="Fullbooker Logo"
          width={200}
          height={40}
          className="mx-auto"
        />
        <div className="text-center items-center mb-5">
          <h2 className="text-sm font-semibold">Reset your password</h2>
        </div>
        <div className="flex justify-center">
          <h2 className="text-sm font-thin border-b-2 border-darkOrange w-[70%]">
            An OTP code has been sent to{" "}
            {hideMiddleCharacters(identifierToBeVerified)}
          </h2>
        </div>
      </div>
      <form
        className="mt-5"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
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
              </InputOTP>
            )}
          />
          {errors?.otp?.message && (
            <div className="flex flex-row justify-center space-x-1 mt-3 md:mt-6 lg:mt-5 lg:mb-5 -mb-2 md:-mb-4 font-thin text-sm">
              <p className="text-red-500">{errors?.otp?.message}</p>
            </div>
          )}

          {/* OTP Timer */}
          <div className="text-right space-x-1 mt-5 mb-5">
            <span className="text-xs xl:text-sm text-black font-thin">
              Resend code in
            </span>
            <span className="text-xs xl:text-sm text-mainColor">
              {timerDisplay}
            </span>
          </div>
        </div>

        <div className="text-center">
          {!isResendDisabled && (
            <Button
              width="w-full"
              bg="bg-primary"
              borderRadius="rounded"
              text="text-white font-base"
              padding="py-3"
              margin="mb-2"
              onClick={() => {
                resendOTP({
                  identifier: identifierToBeVerified,
                } as RequestOTPPayload);
                handleResendClick();
              }}
            >
              {loading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                "Resend Code"
              )}
            </Button>
          )}
          <div className="text-center mt-20">
            <Button
              width="w-full"
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
                "Continue"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const loading = state.loading.models.authentication;
  const { message, type } = state.alert;
  const { identifierToBeVerified } = state.authentication;
  return { loading, message, type, identifierToBeVerified };
};

const mapDispatchToProps = (dispatch: any) => ({
  verifyOTP: (payload: VerifyPhoneOTPPayload) =>
    dispatch.authentication.verifyOTP(payload),
  resendOTP: (payload: RequestOTPPayload) =>
    dispatch.authentication.requestOTP(payload),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhoneOtpVerificationModalContent);
