"use client";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { FC, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { RootState } from "@/store";
import { connect } from "react-redux";
import { ActiveGamePayload } from "@/domain/dto/input";

type DashboardLayoutProps = {
  children: React.ReactNode;
  activeGame: ActiveGamePayload;
};

const DashboardLayout: FC<DashboardLayoutProps> = ({
  children,
  activeGame,
}) => {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = usePathname();
  const { theme = "light" } = useTheme();
  const [data, setData] = useState<string | null>(null);
  const [themeMode, setThemeMode] = useState("light");
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isPlayingGameOnMobile, setIsPlayingGameOnMobile] =
    useState<boolean>(false);

  useEffect(() => {
    const isGamePage = router.startsWith("/crash-game/detail/");
    const isActiveGame = activeGame !== null;
    const isMobileDevice = isMobile;

    setIsPlayingGameOnMobile(isGamePage && isActiveGame && isMobileDevice);
  }, [router, activeGame, isMobile]);

  useEffect(() => {
    const handleResize = () => {
      const contentContainer = document.querySelector(".content-container");
      const sidebarContainer = document.querySelector(".sidebar-container");

      if (contentContainer && sidebarContainer) {
        const contentHeight = (contentContainer as HTMLElement).offsetHeight;
        (
          sidebarContainer as HTMLElement
        ).style.minHeight = `${contentHeight}px`;
      }
    };

    setTimeout(() => {
      handleResize();
    }, 500);
    window.addEventListener("resize", handleResize); // Listen for window resize events

    return () => {
      window.removeEventListener("resize", handleResize); // Clean up the event listener
    };
  }, [router, data, children]);

  useEffect(() => {
    window.addEventListener("resize", () =>
      window.innerWidth < 1280 ? setOpen(false) : setOpen(true)
    );
  }, []);

  useEffect(() => {
    const dataValue = searchParams.get("data");
    setData(dataValue || null);

    setOpen(window.innerWidth > 1280);
    setIsMobile(window.innerWidth < 1280);

    const handleResize = () => {
      setOpen(window.innerWidth > 1280);
      setIsMobile(window.innerWidth < 1280);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [searchParams]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        window.innerWidth < 1280 && // Check screen width is below "xl"
        open
      ) {
        setOpen(false); // Close the sidebar if click is outside of it
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open]);

  useEffect(() => {
    setThemeMode(theme);
  }, [theme]);

  return (
      <div className="flex h-fit w-full overflow-x-hidden">
        {/* Sidebar */}
        {/* <div className="h-fit" ref={sidebarRef}>
          {!data ? (
            <Sidebar
              theme={themeMode}
              open={open}
              onClose={() => setOpen(false)}
              isMobile={isMobile}
            />
          ) : (
            <></>
          )}
        </div> */}

        <div
          className={`h-full w-full overflow-x-hidden ${
            open && isMobile && themeMode === "dark"
              ? "bg-black opacity-30 z-40"
              : open && isMobile && themeMode === "light"
              ? "blur-sm bg-white opacity-30 z-40"
              : ""
          }`}
        >
          <main
            className={`h-fit mx-auto max-w-[1200px] w-full px-2 md:px-3 lg:px-4 overflow-x-hidden ${
              data
                ? "mt-7"
                : router === "/" || router.startsWith("/promotions/detail/")
                ? "xl:ml-56"
                : "xl:ml-56"
            } content-container`}
          >
            {/* Navbar */}
            {!data && !isPlayingGameOnMobile ? (
              <Navbar
                openNav={open}
                onOpenSideNav={() => setOpen(true)}
                isMobile={isMobile}
              />
            ) : (
              <></>
            )}

            <div className="h-full">{children}</div>

            {themeMode === "dark" ? (
              <Image
                src={`/assets/bg_effects.png`}
                className="fixed bottom-0 right-0 -z-20 opacity-40"
                alt="Background Effect"
                width={1000}
                height={1000}
              />
            ) : (
              <></>
            )}
              {/* Footer */}
          {!data && !isPlayingGameOnMobile ? (
            <Footer />
          ) : (
            <></>
          )}
          </main>
        
        </div>
      </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const { activeGame } = state.games;
  return { activeGame };
};

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardLayout);
