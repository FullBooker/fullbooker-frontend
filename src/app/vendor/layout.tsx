"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import Sidebar from "@/components/vendor/sidebar";
import { useTheme } from "next-themes";
import SecondaryNavbar from "@/components/vendor/navbar";
import Appbar from "@/components/vendor/appbar";
import Withdrawal from "@/components/vendor/wallet/withdrawal";
import UniversalModal from "@/components/layout/modal/UniversalModal";
import { connect } from "react-redux";
import { Dispatch, RootState } from "@/store";
import { ModalID } from "@/domain/components";
import NewPaymentMethodForm from "@/components/vendor/wallet/newPaymentMethod";
import useDeviceType from "@/lib/hooks/useDeviceType";
import { DeviceType } from "@/domain/constants";
import LoginModalContent from "@/components/views/auth/login";

type VendorLayoutProps = {
  children: React.ReactNode;
  modalId: ModalID;
};

const VendorLayout: FC<VendorLayoutProps> = ({ children, modalId }) => {
  const [open, setOpen] = useState(true);
  const { theme = "light" } = useTheme();
  const [themeMode, setThemeMode] = useState("light");
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const deviceType = useDeviceType();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width <= 1024);
      setOpen(width > 1024);
    };

    handleResize();
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
      <div className="h-full w-full overflow-x-hidden bg-gray-50">
        {(isMobile || isTablet) && <Appbar open={open} setOpen={setOpen} />}
        <main className="h-fit mx-auto w-full overflow-x-hidden">
          <div className="h-full">
            <SecondaryNavbar />
            {children}
          </div>
        </main>
      </div>
      {modalId === ModalID.vendorWalletWithdrawal && (
        <UniversalModal
          theme={themeMode}
          open={true}
          content={<Withdrawal />}
        />
      )}
      {modalId === ModalID.vendorWalletWithdrawal && (
        <UniversalModal
          theme={themeMode}
          open={true}
          content={<Withdrawal />}
        />
      )}
      {modalId === ModalID.vendorNewPaymentMethodForm && (
        <UniversalModal
          theme={themeMode}
          open={true}
          content={<NewPaymentMethodForm />}
        />
      )}
      {modalId === ModalID.login && (
        <UniversalModal
          theme={themeMode}
          open={true}
          content={<LoginModalContent sessionExpired />}
          fullScreen={deviceType === DeviceType.mobile ? true : false}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const { modalId } = state.components;
  return {
    modalId,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(VendorLayout);
