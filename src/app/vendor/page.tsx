"use client";

import { CarouselApi } from "@/components/ui/carousel";
import { useTheme } from "next-themes";
import React, { FC, useEffect, useState } from "react";
import { connect } from "react-redux";
import { RootState } from "@/store";
import "react-loading-skeleton/dist/skeleton.css";
import { ModalID } from "@/domain/components";
import VendorLayout from "./layout";
import { withAuth } from "../../components/views/dash/authGuard";
import { ArrowLeft, ArrowRight, ChevronRight, Search } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import Button from "@/components/shared/button";

type VendorPageProps = {
  isLoggedIn: boolean;
  setActiveModal: (modalId: ModalID) => void;
};

const VendorPage: FC<VendorPageProps> & { layout: any } = ({
  isLoggedIn,
  setActiveModal,
}) => {
  const { theme = "light" } = useTheme();
  const [themeMode, setThemeMode] = useState("light");
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const slides = [
    "/assets/img_banner1.png",
    "/assets/img_banner1.png",
    "/assets/img_banner1.png",
    "/assets/img_banner1.png",
  ];
  const [activeTab, setActiveTab] = useState("all");

  const revenueData = [
    {
      name: "Monday",
      "Quad Biking": 15000,
      "Bicycle riding": 12000,
      Swimming: 8000,
    },
    {
      name: "Tuesday",
      "Quad Biking": 18000,
      "Bicycle riding": 15000,
      Swimming: 10000,
    },
    {
      name: "Wednesday",
      "Quad Biking": 16000,
      "Bicycle riding": 5000,
      Swimming: 9000,
    },
    {
      name: "Thursday",
      "Quad Biking": 17000,
      "Bicycle riding": 14000,
      Swimming: 10000,
    },
    {
      name: "Friday",
      "Quad Biking": 15000,
      "Bicycle riding": 12000,
      Swimming: 11000,
    },
    {
      name: "Saturday",
      "Quad Biking": 18000,
      "Bicycle riding": 14000,
      Swimming: 10000,
    },
    {
      name: "Sunday",
      "Quad Biking": 22000,
      "Bicycle riding": 0,
      Swimming: 0,
    },
  ];

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useEffect(() => {
    setThemeMode(theme);
  }, [theme]);

  return (
    <div className="w-full min-h-screen">
      <div className="md:p-6 space-y-6">
        <div className="col-span-2 grid md:grid-cols-2 gap-6">
          <div className="grid grid-cols-1 gap-6">
            <h2 className="text-xl text-gray-600 mb-4">Total Balance</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">KES 240,390.0</h3>
                <Button
                  margin="m-0"
                  bg="bg-primary"
                  borderRadius="rounded"
                  text="text-white text-sm font-light"
                  padding="py-1 px-3"
                  onClick={() => setActiveModal(ModalID.vendorWalletWithdrawal)}
                >
                  Withdraw
                </Button>
              </div>

              <div className="bg-green-500 text-white p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="text-xs text-green-100">Account Type</div>
                    <div className="font-semibold">Credit Card</div>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-6 h-6 rounded-full bg-red-500"></div>
                    <div className="w-6 h-6 rounded-full bg-yellow-500"></div>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm">•••• •••• •••• 2598</div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">KES 250000</span>
                    <div className="bg-white bg-opacity-20 p-1 rounded-full">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <button className="flex items-center text-gray-500">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                </div>
                <button className="flex items-center text-gray-500">
                  Next
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl text-gray-600">
                Recent Transactions
              </h2>
              <button className="flex items-center text-gray-500 text-sm">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden p-2 md:p-4">
              <div className="border-b">
                <button
                  className={`px-6 py-3 text-sm font-medium ${
                    activeTab === "all"
                      ? "text-green-500 border-b-2 border-green-500"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("all")}
                >
                  All
                </button>
              </div>

              <div className="divide-y hadow-md">
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <div className="font-medium">Absa Bank</div>
                    <div className="text-sm text-gray-500">Withdrawal</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-red-500">
                      KES 16,000.00
                    </div>
                    <div className="text-sm text-gray-500">17 May 2023</div>
                  </div>
                </div>

                <div className="p-4 flex justify-between items-center">
                  <div>
                    <div className="font-medium">Absa Bank</div>
                    <div className="text-sm text-gray-500">Deposit</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-500">
                      KES 20,000.00
                    </div>
                    <div className="text-sm text-gray-500">17 May 2023</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products and Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <h2 className="text-xl mb-4">Recent Products</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Activities</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tracking Number
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          #876364
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          Quad Biking
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-500">
                          KES 2,000.00
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-green-500">
                          Active
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          #876364
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          Swimming
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-500">
                          KES 3,000.00
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-green-500">
                          Active
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          #876364
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          Go Carting
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-500">
                          KES 1,000.00
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-green-500">
                          Active
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Events</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tracking Number
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {/* Event rows would go here */}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 mb-6">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
              <h2 className="text-xl  mb-4">Sales</h2>

              <div>
                <h3 className="font-medium mb-2">Recent Orders</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tracking no
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Order
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          #876364
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex items-center">
                          <span className="inline-block w-6 h-6 mr-2 bg-gray-200 rounded-sm"></span>
                          Quad Biking
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          KES 1,000.00
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-blue-500">
                          325
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                          KES 325.0
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          #876368
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex items-center">
                          <span className="inline-block w-6 h-6 mr-2 bg-gray-200 rounded-sm"></span>
                          Bicycle riding
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          KES 1,000.00
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-blue-500">
                          53
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                          KES 53.0
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          #876412
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex items-center">
                          <span className="inline-block w-6 h-6 mr-2 bg-gray-200 rounded-sm"></span>
                          Swimming
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          KES 1,000.00
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-blue-500">
                          78
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                          KES 78.0
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          #876621
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex items-center">
                          <span className="inline-block w-6 h-6 mr-2 bg-gray-200 rounded-sm"></span>
                          Go Carting
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          KES 1,000.00
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-blue-500">
                          98
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                          KES 98.0
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-medium mb-4">Total Revenue</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Bar dataKey="Quad Biking" fill="#f97316" />
                    <Bar dataKey="Bicycle riding" fill="#0ea5e9" />
                    <Bar dataKey="Swimming" fill="#84cc16" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
                  <span className="text-sm">Quad Biking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-sky-500 rounded-sm"></div>
                  <span className="text-sm">Bicycle riding</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

VendorPage.layout = VendorLayout;

const mapStateToProps = (state: RootState) => {
  const { isLoggedIn } = state.authentication;
  return { isLoggedIn };
};

const mapDispatchToProps = (dispatch: any) => ({
  setActiveModal: (modalId: ModalID) =>
    dispatch.components.setActiveModal(modalId),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuth(VendorPage));
