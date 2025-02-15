"use client";

import React, { FC, useEffect, useState } from "react";
import { connect } from "react-redux";
import { RootState } from "@/store";
import { Product } from "@/domain/product";
import SingleProductSkeleton from "@/components/shared/shimmers/singleProduct";
import { ProductsFilters } from "@/domain/dto/input";
import { Currency, ProductCategory } from "@/domain/dto/output";
import SingleProduct from "../../product";

type ProductsByVendorPageProps = {
  products: Array<Product>;
  productsRequestProcessing: boolean;
  getProducts: (payload?: ProductsFilters) => void;
  getProductCategories: () => void;
  productCategories: Array<ProductCategory>;
  getCurrencies: () => void;
  currencies: Array<Currency>;
};

const ProductsByVendorPage: FC<ProductsByVendorPageProps> = ({
  productCategories,
  products,
  productsRequestProcessing,
  getProducts,
  getProductCategories,
  getCurrencies,
  currencies,
}) => {
  const [filters, setFilters] = useState<ProductsFilters>({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    // getProductCategories();
    getProducts();
    // getCurrencies();
  }, []);
  return (
    <div className="mt-6 border-t border-gray-400 py-8">
      <h3 className="text-lg font-semibold mb-3">More Products By Vendor</h3>
      {productsRequestProcessing ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-0
            px-4 md:px-7"
        >
          {Array(9)
            .fill(null)
            .map((_, index) => (
              <SingleProductSkeleton key={index} />
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-0">
          {products.map((product: Product, index: number) => (
            <SingleProduct
              key={index}
              product={product}
              currencies={currencies}
              categories={productCategories}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const productsRequestProcessing =
    state.loading.effects.products.getProductsByVendor;
  const { products } = state.products;
  const { productCategories, currencies } = state.settings;
  return {
    products,
    productCategories,
    productsRequestProcessing,
    currencies,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  getProducts: (payload?: ProductsFilters) =>
    dispatch.products.getProducts(payload),
  getProductCategories: () => dispatch.settings.getProductCategories(),
  getCurrencies: () => dispatch.settings.getCurrencies(),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductsByVendorPage);
