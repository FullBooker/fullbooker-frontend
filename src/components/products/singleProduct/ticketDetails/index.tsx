import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/shared/button";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { Product } from "@/domain/product";
import { ChevronDown, ChevronDownCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type HostDetailsProps = {
  productsRequestProcessing: boolean;
  product: Product;
};

const HostDetails: FC<HostDetailsProps> = ({
  productsRequestProcessing,
  product,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedDate, setSelectedDate] = useState<any>();
  
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 w-full space-x-0 md:space-x-6 animate-pulse">
          {/* Ticket Selection */}
          <div className="mt-6 w-full">
            <div className="h-6 w-32 bg-gray-300 rounded mb-2"></div>
            <div className="w-full border-gray-500 border-b pb-1">
              <div className="space-y-2">
                <div className="h-4 w-20 bg-gray-300 rounded"></div>
                <div className="h-4 w-28 bg-gray-300 rounded"></div>
                <div className="h-4 w-32 bg-gray-300 rounded"></div>
                <div className="h-4 w-36 bg-gray-300 rounded"></div>
              </div>
              <div className="flex justify-end mt-2 mb-2">
                <div className="h-4 w-40 bg-gray-300 rounded"></div>
              </div>
            </div>
            <div className="py-3">
              <div className="w-full h-[300px] bg-gray-300 rounded-lg"></div>
            </div>
          </div>

          {/* Right Side */}
          <div className="w-full">
            {/* Date Selection */}
            <div className="mt-6">
              <div className="h-6 w-32 bg-gray-300 rounded mb-2"></div>
              <div className="w-full h-48 bg-gray-300 rounded-2xl"></div>
            </div>

            {/* Pricing Summary */}
            <div className="mt-6 rounded-2xl shadow-lg p-4 bg-gray-100">
              <div className="flex justify-center">
                <div className="w-[190px] h-[55px] bg-gray-300 rounded"></div>
              </div>

              <div className="space-y-4 px-4 md:px-8 py-4">
                <div className="h-4 w-40 bg-gray-300 rounded"></div>
                <div className="h-4 w-32 bg-gray-300 rounded"></div>
                <div className="h-4 w-28 bg-gray-300 rounded"></div>
                <div className="h-4 w-36 bg-gray-300 rounded"></div>
                <div className="h-10 w-full bg-gray-300 rounded-lg mt-2"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[60%_40%] w-full space-x-0 md:space-x-6">
          {/* Ticket Selection */}
          <div className="mt-6 w-full">
            <h3 className="text-lg font-semibold mb-2">Ticket 1</h3>
            <div className="w-full border-gray-500 border-b pb-1">
              <div className="space-y-2">
                <p>Ticket: </p>
                <p>Name: </p>
                <p>ID Number: </p>
                <p>Phone Number: </p>
              </div>
              <div className="flex justify-end mt-2 mb-2">
                <button className="mt-2 text-blue-500 text-right">
                  Add more tickets +
                </button>
              </div>
            </div>
            <div className="py-3">
              <Image
                src={`${product?.image?.file || "/assets/quad.png"}`}
                alt={"Event"}
                width={300}
                height={300}
                className="w-full h-[300px] object-cover rounded-lg"
              />
            </div>
          </div>
          <div className="w-full">
            {/* Date Selection */}
            <div className="mt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Select Date</h3>
                <div>
                  <ChevronDownCircle className="w-6 h-6 md:h-6 md:w-6" />
                </div>
              </div>
              <div className="w-full">
                <Calendar className="bg-white px-4 py-4 rounded-2xl shadow-lg w-full" />
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg space-y-4 px-4 md:px-8 py-4 pb-8">
              <div data-hide-on-theme="dark" className="flex justify-center">
                <Image
                  src="/assets/logo.svg"
                  alt="Fullbooker Logo"
                  width={238}
                  height={39.29}
                  className="w-[190px] h-[55px]"
                />
              </div>

              <div data-hide-on-theme="light" className="flex justify-center">
                <Image
                  src="/assets/logo_dark.png"
                  alt="MowinBet Logo"
                  width={238}
                  height={39.29}
                  className="w-[190px] h-[55px]"
                />
              </div>
              <p className="flex justify-between">
                Ticket price:{" "}
                <span className="font-semibold">KES 3,150.00</span>
              </p>
              <p className="flex justify-between">
                Number of Tickets: <span className="font-semibold">1.00</span>
              </p>
              <p className="flex justify-between">
                TAX: <span className="font-semibold">540.00</span>
              </p>
              <p className="flex justify-between">
                Total:{" "}
                <span className="text-green-500 font-bold">KES 3,690.00</span>
              </p>
              <Link href={"/products/checkout"}>
                <Button
                  extraClasses=""
                  margin="mt-4"
                  borderRadius="rounded-lg"
                  text="w-full font-medium"
                >
                  Proceed to checkout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default HostDetails;
