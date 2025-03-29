import React from "react";
import Skeleton from "@/components/ui/skeleton";
import useDeviceType from "@/lib/hooks/useDeviceType";
import { DeviceType } from "@/domain/constants";

const SalesPageShimmer = () => {
  const deviceType = useDeviceType();
  return (
    <div className="flex flex-col h-fit justify-center  py-2 md:px-6 md:py-3 bg-white">
      <div className="shadow-md overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              {Array.from({ length: 5 }).map((_, index) => (
                <th key={index} className="p-2 border-b border-r">
                  <Skeleton className="h-12 w-full" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10, }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({
                  length: 5,
                }).map((_, colIndex) => (
                  <td key={colIndex} className="p-2 border-b border-r">
                    <Skeleton className="h-8 w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-4">
        <Skeleton className="h-10 w-52" />
      </div>
    </div>
  );
};

export default SalesPageShimmer;
