import DeactiveModalAccount from "@/components/layout/modal/DeactiveModal";
import { useThemeMode } from "@/lib/hooks/useTheme";
import React from "react";

const DeactivateAccount = () => {
  const { themeMode } = useThemeMode();
  return (
    <div>
      <h1 className="text-lg md:text-xl lg:text-2xl font-medium">
        Deactivate Account
      </h1>
      <div className="md:w-3/4 lg:w-3/5 mt-1">
        <span className="text-[11px] md:text-[13px] text-textColor">
          Deactivate your account to take a break or say goodbye. Temporarily
          hide your profile or permanently delete it. Choose wisely, as
          permanent deactivation is irreversible.
        </span>
      </div>
      <div className="flex justify-start items-center mt-4 md:mt-3 lg:mt-4">
        <DeactiveModalAccount theme={themeMode} />
      </div>
    </div>
  );
};

export default DeactivateAccount;
