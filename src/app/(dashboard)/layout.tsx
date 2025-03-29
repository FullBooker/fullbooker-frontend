"use client";

import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { FC, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { RootState } from "@/store";
import { connect } from "react-redux";
import { ModalID } from "@/domain/components";
import UniversalModal from "@/components/layout/modal/UniversalModal";
import LoginModalContent from "@/components/views/auth/login";
import RegisterModalContent from "@/components/views/auth/register";
import ForgotPasswordModalContent from "@/components/views/auth/forgotPassword";
import PhoneOtpVerificationModalContent from "@/components/views/auth/phoneOTPVerification";
import ChangePasswordModalContent from "@/components/views/auth/changePassword";
import EmailOtpVerificationModalContent from "@/components/views/auth/emailOTPVerification";
import PasswordResetSuccessfullModal from "@/components/views/auth/passwordResetSuccessfull";
import { NotificationType } from "@/domain/notification";
import SessionExpiredModal from "@/components/views/auth/sessionExpired";
import PaymentSuccessfullModal from "@/components/products/singleProduct/modals/successfullPayment/index";
import BottomNavBar from "@/components/layout/bottomNavbar";
import ComprehensiveProductFilters from "@/components/products/homePage/comprehensiveProductFilters";
import { CustomeEvents } from "@/constants";
import useDeviceType from "@/lib/hooks/useDeviceType";
import { DeviceType } from "@/domain/constants";

type DashboardLayoutProps = {
  children: React.ReactNode;
  modalId: ModalID;
  message: String;
  type: NotificationType;
  sessionHasExpired: boolean;
  isLoggedIn: boolean;
  signOut: () => void;
};

const DashboardLayout: FC<DashboardLayoutProps> = ({
  children,
  modalId,
  isLoggedIn,
}) => {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = usePathname();
  const navigation = useRouter();
  const { theme = "light" } = useTheme();
  const [themeMode, setThemeMode] = useState("light");
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [shouldRedirectToHostView, setShouldRedirectToHostView] =
    useState<boolean>(false);

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
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [router, children]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        window.innerWidth < 1280 &&
        open
      ) {
        setOpen(false);
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

  useEffect(() => {
    const handleSwitchedToHosting = async (event: any) => {
      navigation.push("/vendor");
    };

    const handleSuccessfulAuth = async (event: any) => {
      const redirect = searchParams?.get("redirect");
      if (redirect) {
        navigation.push(`/${redirect}`);
      }
    };

    document.addEventListener(
      CustomeEvents.switchedToHostingSuccessfullEvent,
      handleSwitchedToHosting
    );

    document.addEventListener(
      CustomeEvents.successfullUserAuthentication,
      handleSuccessfulAuth
    );

    return () => {
      document.removeEventListener(
        CustomeEvents.switchedToHostingSuccessfullEvent,
        handleSwitchedToHosting
      );

      document.removeEventListener(
        CustomeEvents.successfullUserAuthentication,
        handleSuccessfulAuth
      );
    };
  }, []);

  useEffect(() => {
    if (shouldRedirectToHostView && isLoggedIn) {
      navigation.push("/vendor");
    }
  }, [isLoggedIn]);

  const deviceType = useDeviceType();

  return (
    <div className="flex h-fit w-full overflow-x-hidden">
      <div
        className="h-fit lg:hidden xl:hidden md:flex xs:hidden"
        ref={sidebarRef}
      >
        <Sidebar
          theme={themeMode}
          open={open}
          onClose={() => setOpen(false)}
          isMobile={deviceType === DeviceType.mobile}
        />
      </div>

      <div
        className={`h-full w-full overflow-x-hidden ${
          open && deviceType === DeviceType.mobile && themeMode === "dark"
            ? "bg-black opacity-30 z-40"
            : open && deviceType === DeviceType.mobile && themeMode === "light"
            ? "blur-sm bg-white opacity-30 z-40"
            : ""
        }`}
      >
        <main
          className={`h-fit mx-auto w-full overflow-x-hidden mt-0 md:mt-12 content-container`}
        >
          {deviceType !== DeviceType.mobile ? (
            <Navbar
              openNav={open}
              onOpenSideNav={() => setOpen(true)}
              isMobile={false}
              setShouldRedirectToHostView={setShouldRedirectToHostView}
            />
          ) : (
            <></>
          )}

          <div className="h-full ">{children}</div>

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
          <Footer />
        </main>
      </div>
      {modalId === ModalID.login && (
        <UniversalModal
          theme={themeMode}
          open={true}
          content={<LoginModalContent />}
          fullScreen={deviceType === DeviceType.mobile ? true : false}
        />
      )}
      {modalId === ModalID.register && (
        <UniversalModal
          theme={themeMode}
          open={true}
          content={<RegisterModalContent />}
          fullScreen={deviceType === DeviceType.mobile ? true : false}
        />
      )}
      {modalId === ModalID.forgotPassword && (
        <UniversalModal
          theme={themeMode}
          open={true}
          content={<ForgotPasswordModalContent />}
        />
      )}
      {modalId === ModalID.phoneOTPVerification && (
        <UniversalModal
          theme={themeMode}
          open={true}
          content={<PhoneOtpVerificationModalContent />}
        />
      )}
      {modalId === ModalID.emailOTPVerification && (
        <UniversalModal
          theme={themeMode}
          open={true}
          content={<EmailOtpVerificationModalContent />}
        />
      )}
      {modalId === ModalID.changePassword && (
        <UniversalModal
          theme={themeMode}
          open={true}
          content={<ChangePasswordModalContent />}
        />
      )}
      {modalId === ModalID.passwordResetSuccessfull && (
        <UniversalModal
          theme={themeMode}
          open={true}
          content={<PasswordResetSuccessfullModal />}
        />
      )}
      {modalId === ModalID.sessionExpired && (
        <UniversalModal
          theme={themeMode}
          open={true}
          content={<SessionExpiredModal />}
        />
      )}
      {modalId === ModalID.successfullPayment && (
        <UniversalModal
          theme={themeMode}
          open={true}
          content={<PaymentSuccessfullModal />}
        />
      )}
      {modalId === ModalID.comprehensiveProductFilters && (
        <ComprehensiveProductFilters />
      )}
      <BottomNavBar />
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const { message, type } = state.alert;
  const { sessionHasExpired, isLoggedIn } = state.authentication;
  const { modalId } = state.components;
  return { modalId, message, type, sessionHasExpired, isLoggedIn };
};

const mapDispatchToProps = (dispatch: any) => ({
  signOut: () => dispatch.authentication.signOut(),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardLayout);
