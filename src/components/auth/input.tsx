import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full text-xs lg:text-sm xl:text-base py-3 px-4 rounded-sm md:rounded-md lg:rounded-lg xl:rounded-xl lg:py-3 lg:px-4 xl:py-4 xl:px-5 bg-transparent border-2 border-inputBorderColor file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-placeholderColor focus-visible:outline-none focus-visible:border-2 focus-visible:ring-[1.5px] focus-visible:ring-foreground focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
          // error ? "border-red-500" : "",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
