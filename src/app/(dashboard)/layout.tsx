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
import { ModalID } from "@/domain/components";
import UniversalModal from "@/components/modal/UniversalModal";
import LoginModalContent from "@/components/views/auth/login";
import RegisterModalContent from "@/components/views/auth/register";
import ForgotPasswordModalContent from "@/components/views/auth/forgotPassword";
import PhoneOtpVerificationModalContent from "@/components/views/auth/phoneOTPVerification";
import ChangePasswordModalContent from "@/components/views/auth/changePassword";
import EmailOtpVerificationModalContent from "@/components/views/auth/emailOTPVerification";
import PasswordResetSuccessfullModal from "@/components/views/auth/passwordResetSuccessfull";
import { NotificationType } from "@/domain/notification";
import SessionExpiredModal from "@/components/views/auth/sessionExpired";
import PaymentSuccessfullModal from "@/components/products/singleProduct/modals/successfullPayment/index"
// import { useGoogleOneTap } from "@/lib/hooks/useGoogleAuth";


type DashboardLayoutProps = {
  children: React.ReactNode;
  modalId: ModalID;
  message: String;
  type: NotificationType;
  sessionHasExpired: boolean;
  isLoggedIn: boolean;
};

const DashboardLayout: FC<DashboardLayoutProps> = ({
  children,
  modalId,
  message,
  type,
  sessionHasExpired,
  isLoggedIn,
}) => {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = usePathname();
  const navigation = useRouter();
  const { theme = "light" } = useTheme();
  const [data, setData] = useState<string | null>(null);
  const [themeMode, setThemeMode] = useState("light");
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isPlayingGameOnMobile, setIsPlayingGameOnMobile] =
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

  useEffect(() => {
    const flow = searchParams.get("user_flow");
    if (
      flow &&
      flow === "vendor" &&
      type === NotificationType.success &&
      message === "Switched to hosting successfully!"
    ) {
      navigation.push("/vendor");
    }

    if (
      type === NotificationType.success &&
      message === "Switched to hosting successfully!"
    ) {
      navigation.push("/vendor");
    }
  }, [message, type]);

  // useGoogleOneTap();

  return (
    <div className="flex h-fit w-full overflow-x-hidden bg-gray-100">
      {/* Sidebar */}
      <div
        className="h-fit lg:hidden xl:hidden md:flex xs:hidden"
        ref={sidebarRef}
      >
        <Sidebar
          theme={themeMode}
          open={open}
          onClose={() => setOpen(false)}
          isMobile={isMobile}
        />
      </div>

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
          className={`h-fit mx-auto w-full overflow-x-hidden mt-12 content-container`}
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
          {/* Footer */}
          {!data && !isPlayingGameOnMobile ? <Footer /> : <></>}
        </main>
      </div>
      {modalId === ModalID.login && (
        <UniversalModal
          theme={themeMode}
          open={true}
          content={<LoginModalContent />}
        />
      )}
      {modalId === ModalID.register && (
        <UniversalModal
          theme={themeMode}
          open={true}
          content={<RegisterModalContent />}
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
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const { message, type } = state.alert;
  const { sessionHasExpired, isLoggedIn } = state.authentication;
  const { modalId } = state.components;
  return { modalId, message, type, sessionHasExpired, isLoggedIn };
};

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardLayout);
