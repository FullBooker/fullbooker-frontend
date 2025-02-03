"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import Sidebar from "@/components/vendor/sidebar";
import { useTheme } from "next-themes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SecondaryNavbar from "@/components/vendor/navbar";
import Appbar from "@/components/vendor/appbar";

type VendorLayoutProps = {
  children: React.ReactNode;
};

const VendorLayout: FC<VendorLayoutProps> = ({ children }) => {
  const [open, setOpen] = useState(true);
  const searchParams = useSearchParams();
  const router = usePathname();
  const navigation = useRouter();
  const { theme = "light" } = useTheme();
  const [data, setData] = useState<string | null>(null);
  const [themeMode, setThemeMode] = useState("light");
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isPlayingGameOnMobile, setIsPlayingGameOnMobile] =
    useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width <= 1024);
      setOpen(width > 1024); // Keep open for desktops
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        (isMobile || isTablet) &&
        open
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open, isMobile, isTablet]);

  useEffect(() => {
    setThemeMode(theme);
  }, [theme]);

  return (
    <div className="flex h-fit w-full overflow-x-hidden bg-gray-100">
      <div className="h-fit" ref={sidebarRef}>
        <Sidebar
          theme={themeMode}
          open={open}
          onClose={() => setOpen(false)}
          isMobile={isMobile || isTablet}
        />
      </div>
      <div className="h-full w-full overflow-x-hidden bg-white px-4">
        {(isMobile || isTablet) && <Appbar open={open} setOpen={setOpen} />}
        <main className="h-fit mx-auto w-full overflow-x-hidden">
          <div className="h-full">
            <SecondaryNavbar />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default VendorLayout;
