'use client'

import { usePathname } from "next/navigation"
import React from "react"

const useOutsideAlerter = (ref: any, setX: any, setOpen: any): void => {
  const handleClickOutside = React.useCallback(
    (event: any): void => {
      if (ref.current && !ref.current.contains(event.target)) {
        setX(false)
        setOpen(false)
      }
    },
    [ref, setX, setOpen]
  )

  React.useEffect(() => {
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [handleClickOutside])
}

const Profile = (props: {
  button: JSX.Element
  openState: boolean
  setOpenState: React.Dispatch<React.SetStateAction<boolean>>
  children: JSX.Element
  classNames: string
  animation?: string
}) => {
  const { button, openState, setOpenState, children, classNames, animation } =
    props

  const pathname = usePathname()
  const wrapperRef = React.useRef(null)
  const [openWrapper, setOpenWrapper] = React.useState(openState)
  useOutsideAlerter(wrapperRef, setOpenWrapper, setOpenState)

  React.useEffect(() => {
    setOpenState(false)
    setOpenWrapper(false)
  }, [pathname, setOpenState])

  return (
    <div ref={wrapperRef} className="relative flex">
      <div
        className="flex"
        onMouseDown={() => {
          setOpenWrapper(!openWrapper)
          setOpenState(!openState)
        }}
      >
        {button}
      </div>
      <div
        className={`${classNames} absolute z-10 ${
          animation
            ? animation
            : "origin-top-right sm:origin-top transition-all duration-300 ease-in-out"
        } ${openWrapper ? "scale-100" : "scale-0"}`}
      >
        {children}
      </div>
    </div>
  )
}

export default Profile
