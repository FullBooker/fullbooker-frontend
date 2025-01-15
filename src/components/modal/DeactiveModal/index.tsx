import React, { useState } from "react"
import { Button } from "../../ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog"
import { cn } from "@/lib/utils"
import { InputOTP, InputOTPSlot } from "./input-otp"

const DeactiveModalAccount = (props: { theme: string | undefined }) => {
  const { theme } = props
  const [selectedType, setSelectedType] = useState("")

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="px-[16px] py-[11px] lg:px-[20px] lg:py-[12px] xl:px-[22px] xl:py-[13px] border border-textColor text-[10px] lg:text-xs xl:text-sm text-textColor rounded-full">
          Deactivate My Account
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[350px] xs:max-w-[450px] sm:max-w-[500px] rounded-xl sm:rounded-2xl md:rounded-3xl">
        <DialogHeader className="flex flex-col gap-1 lg:gap-2 mt-1 lg:mt-2">
          <DialogTitle className="text-lg md:text-xl lg:text-2xl">
            Deactivate Account
          </DialogTitle>
          <DialogDescription
            className={`text-sm md:text-base ${
              theme === "light" ? "text-textColor2" : "text-textColor"
            }`}
          >
            Are you sure will deactivate your account?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col w-full gap-4 md:gap-6 mt-3 md:mt-4">
          <div className="w-full flex flex-col space-y-[6px] md:space-y-2">
            <span className="text-sm md:text-base">Deactivate Type</span>
            <div
              className={`grid grid-cols-2 text-center cursor-pointer ${
                theme === "light" ? "text-textColor" : "text-textColor"
              }`}
            >
              <div
                className={`py-[10px] text-xs md:py-3 md:text-[13px] border rounded-l-[8px] md:rounded-l-[10px] ${
                  selectedType === "temporary" && theme === "light"
                    ? "bg-[#f5e4e3] text-[#bb3a33] border-[#bb3a33]"
                    : selectedType === "temporary" && theme === "dark"
                    ? "bg-[#2d1e1b] text-[#af241c] border-[#bb3a33]"
                    : "border-inputBorderColor"
                }`}
                onClick={() => setSelectedType("temporary")}
              >
                Temporary
              </div>
              <div
                className={`py-[10px] text-xs md:py-3 text-[13px] border rounded-r-[8px] md:rounded-r-[10px] ${
                  selectedType === "permanent" && theme === "light"
                    ? "bg-[#f5e4e3] text-[#bb3a33] border-l border-[#bb3a33]"
                    : selectedType === "permanent" && theme === "dark"
                    ? "bg-[#2d1e1b] text-[#af241c] border-l border-[#bb3a33]"
                    : "border-inputBorderColor"
                }`}
                onClick={() => setSelectedType("permanent")}
              >
                Permanent
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col space-y-[6px] md:space-y-2">
            <span className="text-sm md:text-base">
              Reason for Account Deactivation
            </span>
            <textarea
              name="reason"
              id="reason"
              className={cn(
                "flex w-full text-[13px] py-4 px-4 rounded-sm bg-transparent border border-inputBorderColor file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-placeholderColor focus-visible:outline-none focus-visible:border focus-visible:ring-[1px] focus-visible:ring-foreground focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
              )}
              placeholder="Enter your reason"
              rows={5}
            />
          </div>
          <div className="w-full flex flex-col space-y-[6px] md:space-y-2">
            <div className="flex justify-between">
              <span className="text-sm md:text-base">OTP Code</span>
              <span className="text-[11px] xs:text-xs md:text-sm text-mainColor italic underline cursor-pointer">Get OTP Code</span>
            </div>
            <div className="w-full">
              <InputOTP maxLength={5}>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
              </InputOTP>
            </div>
          </div>
        </div>
        <DialogFooter className="mt-4 md:mt-6">
          <DialogClose
            className="w-full px-[16px] py-[14px] lg:px-[20px] lg:py-[16px] xl:px-[22px] xl:py-[20px] bg-gradient-to-bl from-mainColor via-redMediumColor to-redDarkColor text-xs md:text-sm text-whiteColor rounded-full"
            onClick={() => setSelectedType("")}
          >
            Deactivate My Account
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeactiveModalAccount
