import SingleProductSkeleton from "@/components/shared/shimmers/singleProduct";
import { Currency, ProductCategory } from "@/domain/dto/output";
import { Product } from "@/domain/product";
import React, { FC } from "react";
import SingleProduct from "../product";
import Link from "next/link";

type CategoryProductsOutletProps = {
  products: Array<Product>;
  isProcessingRequest: boolean;
  currencies: Array<Currency>;
  productCategories: Array<ProductCategory>;
  title: string;
  path: string;
};

const CategoryProductsOutlet: FC<CategoryProductsOutletProps> = ({
  products,
  isProcessingRequest,
  currencies,
  productCategories,
  title,
  path,
}) => {
  return (
    <div className="px-2 md:px-3 lg:px-4 bg-white">
      <div className="px-4 md:px-7">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-base md:text-xl font-semibold">{title}</h2>
          <Link
            className="text-base text-primary decoration-transparent"
            href={path}
          >
            See all
          </Link>
        </div>

        {isProcessingRequest ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 py-0">
            {Array(10)
              .fill(null)
              .map((_, index) => (
                <SingleProductSkeleton key={index} />
              ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 py-0">
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
    </div>
  );
};

export default CategoryProductsOutlet;
