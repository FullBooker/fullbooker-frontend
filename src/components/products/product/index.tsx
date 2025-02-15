"use client";

import React, { FC } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Product } from "@/domain/product";
import LocationIdentifier from "@/components/shared/locationidentifier";
import { addCommaSeparators, extractCoordinates } from "@/utilities";
import { Currency, ProductCategory, Subcategory } from "@/domain/dto/output";
import { useRouter } from "next/navigation";
import Link from "next/link";

type SingleProductProps = {
  product: Product;
  currencies: Array<Currency>;
  categories: Array<ProductCategory>;
};

interface ProcessedCoordinates {
  latitude: number;
  longitude: number;
}

const SingleProduct: FC<SingleProductProps> = ({
  product,
  currencies,
  categories,
}) => {
  const processedCoordinates: ProcessedCoordinates | null =
    product?.locations?.length > 0
      ? extractCoordinates(product?.locations[0]?.coordinates)
      : null;

  const extractSubcategories = (
    categories: Array<ProductCategory>
  ): Array<Subcategory> => {
    let subcategories: any[] = [];

    const collectSubcategories = (subcats: Array<Subcategory>) => {
      for (const subcat of subcats) {
        subcategories.push(subcat);
        if (subcat.children && subcat.children.length > 0) {
          collectSubcategories(subcat.children); // Recursively collect nested children
        }
      }
    };

    for (const category of categories) {
      if (category.subcategories && category.subcategories.length > 0) {
        collectSubcategories(category.subcategories);
      }
    }

    return subcategories;
  };

  const getProductCategoryName = (category: string) => {
    const categoryName =
      categories?.find((cat: ProductCategory) => cat.id === category)?.name ||
      "";

    return categoryName
      ? categoryName.toLowerCase().replace(/\s+/g, "-") // Convert to lowercase & replace spaces with hyphens
      : "";
  };

  const getProductSubCategoryName = (subCategory: string) => {
    const subCategoryName =
      extractSubcategories(categories)?.find(
        (subCat: Subcategory) => subCat.id === subCategory
      )?.name || "";

    return subCategoryName
      ? subCategoryName.toLowerCase().replace(/\s+/g, "-") // Convert to lowercase & replace spaces with hyphens
      : "";
  };

  const router = useRouter();

  return (
    <Link
      href={`/product/${getProductCategoryName(
        product?.category
      )}/${getProductSubCategoryName(product?.subcategory)}/${product?.name
        ?.toLowerCase()
        .replace(/\s+/g, "-")}_${product?.id}`}
      className="max-w-sm rounded-2xl bg-white overflow-hidden cursor-pointer"
    >
      <div className="relative shadow-xl">
        <Image
          src={`${product?.image?.file || "/assets/quad.png"}`}
          alt={"Event"}
          width={300}
          height={300}
          className="w-full h-[300px] object-cover rounded-lg"
        />
        {/* Tag */}
        <div className="absolute top-2 left-2 bg-white text-black text-sm font-medium px-12 py-1 rounded">
          {categories?.length > 0
            ? extractSubcategories(categories)?.find(
                (subcat: Subcategory) => subcat?.id === product?.subcategory
              )?.name
            : "N/A"}
        </div>
        {/* Favorite Button */}
        <button className="absolute top-2 right-2 rounded-full p-1 shadow">
          <Heart className="w-6 h-6 text-white" fill="white" />
        </button>
        <button className="absolute bottom-2 w-[60%] left-1/2 -translate-x-1/2 bg-primary text-black font-medium rounded-lg text-sm py-1">
          Buy ticket
        </button>
      </div>

      {/* Details Section */}
      <div className="py-4">
        <p className="text-gray-700 mt-2 text-sm">
          <strong>{product?.name}</strong>
        </p>
        <p>
          {processedCoordinates ? (
            <LocationIdentifier
              lat={processedCoordinates?.latitude}
              lng={processedCoordinates?.longitude}
            />
          ) : (
            "N/A"
          )}
        </p>
        <p>Mon to Sat from 9AM to 4PM</p>
        <p>
          {product?.pricing?.length > 0 ? (
            <span className="font-semibold">
              {currencies?.length > 0
                ? currencies?.find(
                    (currency: Currency) =>
                      currency?.id === product?.pricing[0]?.currency
                  )?.code
                : "KES"}{" "}
              {addCommaSeparators(Math.round(parseFloat(product?.pricing[0]?.cost)))}
            </span>
          ) : (
            <span className="font-semibold">N/A</span>
          )}
        </p>
      </div>
    </Link>
  );
};

export default SingleProduct;
