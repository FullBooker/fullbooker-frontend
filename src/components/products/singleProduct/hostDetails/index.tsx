import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/shared/button";
import { ProductHost } from "@/domain/product";
import useDeviceType from "@/lib/hooks/useDeviceType";
import { DeviceType } from "@/domain/constants";
import { Star } from "lucide-react";

type HostDetailsProps = {
  productsRequestProcessing: boolean;
  host: ProductHost;
};

const HostDetails: FC<HostDetailsProps> = ({
  productsRequestProcessing,
  host,
}) => {
  const device = useDeviceType();
  return (
    <div>
      {productsRequestProcessing ? (
        <div className="flex flex-col md:flex-row gap-6 py-10 animate-pulse">
          {/* Left - Host Card */}
          <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center text-center w-full md:w-1/2">
            {/* Profile Image Shimmer */}
            <div className="w-24 h-24 bg-gray-300 rounded-full mb-4"></div>
            {/* Host Name Shimmer */}
            <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
            {/* Rating Shimmer */}
            <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
            {/* Message Shimmer */}
            <div className="h-3 w-48 bg-gray-300 rounded mb-1"></div>
            <div className="h-3 w-56 bg-gray-300 rounded"></div>
          </div>

          {/* Right - Host Details */}
          <div className="flex flex-col justify-start w-full md:w-1/2">
            <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 w-40 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 w-32 bg-gray-300 rounded mb-4"></div>

            {/* Button Shimmer */}
            <div className="h-10 w-full md:w-[50%] bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6 py-10 ">
          {/* Left - Host Card */}
          <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center text-center w-full md:w-1/2">
            {/* Profile Image */}
            <Image
              src="/assets/default-profile-picture-placeholder.jpg"
              className="w-24 h-24 rounded-full mb-4 object-cover"
              alt={"Host Profile Image"}
              width={device === DeviceType.mobile ? 50 : 50}
              height={device === DeviceType.mobile ? 50 : 50}
            />
            {/* Host Name */}
            <h2 className="text-xl font-semibold">
              {" "}
              {host?.user?.first_name
                ? `${host?.user?.first_name} ${host?.user?.last_name}`
                : "N/A"}
            </h2>
            {/* Rating */}
            <div className="flex space-x-1">
                      <Star
                        className="h-4 w-4"
                        fill="#E4A70A"
                        style={{
                          color: "#E4A70A",
                        }}
                      />
                      <Star
                        className="h-4 w-4"
                        fill="#E4A70A"
                        style={{
                          color: "#E4A70A",
                        }}
                      />
                      <Star
                        className="h-4 w-4"
                        fill="#E4A70A"
                        style={{
                          color: "#E4A70A",
                        }}
                      />
                      <Star
                        className="h-4 w-4"
                        fill="#E4A70A"
                        style={{
                          color: "#E4A70A",
                        }}
                      />
                      <Star
                        className="h-4 w-4"
                        fill="#DDDDDD"
                        style={{
                          color: "#DDDDDD",
                        }}
                      />
                    </div>
            {/* Message */}
            <p className="font-light mt-2">
              Thank you so much for considering this activity. Can't wait to see
              you.
            </p>
          </div>

          {/* Right - Host Details */}
          <div className="flex flex-col justify-start w-full md:w-1/2">
            <h3 className="text-lg font-semibold">Host details</h3>
            <p className="font-light mt-2">
              Response rate: <span className="font-light">100%</span>
            </p>
            <p className="font-light">Responds within an hour</p>

            {/* Button */}
            <Button
              extraClasses=""
              margin="mt-2"
              borderRadius="rounded-lg"
              text="w-full md:w-[60%] text-white"
            >
              Message Host
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostDetails;
