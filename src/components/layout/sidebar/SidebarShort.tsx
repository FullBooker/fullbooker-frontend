"use client"

import { SIDENAV_ITEMS } from "@/constants"
import { SideNavItem } from "@/types"
import { ChevronUp, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import LogoutButton from "@/components/layout/sidebar/components/LogoutButton"

const SidebarShort = ({
  theme,
  open,
  onClose,
}: {
  theme: string | undefined
  open: boolean
  onClose: React.MouseEventHandler<HTMLSpanElement>
}) => {

  return (
    <div
      className={`w-72 hidden xl:block duration-175 linear h-fit absolute !z-50 bg-sidebarColor transition-all border-r-[1px] ${
        theme === "light" ? "border-strokeColor2" : "border-strokeColor"
      } lg:!z-50 xl:!z-50 2xl:!z-0 sidebar-container ${
        open ? "translate-x-0" : "-translate-x-96"
      }`}
    >
      <span
        className="absolute top-4 right-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <X className="w-4 h-4" />
      </span>
      <div className={`flex flex-col justify-between h-full -mb-6`}>
        <div className="flex-grow">
          <div className="mx-6 mt-12 mb-5">
            <Link href="/">
              <div data-hide-on-theme="dark">
                <Image
                  src="/assets/logo_light.png"
                  alt="Fullbooker Logo"
                  width={238}
                  height={39.29}
                  className="w-[190px] h-[55px]"
                />
              </div>

              <div data-hide-on-theme="light">
                <Image
                  src="/assets/logo_dark.png"
                  alt="Fullbooker Logo"
                  width={238}
                  height={39.29}
                  className="w-[190px] h-[55px]"
                />
              </div>
            </Link>
          </div>

          <div className="flex flex-col space-y-5">
            {SIDENAV_ITEMS.map((item, idx) => {
              return <MenuItem key={idx} item={item} />
            })}
          </div>
        </div>
        <div className="px-6 pb-7 pt-5">
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}

export default SidebarShort

const MenuItem = ({ item }: { item: SideNavItem }) => {
  const { theme = "light" } = useTheme()
  const [themeMode, setThemeMode] = useState("light")
  const pathname = usePathname()
  const [subMenuOpen, setSubMenuOpen] = useState(true)
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen)
  }

  useEffect(() => {
    setThemeMode(theme)
  }, [theme])

  return (
    <div className="">
      {item.submenu ? (
        <>
          <button
            onClick={toggleSubMenu}
            className={`flex flex-row items-center py-2 px-6 rounded-lg w-full justify-between ${
              subMenuOpen ? "mb-2" : ""
            }`}
          >
            <div className="flex flex-row space-x-4 items-center">
              {item.icon}
              <span className="font-semibold text-base flex">{item.title}</span>
            </div>

            <div className={`${subMenuOpen ? "rotate-180" : ""} flex`}>
              <ChevronUp width={24} height={24} />
            </div>
          </button>

          {subMenuOpen && (
            <div className="flex flex-col space-y-4 items-start">
              {item.subMenuItems?.map((subItem, idx) => {
                return (
                  <div
                    key={idx}
                    className={`${
                      item.path + subItem.path === pathname
                        ? "px-4 w-full"
                        : "px-4 w-full"
                    }`}
                  >
                    <Link href={item.path + subItem.path}>
                      <div
                        className={`flex flex-row space-x-4 items-center ${
                          item.path + subItem.path === pathname
                            ? `opacity-100 py-4 px-3 rounded-md ${
                                themeMode === "light"
                                  ? "bg-[#e1e1e1]"
                                  : "bg-[#282626]"
                              }`
                            : `opacity-70 py-4 px-3 hover:rounded-md ${
                                themeMode === "light"
                                  ? "hover:bg-[#e1e1e1]"
                                  : "hover:bg-[#282626]"
                              }`
                        }`}
                      >
                        {subItem.icon}
                        <span className="font-normal text-sm">
                          {subItem.title}
                        </span>
                      </div>
                    </Link>
                    <div
                      className={`${
                        item.path + subItem.path === pathname ? "" : ""
                      }`}
                    ></div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-row items-center py-2 px-6 w-full justify-between">
          <Link
            href={item.path}
            className={`flex flex-row space-x-4 items-center ${
              item.path === pathname
                ? "border-b-[3px] border-b-mainColor pb-3 w-1/2"
                : ""
            }`}
          >
            {item.icon}
            <span className="font-light text-base flex">{item.title}</span>
          </Link>
        </div>
      )}
    </div>
  )
}
