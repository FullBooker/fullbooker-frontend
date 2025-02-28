import SingleProductSkeleton from "@/components/shared/shimmers/singleProduct";
import { Currency, ProductCategory } from "@/domain/dto/output";
import { Product } from "@/domain/product";
import React, { FC } from "react";
import SingleProduct from "../product";

type CategoryProductsOutletProps = {
  products: Array<Product>;
  isProcessingRequest: boolean;
  currencies: Array<Currency>;
  productCategories: Array<ProductCategory>;
};

const CategoryProductsOutlet: FC<CategoryProductsOutletProps> = ({
  products,
  isProcessingRequest,
  currencies,
  productCategories,
}) => {
  return (
    <div>
      {isProcessingRequest ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 py-0
            px-4 md:px-7"
        >
          {Array(10)
            .fill(null)
            .map((_, index) => (
              <SingleProductSkeleton key={index} />
            ))}
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 py-0
            px-4 md:px-7"
        >
          {products &&
            products?.map((product: Product, index: number) => (
              <SingleProduct
                key={index}
                product={product}
                currencies={currencies}
                categories={productCategories}
              />
            ))}
        </div>
      )}
      {!isProcessingRequest && products?.length === 0 && (
        <div className="flex justify-center py-8">
          <p className="text-red-500">
            Oops! There are no products in this category at the moment
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryProductsOutlet;
