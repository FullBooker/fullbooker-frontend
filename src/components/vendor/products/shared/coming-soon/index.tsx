"use client";

import React from "react";
import Image from "next/image";
import useDeviceType from "@/lib/hooks/useDeviceType";
import { DeviceType } from "@/domain/constants";

const ComingSoon = () => {
  const deviceType = useDeviceType();
  return (
    <div className="h-screen grid place-items-center text-center">
      <div>
        <Image
          src="/assets/frustrated.jpg"
          alt="Fullbooker Logo"
          width={deviceType === DeviceType.mobile ? 200 : 400}
          height={deviceType === DeviceType.mobile ? 200 : 400}
        />
        <p className="text-xl font-semibold text-black">COMING SOON</p>
        <p className="text-kg font-bold text-primary">STAY TUNED</p>
      </div>
    </div>
  );
};

export default ComingSoon;
