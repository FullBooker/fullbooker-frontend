"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { Moon, SunMedium } from "lucide-react"
import { useThemeToggle } from "../useThemeToggle"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => {
  const { setTheme } = useTheme()
  const initialChecked = useThemeToggle();
  const [checked, setChecked] = React.useState(false)

  React.useEffect(() => {
    setChecked(initialChecked);
  }, [initialChecked]);

  return (
    <SwitchPrimitives.Root
  className={cn(
    "peer inline-flex justify-between ps-0.5 w-[60px] h-7 sm:ps-0.5 sm:w-[60px] sm:h-7 md:ps-0.5 md:pe-0 md:w-[70px] md:h-8 lg:ps-1 lg:pe-0.5 lg:w-[84px] lg:h-9 xl:ps-1 xl:w-[104px] xl:h-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-switchBorder transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-switchBackground data-[state=unchecked]:bg-input",
    className
  )}
  {...props}
  checked={checked}
  onCheckedChange={() => {
    setTheme(`${checked ? "dark" : "light"}`);
    setChecked(!checked);
  }}
  ref={ref}
>
  <>
    {checked && (
      <>
        <Moon
          width={16}
          height={16}
          color="#fff"
          className="ms-1 w-[14px] h-[14px] sm:ms-1 sm:w-[14px] sm:h-[14px] md:w-[16px] md:h-[16px] md:ms-1.5 lg:w-[20px] lg:h-[20px] lg:ms-1.5 xl:w-[26px] xl:h-[26px] xl:ms-1.5"
        />
      </>
    )}
  </>
  <SwitchPrimitives.Thumb
    className={cn(
      "pointer-events-none flex items-center justify-center h-6 w-6 sm:h-6 sm:w-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-10 xl:h-10 rounded-full p-1 sm:p-1 md:p-1.5 lg:p-1.5 bg-gradient-to-l from-mainColor via-redMediumColor to-redDarkColor shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-0 lg:data-[state=unchecked]:translate-x-0 xl:data-[state=unchecked]:translate-x-0"
    )}
  >
    {checked ? (
      <>
        <SunMedium
          width={32}
          height={32}
          color="#fff"
          className="w-[14px] h-[14px] sm:w-[14px] sm:h-[14px] md:w-[36px] md:h-[36px] lg:w-[26px] lg:h-[26px]"
        />
      </>
    ) : (
      <>
        <Moon
          width={32}
          height={32}
          color="#fff"
          className="w-[14px] h-[14px] sm:w-[14px] sm:h-[14px] md:w-[36px] md:h-[36px] lg:w-[26px] lg:h-[26px]"
        />
      </>
    )}
  </SwitchPrimitives.Thumb>
  <>
    {!checked && (
      <>
        <SunMedium
          width={16}
          height={16}
          color="#fff"
          className="w-[14px] h-[14px] me-1 sm:w-[14px] sm:h-[14px] sm:me-1 md:w-[16px] md:h-[16px] md:me-1.5 lg:w-[20px] lg:h-[20px] lg:me-1.5 xl:w-[26px] xl:h-[26px] xl:me-1.5"
        />
      </>
    )}
  </>
</SwitchPrimitives.Root>
  )
})
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
