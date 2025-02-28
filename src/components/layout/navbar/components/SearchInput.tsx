import * as React from "react"

import { cn } from "@/lib/utils"
import { Search } from "lucide-react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    theme?: string | undefined;
  }

const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, theme, ...props }, ref) => {
    return (
      <div className="hidden lg:block md:block relative">
        <input
          type={type}
          className={cn( theme === 'light' ? 'border border-strokeColor2' : 'border border-inputBorderColor',
            "flex w-[160px] xs:w-44 sm:w-52 md:w-56 lg:w-64 rounded-full text-[#8F8F8F] bg-background px-3 py-[10px] sm:px-4 sm:py-3 md:px-5 md:py-3 text-xs sm:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 z-auto",
            className
          )}
          placeholder="Search game"
          ref={ref}
          {...props}
        />
        <div className={`absolute inset-y-0 right-0 ps-2 pr-3.5 sm:mb-0 lg:pr-4 xl:pr-5 flex items-center bg-background border-l-0 ${theme === 'light' ? 'border border-strokeColor2' : 'border border-inputBorderColor'} rounded-r-full`}>
          <Search className="w-4 h-4 sm:w-5 sm:h-5 xl:w-5 xl:h-5 text-[#8F8F8F]" />
        </div>
      </div>
    )
  }
)
SearchInput.displayName = "SearchInput"

export { SearchInput }
