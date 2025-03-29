import { DeviceType } from "@/domain/constants";
import { useState, useEffect } from "react";

const useDeviceType = () => {
  const [device, setDevice] = useState<
    DeviceType.mobile | DeviceType.tablet | DeviceType.desktop
  >(DeviceType.desktop);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDevice(DeviceType.mobile);
      } else if (width >= 768 && width <= 1024) {
        setDevice(DeviceType.tablet);
      } else {
        setDevice(DeviceType.desktop);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return device;
};

export default useDeviceType;
