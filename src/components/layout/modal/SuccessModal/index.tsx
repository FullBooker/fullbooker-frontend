import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CircularProgress } from "@mui/material";
import Image from "next/image";
import React from "react";

const ModalSuccess = (props: {
  theme: string | undefined;
  title: string;
  description: string;
  type: "Deposit" | "Withdraw";
  amount: string;
  buttonTitle?: string;
  open?: boolean;
  close: () => void;
}) => {
  const {
    theme,
    title,
    description,
    type,
    amount,
    buttonTitle,
    open = true,
    close,
  } = props;
  return (
    <Dialog open={open}>
      <DialogContent className="w-[320px] xs:w-[360px] md:w-[420px] flex flex-col justify-center items-center pt-12 rounded-xl sm:rounded-2xl md:rounded-3xl">
        <Image
          src="/assets/img_deposit_success.png"
          alt="Payment MPESA"
          width={210}
          height={250}
          className="xl:w-[230px] xl:h-[270px]"
        />
        <DialogHeader className="flex flex-col justify-center items-center gap-1 lg:gap-4 mt-1 lg:mt-5">
          <DialogTitle className="text-lg md:text-xl lg:text-2xl text-center">
            {title}
          </DialogTitle>
          <DialogDescription
            className={`flex flex-col gap-4 px-2 text-xs md:text-sm text-center ${
              theme === "light" ? "text-textColor2" : "text-textColor"
            }`}
          >
            <span className="leading-relaxed">{description}</span>
            <div
              className={`flex flex-col gap-1 border py-3 rounded-[10px] ${
                theme === "light" ? "border-textColor" : "border-strokeColor"
              }`}
            >
              <span className="text-[11px]">{`${type} Amount`}</span>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-bl from-mainColor via-redMediumColor to-redDarkColor">
                KES {amount}
              </span>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="w-full mt-2 md:mt-6">
          <button
            onClick={() => close()}
            className="w-full text-xs md:text-sm px-[16px] py-[14px] lg:px-[16px] lg:py-[14px] xl:px-[18px] xl:py-[16px] bg-gradient-to-bl from-mainColor via-redMediumColor to-redDarkColor text-whiteColor rounded-full flex justify-center"
          >
            <CircularProgress size={18} color="inherit" />
            <span className="ml-2">Processing Payment</span>
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalSuccess;
