import React, { FC, useEffect, useState } from "react";
import { RootState } from "@/store";
import { connect } from "react-redux";
import { VendorProductsFilters } from "@/domain/dto/input";
import { Product } from "@/domain/product";
import { ViewType } from "@/domain/constants";
import { ProductCategory } from "@/domain/dto/output";
import { CircularProgress } from "@mui/material";
import Image from "next/image";

type VendorProductsListViewProps = {
  loading: boolean;
  getVendorProducts: (payload: VendorProductsFilters) => void;
  vendorProducts: Array<Product>;
  setProductPageViewType: (viewType: ViewType) => void;
  productCategories: Array<ProductCategory>;
};

const VendorProductsListView: FC<VendorProductsListViewProps> = ({
  loading,
  getVendorProducts,
  vendorProducts,
  setProductPageViewType,
  productCategories,
}) => {
  const [filters, setFilters] = useState<VendorProductsFilters>({
    page: 1,
    limit: 10,
  });

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
    <div className="px-1 py-2 md:px-6 md:py-3 bg-white">
      <h2 className="text-lg font-medium text-center mb-3">My Products</h2>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <CircularProgress size={18} color="inherit" className="me-2" />
          <span>Fetching your products..</span>
        </div>
      ) : (
        <div className="rounded-lg border px-1 py-2 md:px-6 md:py-6">
          {vendorProducts?.length === 0 ? (
            <div className="grid place-items-center text-center mt-4 mb-12 md:mt-8 md:mb-20 px-2 md:px-0">
              <div className="grid place-items-center text-center">
                <Image
                  src="/assets/no-records.jpg"
                  alt="Fullbooker Logo"
                  width={isMobile ? 250 : 400}
                  height={isMobile ? 250 : 400}
                  className="mb-4"
                />
                <p className="text-xl font-semibold text-black">
                  Oops! You have no products in your catalogue
                </p>
                <button
                  className="bg-primary px-6 py-2 rounded-lg mt-4 text-black"
                  onClick={() =>
                    setProductPageViewType(ViewType.onboardingView)
                  }
                >
                  Add a new product
                </button>
              </div>
            </div>
          ) : (
            <div>
              {productCategories?.map(
                (category: ProductCategory, index: number) => (
                  <div key={index} className="mb-6">
                    <h2 className="text-lg font-medium  w-full border-b">
                      {category?.name}
                    </h2>
                    <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                      <thead className="border">
                        <tr className="text-left border-">
                          <th className="p-3 pl-0 border font-medium">
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
                      {vendorProducts?.filter(
                        (product: Product) => product.category === category?.id
                      ).length > 0 ? (
                        <tbody>
                          {vendorProducts
                            ?.filter(
                              (product: Product) =>
                                product.category === category?.id
                            )
                            .map((product: Product, idx: number) => (
                              <tr key={idx} className="border-b">
                                <td className="p-3 pl-0 border-r font-thin">
                                  {product?.number}
                                </td>
                                <td className="p-3 border-r text-center font-thin">
                                  {product?.name}
                                </td>
                                <td className="p-3 text-blue-600 border-r text-center font-thin">
                                  {product?.pricing[0]}
                                </td>
                                <td
                                  className={`p-3 font-semibold ${
                                    product?.active
                                      ? "text-green-600"
                                      : "text-red-600"
                                  } border-r text-center font-base`}
                                >
                                  {product?.active ? "Active" : "Inactive"}
                                </td>
                                <td className="p-3 text-center">
                                  <button className="bg-orange-200 text-orange-700 px-4 py-0 rounded">
                                    Edit
                                  </button>
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
                )
              )}
              <div className="flex justify-end">
                <button
                  className=" bg-primary px-6 py-2 rounded-lg mt-4 text-black"
                  onClick={() =>
                    setProductPageViewType(ViewType.onboardingView)
                  }
                >
                  Add a new product
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const loading = state.loading.models.vendor;
  const { vendorProducts } = state.vendor;
  const { productCategories } = state.settings;
  return {
    loading,
    vendorProducts,
    productCategories,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  getVendorProducts: (payload: VendorProductsFilters) =>
    dispatch.vendor.getVendorProducts(payload),
  setProductPageViewType: (viewType: ViewType) =>
    dispatch.vendor.setProductPageViewType(viewType),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VendorProductsListView);
