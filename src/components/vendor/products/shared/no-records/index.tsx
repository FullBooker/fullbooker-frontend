"use client";

import React, { FC } from "react";
import Image from "next/image";
import useDeviceType from "@/lib/hooks/useDeviceType";
import { DeviceType } from "@/domain/constants";

type NoRecordsProps = {
  message: string;
};

const NoRecords: FC<NoRecordsProps> = ({ message }) => {
  const deviceType = useDeviceType();
  return (
    <div className="h-[500px] md:h-screen flex flex-col justify-center items-center text-center">
      <Image
        src="/assets/no-records.jpg"
        alt="No Records"
        width={deviceType === DeviceType.mobile ? 200 : 400}
        height={deviceType === DeviceType.mobile ? 200 : 400}
        className="mb-4"
      />
      <p className="text-xl font-semibold text-black">{message}</p>
    </div>
  );
};

export default NoRecords;
