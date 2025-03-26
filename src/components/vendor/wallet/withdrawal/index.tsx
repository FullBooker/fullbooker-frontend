"use client";

import { withAuth } from "@/components/views/dash/authGuard";
import { WithdrawalRequestPayload } from "@/domain/dto/input";
import { AuthData } from "@/domain/dto/output";
import { NotificationType } from "@/domain/notification";
import { cn } from "@/lib/utils";
import { Dispatch, RootState } from "@/store";
import { ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { connect } from "react-redux";

import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CircularProgress } from "@mui/material";
import { vendor } from "../../../../store/models/vendor";
import Button from "@/components/shared/button";

type WithdrawPageProps = {
  loading: boolean;
  triggerWithdrawalRequest: (payload: WithdrawalRequestPayload) => void;
  type: NotificationType;
  paymentMethods: Array<string>;
  message: string;
  isLoggedIn: boolean;
  authData: AuthData;
};

interface FormData {
  amount: any;
}

const schema = yup.object().shape({
  amount: yup.number().min(50).max(250000).required("Amount is required"),
});

const Withdrawal: FC<WithdrawPageProps> = ({
  loading,
  triggerWithdrawalRequest,
  message,
  paymentMethods,
  type,
  isLoggedIn,
  authData,
}) => {
  const { theme = "dark" } = useTheme();
  const [themeMode, setThemeMode] = useState("dark");
  const [amount, setAmount] = useState(0);
  const [insufficientWalletBalance, setWalletBalanceStatus] = useState(false);
  const [selectedWithdraw, setSelectedWithdraw] = useState(0);

  useEffect(() => {
    setThemeMode(theme as string);
  }, [theme]);

  const {
    control,
    setError,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: amount,
    },
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    if (authData?.user?.wallet_balance === 0) {
      return setWalletBalanceStatus(true);
    }
    const { amount } = data;
    triggerWithdrawalRequest({
      amount,
    } as WithdrawalRequestPayload);
  };

  useEffect(() => {
    setThemeMode(theme as string);
  }, [theme]);

  useEffect(() => {
    setValue("amount", selectedWithdraw);
  }, [selectedWithdraw]);

  return (
    <div className="flex flex-col h-full pt-6 px-2 md:px-4 py-8">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-medium">
          Make a Withdrawal
        </h1>
        <div className="w-fit px-[8px] py-[8px] xs:px-[10px] xs:py-[8px] sm:px-[14px] sm:py-[10px] md:px-4 md:py-3 flex items-center gap-2 border border-inputBorderColor rounded-full">
          <Image
            src={`/assets/ic_payment_mpesa.png`}
            alt="Payment Method MPESA"
            width={65}
            height={40}
            className="w-[40px] h-[16px] xs:w-[46px] xs:h-[18px] sm:w-[60px] sm:h-[22px] lg:w-[70px] lg:h-[25px] border-r border-inputBorderColor pe-2"
          />
          <div className="flex items-center gap-1 xs:gap-3 sm:gap-6 lg:gap-8">
            <span className="text-xs lg:text-sm">MPESA</span>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-5 sm:gap-6 md:gap-8 lg:gap-10 mt-3">
        <div className="w-full leading-relaxed text-sm text-textColor">
          <span
            className={`text-xs xl:text-sm ${
              themeMode === "light" ? "text-gray-600" : "text-white"
            }`}
          >
            Withdraw from your Fullbooker Wallet to your Mobile money wallet.
            Daily withdrawal Limits: Minimum KES50, Maximum KES300,000
          </span>
        </div>
        <div className="flex flex-col space-y-2">
          <h1 className="text-sm lg:text-base xl:text-lg">
            Instant Withdrawal
          </h1>
          <Controller
            name="amount"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange, onBlur } }) => (
              <div
                className={`grid grid-cols-5 text-center cursor-pointer ${
                  themeMode === "light" ? "text-textColor2" : "text-whiteColor"
                }`}
              >
                <div
                  className={`py-4 font-semibold text-[10px] xs:text-xs md:text-[13px] border ${
                    selectedWithdraw === 50 && theme === "light"
                      ? "bg-primary text-white border-none"
                      : selectedWithdraw === 50 && theme === "dark"
                      ? "bg-primary text-white border-none"
                      : "border-inputBorderColor"
                  }`}
                  onClick={() => {
                    onChange(50);
                    setSelectedWithdraw(50);
                  }}
                >
                  KSH 50
                </div>
                <div
                  className={`py-4 font-semibold text-[10px] xs:text-xs md:text-[13px] border ${
                    selectedWithdraw === 100 && theme === "light"
                      ? "bg-primary text-white border-none"
                      : selectedWithdraw === 100 && theme === "dark"
                      ? "bg-primary text-white border-none"
                      : "border-inputBorderColor"
                  }`}
                  onClick={() => {
                    onChange(100);
                    setSelectedWithdraw(100);
                  }}
                >
                  KSH 100
                </div>
                <div
                  className={`py-4 font-semibold text-[10px] xs:text-xs md:text-[13px] border ${
                    selectedWithdraw === 150 && theme === "light"
                      ? "bg-primary text-white border-none"
                      : selectedWithdraw === 150 && theme === "dark"
                      ? "bg-primary text-white border-none"
                      : "border-inputBorderColor"
                  }`}
                  onClick={() => {
                    onChange(150);
                    setSelectedWithdraw(150);
                  }}
                >
                  KSH 150
                </div>
                <div
                  className={`py-4 font-semibold text-[10px] xs:text-xs md:text-[13px] border ${
                    selectedWithdraw === 200 && theme === "light"
                      ? "bg-primary text-white border-none"
                      : selectedWithdraw === 200 && theme === "dark"
                      ? "bg-primary text-white border-none"
                      : "border-inputBorderColor"
                  }`}
                  onClick={() => {
                    onChange(200);
                    setSelectedWithdraw(200);
                  }}
                >
                  KSH 200
                </div>
                <div
                  className={`py-4 font-semibold text-[10px] xs:text-xs md:text-[13px] border ${
                    selectedWithdraw === 250 && theme === "light"
                      ? "bg-primary text-white border-none"
                      : selectedWithdraw === 250 && theme === "dark"
                      ? "bg-primary text-white border-none"
                      : "border-inputBorderColor"
                  }`}
                  onClick={() => {
                    onChange(250);
                    setSelectedWithdraw(250);
                  }}
                >
                  KSH 250
                </div>
              </div>
            )}
          />
        </div>
        <div className="w-full flex items-center">
          <div className="flex-grow border-b border-inputBorderColor"></div>
          <span
            className={`text-sm lg:text-base mx-auto px-3 ${
              themeMode === "light" ? "text-textColor2" : "text-textColor"
            }`}
          >
            OR
          </span>
          <div className="flex-grow border-b border-inputBorderColor"></div>
        </div>
        <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full flex flex-col">
            <label htmlFor="amount" className="text-xs lg:text-sm xl:text-base">
              Custom Amount
            </label>
            <Controller
              name="amount"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <input
                  type="number"
                  name="Amount"
                  id="Amount"
                  className={cn(
                    "flex w-full text-xs py-4 px-4 rounded-sm bg-transparent border border-inputBorderColor file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-placeholderColor focus-visible:outline-none focus-visible:border focus-visible:ring-[1px] focus-visible:ring-foreground focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  onChange={(e) => {
                    const value = e.target.value
                      ? parseInt(e.target.value, 10)
                      : "";
                    onChange(value);
                    setSelectedWithdraw(value as number);
                  }}
                  placeholder="Enter amount"
                  value={value}
                />
              )}
            />
            {errors?.amount?.message && (
              <p className="text-red-500">{errors?.amount?.message}</p>
            )}
            {insufficientWalletBalance && (
              <p className="text-red-500">
                You have insufficient balance to make a withdrawal
              </p>
            )}
            <span
              className={`text-xs xl:text-sm ${
                themeMode === "light" ? "text-textColor2" : "text-textColor"
              } mb-4`}
            >
              Maximum withdrawal amount is KES300,000 *
            </span>
            <Button
              type="submit"
              width="w-full"
              bg="bg-primary"
              padding="py-2 md:py-4"
              text="text-white"
              borderRadius="rounded"
              disabled={loading || Object.keys(errors).length !== 0}
            >
              {loading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                "Confirm Withdrawal"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const loading = state.loading.models.billing;
  const { message, type } = state.alert;
  const { isLoggedIn, authData } = state.authentication;
  const { profile } = state.profile;
  return {
    loading,
    message,
    type,
    isLoggedIn,
    authData,
    profile,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  triggerWithdrawalRequest: (payload: WithdrawalRequestPayload) =>
    dispatch.vendor.triggerWithdrawalRequest(payload),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuth(Withdrawal));
