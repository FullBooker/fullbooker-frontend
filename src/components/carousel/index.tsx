import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTheme } from "next-themes"
import React, { useEffect, useState } from "react"

const Carousel = (props: {
  children: JSX.Element[]
  autoSlide: boolean
  autoSlideInterval?: number
}) => {
  const { children, autoSlide = false, autoSlideInterval = 5000 } = props
  const { theme = "light" } = useTheme()
  const [curr, setCurr] = useState(0)
  const [themeMode, setThemeMode] = useState("light")

  useEffect(() => {
    setThemeMode(theme)
  }, [theme])

  useEffect(() => {
   if (!autoSlide) return
   const slideInterval = setInterval(next, autoSlideInterval)
   return () => clearInterval(slideInterval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const prev = () =>
    setCurr((curr) => (curr === 0 ? children.length - 1 : curr - 1))
  const next = () =>
    setCurr((curr) => (curr === children.length - 1 ? 0 : curr + 1))

  return (
    <div className="flex flex-col gap-2 md:gap-4">
      <div className="overflow-hidden relative w-full rounded-[20px] md:rounded-[28px] lg:rounded-[36px]">
        <div
          className="flex transition-transform ease-out duration-500"
          style={{ transform: `translateX(-${curr * 100}%)` }}
        >
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-between p-5">
          <button onClick={prev}>
            <ChevronLeft className="sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white" />
          </button>
          <button onClick={next}>
            <ChevronRight className="sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white" />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        {children.map((_, i) => (
          <div
            key={i}
            className={`transition-all h-[6px] w-7 md:w-8 md:h-2 lg:w-10 ${
              themeMode === "light" ? "bg-[#D3D3D3]" : "bg-[#282828]"
            } rounded-full ${
              curr === i
                ? "w-[68px] md:w-[74px] lg:w-20 bg-gradient-to-bl from-mainColor via-redMediumColor to-redDarkColor"
                : `${themeMode === "light" ? "bg-[#D3D3D3]" : "bg-[#282828]"}`
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default Carousel
