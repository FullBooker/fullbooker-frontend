"use client";

import { CarouselApi } from "@/components/ui/carousel";
import React, { FC, useEffect, useState } from "react";
import { connect } from "react-redux";
import { RootState } from "@/store";
import "react-loading-skeleton/dist/skeleton.css";
import { ModalID } from "@/domain/components";
import VendorLayout from "./layout";
import { withAuth } from "../../components/views/dash/authGuard";
import { ChevronRight } from "lucide-react";
import Button from "@/components/shared/button";
import { VendorProductsFilters } from "@/domain/dto/input";
import {
  VendorAccountsAPIResponse,
  VendorPaymentMethodsAPIResponse,
  VendorProductsAPIResponse,
  VendorSalesAPIResponse,
} from "@/domain/dto/output";
import { Product } from "@/domain/product";
import Link from "next/link";
import { addCommaSeparators, getPricingRange } from "@/utilities";
import { Transaction } from "@/domain/vendor";
import { VendorSalesFilters } from "@/domain/dto/input/vendor.input";
import HostAccountCarousel from "@/components/vendor/wallet/accounts";
import AccountsTransactions from "@/components/vendor/wallet/accounts/transactions";
import Skeleton from "@/components/ui/skeleton";

type VendorPageProps = {
  isLoggedIn: boolean;
  setActiveModal: (modalId: ModalID) => void;
  getVendorAccounts: () => void;
  getVendorProducts: (payload: VendorProductsFilters) => void;
  vendorProducts: VendorProductsAPIResponse;
  getVendorPaymentMethods: () => void;
  vendorAccounts: VendorAccountsAPIResponse;
  vendorPaymentMethods: VendorPaymentMethodsAPIResponse;
  vendorSales: VendorSalesAPIResponse;
  getVendorSales: (filters: VendorSalesFilters) => void;
  isFetchingVendorAccounts: boolean;
  isFetchingVendorProducts: boolean;
  isFetchingVendorSales: boolean;
};

