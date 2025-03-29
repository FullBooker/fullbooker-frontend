"use client";

import React, { FC, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Dispatch, RootState } from "@/store";
import "react-loading-skeleton/dist/skeleton.css";
import { ProductsFilters } from "@/domain/dto/input";
import { Product } from "@/domain/product";
import {
  Currency,
  ProductCategory,
  ProductsAPIResponse,
} from "@/domain/dto/output";
import CategoryProductsOutlet from "../categoryProductsOutlet";
import Button from "@/components/shared/button";

type PopularProductsSectionProps = {
  isLoggedIn: boolean;
  getProducts: (payload?: ProductsFilters) => void;
  products: ProductsAPIResponse;
  productCategories: Array<ProductCategory>;
  productsRequestProcessing: boolean;
  currencies: Array<Currency>;
};

const MoreProducts: FC<PopularProductsSectionProps> = ({
  productCategories,
  products,
  productsRequestProcessing,
  getProducts,
  currencies,
}) => {
  const [filters, setFilters] = useState<ProductsFilters>({
    page: 1,
    page_size: 5,
  } as ProductsFilters);

  useEffect(() => {
    getProducts(filters);
  }, [filters]);

  return (
    <div>
      <CategoryProductsOutlet
        title="More"
        path="/products"
        products={products?.results}
        currencies={currencies}
        productCategories={productCategories}
        isProcessingRequest={productsRequestProcessing}
        shouldTrim={false}
      />
      {!productsRequestProcessing &&
        products?.count > products?.results?.length && (
          <div className="py-8 px-2 md:px-3 lg:px-4 bg-white text-center flex justify-center">
            <div className="flex justify-center px-4 sm:px-7">
              <Button
                width="w-full"
                bg="bg-primary"
                borderRadius="rounded"
                margin="mb-2"
                text="text-black"
                padding="py-2 px-4 md:px-8"
                isSecondary
                onClick={() =>
                  setFilters((prevState: ProductsFilters) => ({
                    ...prevState,
                    page_size: (prevState?.page_size || 0) + 5,
                  }))
                }
              >
                Load more
              </Button>
            </div>
          </div>
        )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const productsRequestProcessing = state.loading.effects.products.getProducts;
  const { products } = state.products;
  const { productCategories, currencies } = state.settings;
  return {
    products,
    productCategories,
    productsRequestProcessing,
    currencies,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getProducts: (payload: ProductsFilters) =>
    dispatch.products.getProducts(payload),
});

export default connect(mapStateToProps, mapDispatchToProps)(MoreProducts);
