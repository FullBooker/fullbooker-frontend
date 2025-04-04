import React, { FC, useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Briefcase, Home, Ticket, UserRound } from "lucide-react";
import Link from "next/link";
import { connect } from "react-redux";
import { ModalID } from "@/domain/components";
import { RootState } from "@/store";
import useAuth from "@/lib/hooks/useAuth";
import { AUTH_TOKEN_KEY, getToken } from "@/utilities";
import Cookies from "js-cookie";
import { SwitchToHostPayload } from "@/domain/dto/input";
import { AuthData } from "@/domain/dto/output";

type BottomNavTab = {
  title: string;
  icon: JSX.Element;
  path: string;
  requiresAuth?: boolean;
};

type BottomNavBarProps = {
  setActiveModal: (modalId: ModalID) => void;
  switchToHost: (payload: SwitchToHostPayload) => Promise<boolean>;
  authData: AuthData;
  isLoggedIn: boolean;
};

const BottomNavBar: FC<BottomNavBarProps> = ({
  setActiveModal,
  switchToHost,
  authData,
  isLoggedIn,
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { authenticated } = useAuth();
  const router = useRouter();
  const bottoNavTabs: Array<BottomNavTab> = [
    {
      title: "Home",
      icon: <Home />,
      path: "/",
    },
    {
      title: "Tickets",
      icon: <Ticket />,
      path: "/tickets",
      requiresAuth: true,
    },
    {
      title: "Hosting",
      icon: <Briefcase />,
      path: "/vendor",
      requiresAuth: true,
    },
    {
      title: "Profile",
      icon: <UserRound />,
      path: "/profile",
      requiresAuth: true,
    },
  ];
  const [authToken, setAuthToken] = useState<string | null>(getToken());

  const handleSwitchToHost = async () => {
    const shouldRedirectToHostSide = await switchToHost({
      user: authData?.user?.id,
    } as SwitchToHostPayload);
    if (shouldRedirectToHostSide) {
      router.push("/vendor");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const currentToken = Cookies.get(AUTH_TOKEN_KEY);
      if (currentToken !== authToken) {
        setAuthToken(currentToken as string);
      }
    }, 500);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken]);

  return (
    <div className="lg:hidden md:hidden">
      <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 pt-2 ">
        <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
          {bottoNavTabs.map((navTab: BottomNavTab, index: number) => (
            <span
              key={index}
              className={`px-5 text-base ${
                pathname === navTab.path
                  ? "text-primary group-hover:opacity-40"
                  : "text-gray-400 group-hover:opacity-40"
              }`}
            >
              {navTab.requiresAuth && !authenticated ? (
                <button
                  type="button"
                  className="inline-flex flex-col items-center justify-center"
                  onClick={() => {
                    const newSearchParams = new URLSearchParams(
                      searchParams.toString()
                    );
                    newSearchParams.set("redirect", navTab.path);
                    router.push(`${pathname}?${newSearchParams.toString()}`);
                    setActiveModal(ModalID.login);
                  }}
                >
                  <span>{navTab.icon}</span>
                  <span className="text-xs">{navTab.title}</span>
                </button>
              ) : navTab.path === "/vendor" ? (
                <button
                  type="button"
                  className="inline-flex flex-col items-center justify-center"
                  onClick={async () => {
                    if (isLoggedIn && authToken) {
                      handleSwitchToHost();
                    } else {
                      router.push(`${pathname}?redirect=vendor`);
                      setActiveModal(ModalID.login);
                    }
                  }}
                >
                  <span>{navTab.icon}</span>
                  <span className="text-xs">{navTab.title}</span>
                </button>
              ) : (
                <Link
                  href={navTab.path}
                  className="inline-flex flex-col items-center justify-center "
                >
                  <span>{navTab.icon}</span>
                  <span className="text-xs">{navTab.title}</span>
                </Link>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const { authData, isLoggedIn } = state.authentication;
  return {
    state,
    authData,
    isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  setActiveModal: (modalId: ModalID) =>
    dispatch.components.setActiveModal(modalId),
  switchToHost: (payload: SwitchToHostPayload) =>
    dispatch.authentication.switchToHost(payload),
});

export default connect(mapStateToProps, mapDispatchToProps)(BottomNavBar);
