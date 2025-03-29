"use client"

import { CalendarDays, LucideProps } from "lucide-react"
import moment from "moment"

const NotificationItem = (props: {
  theme: string | undefined
  icon: React.ReactElement<LucideProps>
  title: JSX.Element
  info?: string
  date?: Date | string
}) => {
  const { theme, icon, title, info, date } = props
  return (
    <div className="flex items-center gap-[10px]">
      <div
        className={`${
          theme === "light" ? "bg-lightRedColor" : "bg-redDarkColor2"
        } p-2 rounded-[5px] h-fit`}
      >
        {icon}
      </div>
      <div className="flex flex-col gap-1 text-sm">
        {title}
        <div className="flex items-center text-textColor text-xs gap-1">
          <CalendarDays className="w-3 h-3 sm:w-4 sm:h-4 xl:w-5 xl:h-5" />
          <span className="text-[11px] sm:text-xs md:text-sm">{moment(date).format('l')}</span>
          <span className="text-[11px] sm:text-xs md:text-sm">&bull;</span>
          <span className="text-[11px] sm:text-xs md:text-sm">{info}</span>
        </div>
      </div>
    </div>
  )
}

export default NotificationItem
