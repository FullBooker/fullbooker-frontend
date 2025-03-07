import React, { FC, useEffect, useState } from "react";
import { RootState } from "@/store";
import { connect } from "react-redux";
import { NewProductPayload, VendorProductsFilters } from "@/domain/dto/input";
import { Product, ProductPricing } from "@/domain/product";
import { ProductType, ViewType } from "@/domain/constants";
import { ProductCategory } from "@/domain/dto/output";
import { CircularProgress } from "@mui/material";
import Image from "next/image";
import { addCommaSeparators } from "@/utilities";
import useIsMobile from "@/lib/hooks/useIsMobile";
import Button from "@/components/shared/button";

type VendorProductsListViewProps = {
  loading: boolean;
  getVendorProducts: (payload?: VendorProductsFilters) => void;
  vendorProducts: Array<Product>;
  setProductPageViewType: (viewType: ViewType) => void;
  productCategories: Array<ProductCategory>;
  setNewProductDetails: (payload: NewProductPayload) => void;
  setActiveStep: (payload: number) => void;
  setProductType: (payload: ProductType) => void;
  getProductCategories: () => void;
};

const VendorProductsListView: FC<VendorProductsListViewProps> = ({
  loading,
  getVendorProducts,
  vendorProducts,
  setProductPageViewType,
  productCategories,
  setNewProductDetails,
  setActiveStep,
  setProductType,
  getProductCategories,
}) => {
  const [filters, setFilters] = useState<VendorProductsFilters>({
    page: 1,
    page_size: 10,
  });
  const isMobile = useIsMobile();

  const handleViewOrEditProduct = (product: any) => {
    setNewProductDetails(product);
    setProductType(
      productCategories
        ?.find((category: ProductCategory) => category.id === product?.category)
        ?.name?.includes("Events")
        ? ProductType.event
        : ProductType.others
    );
    setActiveStep(1);
    setProductPageViewType(ViewType.onboardingView);
  };

  const categoryHasProducts = (category: string) => {
    let products = 0;
    vendorProducts?.map((product: Product) => {
      if (product.category === category) {
        products++;
      }
    });
    return products > 0;
  };

  useEffect(() => {
    getProductCategories();
    getVendorProducts();
  }, []);

  return (
    <div className="px-1 py-2 md:px-6 md:py-3 bg-white">
      {isMobile ? (
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-medium">My Products</h2>
          <Button
            margin="m-0"
            bg="bg-primary"
            borderRadius="rounded-md"
            text="text-black"
            padding="py-1 px-3"
            onClick={() => setProductPageViewType(ViewType.onboardingView)}
          >
            Add Product +
          </Button>
        </div>
      ) : (
        <h2 className="text-lg font-medium text-center mb-3">My Products</h2>
      )}
      {loading ? (
        <div className="flex justify-center items-center h-[200px] md:h-screen">
          <CircularProgress size={18} color="inherit" className="me-2" />
          <span>Fetching your products..</span>
        </div>
      ) : (
        <div className="rounded-lg md:border px-1 py-2 md:px-6 md:py-6">
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
                        {vendorProducts?.filter(
                          (product: Product) =>
                            product.category === category?.id
                        ).length > 0 ? (
                          <tbody>
                            {vendorProducts
                              ?.filter(
                                (product: Product) =>
                                  product.category === category?.id
                              )
                              .map((product: Product, idx: number) => (
                                <tr
                                  key={idx}
                                  className="border-b cursor-pointer"
                                  onClick={() =>
                                    handleViewOrEditProduct(product)
                                  }
                                >
                                  <td
                                    className="p-3 pl-2 border-r font-thin cursor-pointer"
                                    onClick={() =>
                                      handleViewOrEditProduct(product)
                                    }
                                  >
                                    {product?.number}
                                  </td>
                                  <td
                                    className="p-3 border-r text-center font-thin cursor-pointer"
                                    onClick={() =>
                                      handleViewOrEditProduct(product)
                                    }
                                  >
                                    {product?.name}
                                  </td>
                                  <td
                                    className="p-3 text-blue-600 border-r text-center font-thin cursor-pointer"
                                    onClick={() =>
                                      handleViewOrEditProduct(product)
                                    }
                                  >
                                    {product?.pricing[0]?.cost &&
                                      addCommaSeparators(
                                        parseInt(product?.pricing[0]?.cost)
                                      )}
                                  </td>
                                  <td
                                    className={`p-3 font-semibold ${
                                      product?.active
                                        ? "text-green-600"
                                        : "text-red-600"
                                    } border-r text-center font-base cursor-pointer`}
                                    onClick={() =>
                                      handleViewOrEditProduct(product)
                                    }
                                  >
                                    {product?.active ? "Active" : "Inactive"}
                                  </td>
                                  <td className="p-3 text-center flex justify-center space-x-2">
                                    <button
                                      className="bg-orange-200 text-orange-700 px-4 py-0 rounded"
                                      onClick={() =>
                                        handleViewOrEditProduct(product)
                                      }
                                    >
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
                  </div>
                ))}
              {!isMobile && (
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
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const mapStateToProps = (state: RootState) => {
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
  getProductCategories: () => dispatch.settings.getProductCategories(),
  setProductPageViewType: (viewType: ViewType) =>
    dispatch.vendor.setProductPageViewType(viewType),
  setNewProductDetails: (payload: any) =>
    dispatch.vendor.setNewProductDetails(payload),
  setActiveStep: (payload: number) => dispatch.vendor.setActiveStep(payload),
  setProductType: (payload: ProductType) =>
    dispatch.vendor.setProductType(payload),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VendorProductsListView);
