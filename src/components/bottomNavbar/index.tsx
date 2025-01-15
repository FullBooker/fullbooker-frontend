import React, { useState } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { useRouter } from "next/navigation";

import { HomeIcon, GiftIcon, Headphones, UserCircle } from "lucide-react";

const BottomNavBar = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const router = useRouter();

  return (
    <div className="lg:hidden md:hidden">
      <BottomNavigation
        value={value}
        onChange={handleChange}
        showLabels
        sx={{
          width: "100%",
          position: "fixed",
          bottom: 0,
          left: 0,
          background: "rgba(0,0,0,0.95)",
          // opacity: 0.80,
          color: "#fff",
        }}
      >
        <BottomNavigationAction
          label="Home"
          icon={<HomeIcon />}
          onClick={() => router.push("/")}
          sx={{ color: "#fff" }}
          className="bottom-nav-link"
        />
        <BottomNavigationAction
          label="Promotions"
          icon={<GiftIcon />}
          onClick={() => router.push("/main-menu/promotions")}
          sx={{ color: "#fff" }}
          className="bottom-nav-link"
        />
        <BottomNavigationAction
          label="Support"
          icon={<Headphones />}
          onClick={() => router.push("/cms/detail/contact-us")}
          sx={{ color: "#fff" }}
          className="bottom-nav-link"
        />
        <BottomNavigationAction
          label="Profile"
          icon={<UserCircle />}
          onClick={() => router.push("/profile")}
          sx={{ color: "#fff" }}
          className="bottom-nav-link"
        />
      </BottomNavigation>
    </div>
  );
};

export default BottomNavBar;
