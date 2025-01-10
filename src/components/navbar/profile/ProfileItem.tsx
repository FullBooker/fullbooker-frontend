'use client'

import React, { useState } from "react"
import { ChevronRight, LucideProps } from "lucide-react"
import Link from "next/link"

const ProfileItem = (props: {
  theme: string | undefined
  icon: React.ReactElement<LucideProps>
  text: string
  href: string
  onItemClick?: () => void;
}) => {
  const { theme, icon, text, href, onItemClick } = props

  return (
    <Link
      href={href}
      onClick={onItemClick}
      className={`w-full flex py-[10px] px-[8px] sm:py-[14px] sm:px-[12px] border-[1.5px] rounded-[10px] sm:rounded-[15px] gap-[32px] justify-between text-[13px] hover:opacity-40 ${
        theme === "light" ? "border-strokeColor2" : "border-inputBorderColor"
      }`}
    >
      <div className="flex gap-2 items-center">
        {icon}
        <span className="text-[10px] sm:text-xs font-medium">{text}</span>
      </div>
      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
    </Link>
  )
}

export default ProfileItem
