import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/shared/button";

type HostDetailsProps = {
  productsRequestProcessing: boolean;
};

const HostDetails: FC<HostDetailsProps> = ({ productsRequestProcessing }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
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
              width={isMobile ? 50 : 50}
              height={isMobile ? 50 : 50}
            />
            {/* Host Name */}
            <h2 className="text-xl font-semibold">Kelvin Laichen</h2>
            {/* Rating */}
            <p className="text-lg font-bold">★★★★★</p>
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
              text="w-full md:w-[60%]"
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
