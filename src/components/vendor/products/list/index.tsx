import React, { FC } from "react";
import { Product } from "@/domain/product";
import { DeviceType } from "@/domain/constants";
import {
  ProductCategory,
  VendorProductsAPIResponse,
} from "@/domain/dto/output";
import Image from "next/image";
import { getPricingRange } from "@/utilities";
import Button from "@/components/shared/button";
import useDeviceType from "@/lib/hooks/useDeviceType";
import { VendorProductsFilters } from "@/domain/dto/input";
import Link from "next/link";

type VendorProductsListViewProps = {
  isProcessingRequest: boolean;
  vendorProducts: VendorProductsAPIResponse;
  productCategories: Array<ProductCategory>;
  setProductFilters: (filters: VendorProductsFilters) => void;
};

const getImageDimensions = (deviceType: DeviceType) => {
  return deviceType === DeviceType.mobile
    ? { width: 250, height: 250 }
    : { width: 400, height: 400 };
};

const VendorProductsListView: FC<VendorProductsListViewProps> = ({
  isProcessingRequest,
  vendorProducts,
  productCategories,
  setProductFilters,
}) => {
  const deviceType = useDeviceType();

  const categoryHasProducts = (category: string) => {
    let products = 0;
    vendorProducts?.results?.map((product: Product) => {
      if (product.category === category) {
        products++;
      }
    });
    return products > 0;
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-2 mt-12 md:mt-0">
      <h2 className="text-lg font-medium">My Products</h2>
      <Link
        href={`/vendor/products/new?step=${
          (vendorProducts?.count as number) > 0 ? "classification" : "intro"
        }`}
      >
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
  );

  return (
    <div className="px-1 py-2 md:px-6 md:py-3 bg-white">
      {deviceType === DeviceType.mobile ? (
        renderHeader()
      ) : (
        <h2 className="text-lg font-medium text-center mb-3">My Products</h2>
      )}
      {isProcessingRequest ? (
        <div className="flex flex-col items-center mt-8">
          {[...Array(5)].map((_, index: number) => (
            <div key={index} className="mb-6 animate-pulse w-full">
              <div className="overflow-auto whitespace-nowrap w-full">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="border">
                    <tr className="text-left border-b">
                      {[...Array(5)].map((_, idx) => (
                        <th key={idx} className="p-3 pl-2 border font-medium">
                          <div className="h-4 bg-gray-300 w-24 rounded-md"></div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(3)].map((_, idx) => (
                      <tr key={idx} className="border-b">
                        {[...Array(5)].map((_, idx2) => (
                          <td key={idx2} className="p-3 pl-2 border-r">
                            <div className="h-4 bg-gray-300 w-full rounded-md"></div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg md:border px-1 py-2 md:px-6 md:py-6">
          {vendorProducts?.results?.length === 0 ? (
            <div className="grid place-items-center text-center mt-4 mb-12 md:mt-8 md:mb-20 px-2 md:px-0">
              <div className="grid place-items-center text-center">
                <Image
                  src="/assets/no-records.jpg"
                  alt="No products"
                  width={getImageDimensions(deviceType).width}
                  height={getImageDimensions(deviceType).height}
                  className="mb-4"
                />
                <p className="text-xl font-semibold text-black mb-4">
                  Oops! You have no products in your catalogue
                </p>
                <Link
                  href={`/vendor/products/new?step=${
                    (vendorProducts?.count as number) > 0
                      ? "classification"
                      : "intro"
                  }`}
                >
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
            <div>
              {productCategories
                ?.filter((cat: ProductCategory) => categoryHasProducts(cat.id))
                ?.map((category: ProductCategory, index: number) => (
                  <div key={index} className="mb-6">
                    <h2 className="text-lg font-medium  w-full border-b">
                      {category?.name}
                    </h2>
                    <div className="overflow-auto whitespace-nowrap min-w-7">
                      <table className="w-full border border-gray-200 rounded-lg ">
                        <thead className="border">
                          <tr className="text-left border-b">
                            <th className="p-3 pl-2 border font-medium ">
                              Tracking Number
                            </th>
                            <th className="p-3 pl-0 border text-center font-medium">
                              Product Name
                            </th>
                            <th className="p-3 pl-0 border text-center font-medium">
                              Price
                            </th>
                            <th className="p-3 pl-0 border text-center font-medium">
                              Status
                            </th>
                            <th className="p-3 pl-0 border text-center font-medium">
                              Next actions
                            </th>
                          </tr>
                        </thead>
                        {vendorProducts?.results?.filter(
                          (product: Product) =>
                            product.category === category?.id
                        ).length > 0 ? (
                          <tbody>
                            {vendorProducts?.results
                              ?.filter(
                                (product: Product) =>
                                  product.category === category?.id
                              )
                              .map((product: Product, idx: number) => (
                                <tr key={idx} className="border-b">
                                  <td className="p-3 pl-2 border-r font-thin">
                                    {product?.number}
                                  </td>
                                  <td className="p-3 border-r text-center font-thin">
                                    {product?.name}
                                  </td>
                                  <td className="p-3 text-blue-600 border-r text-center font-thin">
                                    {getPricingRange(product?.pricing)}
                                  </td>
                                  <td
                                    className={`p-3 font-semibold ${
                                      product?.active
                                        ? "text-green-600"
                                        : "text-orange-600"
                                    } border-r text-center font-base`}
                                  >
                                    {product?.active ? "Active" : "Under Review"}
                                  </td>
                                  <td className="p-3 text-center flex justify-center space-x-2">
                                    <Link
                                      href={`/vendor/products/edit/${product?.id}?step=classification`}
                                      className="bg-orange-200 text-orange-700 px-4 py-0 rounded"
                                    >
                                      Edit
                                    </Link>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        ) : (
                          <tbody>
                            <p className="font-base text-red-500 w-full py-3">
                              Oops! You have no products available for this
                              category!
                            </p>
                          </tbody>
                        )}
                      </table>
                    </div>
                  </div>
                ))}
              {deviceType !== DeviceType.mobile && (
                <div className="flex justify-end">
                  <Link
                    href={`/vendor/products/new?step=${
                      (vendorProducts?.count as number) > 0
                        ? "classification"
                        : "intro"
                    }`}
                  >
                    <Button
                      margin="m-0"
                      bg="bg-primary"
                      borderRadius="rounded"
                      text="text-white"
                      padding="py-1 px-3"
                    >
                      Add New Product
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VendorProductsListView;