const VendorPage: FC<VendorPageProps> & { layout: any } = ({
  isLoggedIn,
  setActiveModal,
  getVendorAccounts,
  getVendorProducts,
  vendorProducts,
  getVendorPaymentMethods,
  vendorAccounts,
  vendorPaymentMethods,
  vendorSales,
  getVendorSales,
  isFetchingVendorAccounts,
  isFetchingVendorProducts,
  isFetchingVendorSales,
}) => {
  useEffect(() => {
    getVendorAccounts();
    getVendorPaymentMethods();
    getVendorSales({
      page: 1,
      page_size: 5,
    } as VendorSalesFilters);
    getVendorProducts({
      page: 1,
      page_size: 5,
    } as VendorProductsFilters);
  }, []);

  return (
    <div className="w-full min-h-screen">
      <div className="px-4 py-14 md:p-6 space-y-6">
        <div className="col-span-2 grid md:grid-cols-2 gap-6">
          <div className="grid grid-cols-1">
            <div className="mb-4">
              <h2 className="text-xl text-black ">Total Balance</h2>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-6">
                {isFetchingVendorAccounts ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <h3 className="text-2xl font-bold">
                    KES{" "}
                    {addCommaSeparators(
                      vendorAccounts?.results?.length &&
                        vendorAccounts.results[0].account?.balance
                        ? parseInt(vendorAccounts.results[0].account.balance)
                        : 0
                    )}
                  </h3>
                )}

                {isFetchingVendorAccounts ? (
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    {Array.isArray(vendorAccounts?.results) &&
                      vendorAccounts.results.some(
                        (account) => parseFloat(account.account?.balance) > 0
                      ) && (
                        <Button
                          margin="m-0"
                          bg="bg-primary"
                          borderRadius="rounded"
                          text="text-white text-sm font-light"
                          padding="py-1 px-3"
                          onClick={() =>
                            setActiveModal(ModalID.vendorWalletWithdrawal)
                          }
                        >
                          Withdraw
                        </Button>
                      )}

                    <Button
                      margin="m-0"
                      bg="bg-primary"
                      borderRadius="rounded"
                      text="text-black text-sm font-light"
                      padding="py-1 px-3"
                      onClick={() =>
                        setActiveModal(ModalID.vendorNewPaymentMethodForm)
                      }
                      isSecondary
                    >
                      Add Payment Method
                    </Button>
                  </div>
                )}
              </div>
              {isFetchingVendorAccounts ? (
                <div>
                  <Skeleton className="h-20 w-full mb-4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              ) : (
                <div>
                  {!vendorAccounts || vendorAccounts?.results?.length === 0 ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="text-center">
                        <p className="text-black mb-3">
                          You have no accounts at the moment
                        </p>
                        <Link href="/vendor/products/new?step=intro">
                          <Button
                            margin="m-0"
                            bg="bg-primary"
                            borderRadius="rounded"
                            text="text-white text-sm"
                            padding="py-1 px-3"
                          >
                            Add New Account
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <HostAccountCarousel
                      accounts={vendorAccounts?.results || []}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1">
            {isFetchingVendorAccounts ? (
              <div>
                <h2 className="text-xl mb-4">Recent Transactions</h2>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden p-2 md:p-4">
                  <div className="flex space-evenly items-center space-x-2 mb-4">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  {Array.from({ length: 5 }).map((_, index: number) => (
                    <div
                      key={index}
                      className="flex space-evenly items-center space-x-2 mb-4"
                    >
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                {!vendorAccounts || vendorAccounts?.results?.length === 0 ? (
                  <div className="">
                    <h2 className="text-xl mb-4">Recent Transactions</h2>
                    <div className="flex justify-center items-center py-8 shadow-md rounded-md md:h-[85%]">
                      <div className="text-center">
                        <p className="text-black mb-3">
                          No transactions available.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <AccountsTransactions />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isFetchingVendorProducts ? (
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl">Recent Products</h2>
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        {[
                          "Tracking Number",
                          "Product Name",
                          "Price",
                          "Status",
                        ].map((header, index) => (
                          <th
                            key={index}
                            className="pr-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(5)].map((_, index) => (
                        <tr key={index}>
                          {[...Array(4)].map((_, cellIndex) => (
                            <td key={cellIndex} className="pr-4 py-3">
                              <Skeleton className="h-4 w-full" />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl">Recent Products</h2>
                <Link href="/vendor/products" className="cursor-pointer">
                  <button className="flex items-center text-gray-500 text-sm">
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </Link>
              </div>

              {!vendorProducts || vendorProducts?.results?.length === 0 ? (
                <div className="flex justify-center items-center py-8">
                  <div className="text-center">
                    <p className="text-black mb-3">
                      You have no products at the moment
                    </p>
                    <Link href="/vendor/products/new?step=intro">
                      <Button
                        margin="m-0"
                        bg="bg-primary"
                        borderRadius="rounded"
                        text="text-white text-sm"
                        padding="py-1 px-3"
                      >
                        Add New Product
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="pr-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tracking Number
                          </th>
                          <th className="pr-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product Name
                          </th>
                          <th className="pr-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="pr-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {vendorProducts?.results.map(
                          (product: Product, index: number) => (
                            <tr key={index}>
                              <td className="pr-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {product?.number}
                              </td>
                              <td className="pr-4 py-3 whitespace-nowrap text-sm text-gray-500 max-w-[150px] overflow-hidden text-ellipsis">
                                {product?.name}
                              </td>
                              <td className="pr-4 py-3 whitespace-nowrap text-sm text-blue-500 text-center">
                                {getPricingRange(product?.pricing)}
                              </td>
                              <td
                                className={`pr-4 py-3 whitespace-nowrap text-sm text-center ${
                                  product?.active
                                    ? "text-green-600"
                                    : "text-orange-600"
                                }`}
                              >
                                {product?.active ? "Active" : "Under Review"}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {isFetchingVendorSales ? (
            <div className="space-y-6 mb-6">
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl">Recent Sales</h2>
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        {[
                          "Tracking no",
                          "Product Name",
                          "Price",
                          "Total Order",
                          "Total Amount",
                        ].map((header, index) => (
                          <th
                            key={index}
                            className="pr-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(5)].map((_, index) => (
                        <tr key={index}>
                          {[...Array(5)].map((_, cellIndex) => (
                            <td key={cellIndex} className="pr-4 py-3">
                              <Skeleton className="h-4 w-full" />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 mb-6">
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl">Recent Sales</h2>
                  <Link href="/vendor/sales" className="cursor-pointer">
                    <button className="flex items-center text-gray-500 text-sm">
                      View All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </Link>
                </div>

                {!vendorSales || vendorSales?.results?.length === 0 ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="text-center">
                      <p className="text-black mb-3">
                        No transactions found. Start selling and track your
                        earnings here!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="pr-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tracking no
                            </th>
                            <th className="pr-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Product Name
                            </th>
                            <th className="pr-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Price
                            </th>
                            <th className="pr-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total Order
                            </th>
                            <th className="pr-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {vendorSales?.results.map(
                            (transaction: Transaction, index: number) => (
                              <tr key={index}>
                                <td className="pr-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                  {transaction?.product_number || "N/A"}
                                </td>
                                <td className="pr-4 py-3 whitespace-nowrap text-sm font-medium flex items-center">
                                  {transaction?.product_name || "N/A"}
                                </td>
                                <td className="pr-4 py-3 whitespace-nowrap text-sm">
                                  {addCommaSeparators(
                                    parseInt(transaction?.total_cost) /
                                      transaction?.total_tickets_count
                                  )}
                                </td>
                                <td className="pr-4 py-3 whitespace-nowrap text-sm text-center text-blue-500">
                                  {transaction?.total_tickets_count}
                                </td>
                                <td className="pr-4 py-3 whitespace-nowrap text-sm text-right">
                                  {transaction?.total_cost}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

VendorPage.layout = VendorLayout;

const mapStateToProps = (state: RootState) => {
  const isFetchingVendorAccounts =
    state.loading.effects.vendor.getVendorAccounts;
  const isFetchingVendorProducts =
    state.loading.effects.vendor.getVendorProducts;
  const isFetchingVendorSales = state.loading.effects.vendor.getVendorSales;
  const { isLoggedIn } = state.authentication;
  const { vendorAccounts, vendorPaymentMethods, vendorSales, vendorProducts } =
    state.vendor;
  return {
    isLoggedIn,
    vendorAccounts,
    vendorPaymentMethods,
    vendorSales,
    vendorProducts,
    isFetchingVendorAccounts,
    isFetchingVendorProducts,
    isFetchingVendorSales,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  setActiveModal: (modalId: ModalID) =>
    dispatch.components.setActiveModal(modalId),
  getVendorAccounts: () => dispatch.vendor.getVendorAccounts(),
  getVendorProducts: (payload: VendorProductsFilters) =>
    dispatch.vendor.getVendorProducts(payload),
  getVendorPaymentMethods: () => dispatch.vendor.getVendorPaymentMethods(),
  getVendorSales: (filters: VendorSalesFilters) =>
    dispatch.vendor.getVendorSales(filters),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuth(VendorPage));
