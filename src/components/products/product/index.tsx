"use client";

import React, { FC } from "react";
import Image from "next/image";
import { Calendar, Clock, Heart, MapPin, Share } from "lucide-react";
import { Product, ProductPricing } from "@/domain/product";
import LocationIdentifier from "@/components/shared/locationidentifier";
import {
  addCommaSeparators,
  extractCoordinates,
  formatProductAvailability,
} from "@/utilities";
import { Currency, ProductCategory, Subcategory } from "@/domain/dto/output";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/shared/button";

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

  const renderPricingRange = (pricing: Array<ProductPricing>): string => {
    if (pricing?.length === 1) {
      return addCommaSeparators(Math.round(parseFloat(pricing[0]?.cost)));
    } else if (pricing?.length > 0) {
      const prices = pricing.map((p: ProductPricing) =>
        Math.round(parseFloat(p.cost))
      );
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      return `${addCommaSeparators(minPrice)} - ${addCommaSeparators(
        maxPrice
      )}`;
    } else {
      return "N/A";
    }
  };

  return (
    <Link
      href={`/product/${getProductCategoryName(
        product?.category
      )}/${getProductSubCategoryName(product?.subcategory)}/${product?.name
        ?.toLowerCase()
        .replace(/\s+/g, "-")}_${product?.id}`}
      className="max-w-sm rounded bg-white overflow-hidden cursor-pointer shadow transition-transform transform md:hover:shadow-lg ease-out duration-500 flex flex-col h-full"
    >
      <div className="relative shadow-xl">
        <Image
          src={`${product?.image?.file || "/assets/quad.png"}`}
          alt={"Event"}
          width={250}
          height={250}
          className="w-full h-[250px] object-cover rounded-tl-sm rounded-tr-sm"
          unoptimized={true}
        />
        {/* Tag */}
        <div className="absolute top-2 left-2 bg-[#715757] text-white text-xs font-medium px-4 py-1 rounded-lg">
          {categories?.length > 0
            ? extractSubcategories(categories)?.find(
                (subcat: Subcategory) => subcat?.id === product?.subcategory
              )?.name
            : "N/A"}
        </div>
        {/* Share Button */}
        <button className="absolute top-2 right-2 rounded-full p-1 shadow cursor-pointer z-50">
          <Share className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Details Section */}
      <div className="px-3 pt-3 pb-4 md:pb-0 space-y-2 flex-grow">
        <p className="text-black text-base font-medium">{product?.name}</p>

        {/* Location */}
        <div className="flex items-center text-[#808080] space-x-2">
          <MapPin className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm truncate w-full">
            {processedCoordinates ? (
              <LocationIdentifier
                lat={processedCoordinates?.latitude}
                lng={processedCoordinates?.longitude}
              />
            ) : (
              "N/A"
            )}
          </p>
        </div>

        {/* Availability */}
        <div className="flex justify-between items-center text-[#808080] space-x-2 text-sm">
          {/* Date */}
          <div className="flex items-center min-w-0">
            <Calendar className="h-5 w-5 flex-shrink-0 me-2" />
            <p className="break-words whitespace-normal overflow-hidden">
              {formatProductAvailability(product?.availability)?.date}
            </p>
          </div>

          {/* Time */}
          <div className="flex items-center min-w-0">
            <Clock className="h-5 w-5 flex-shrink-0 me-2" />
            <p className="break-words whitespace-normal overflow-hidden">
              {formatProductAvailability(product?.availability)?.time}
            </p>
          </div>
        </div>

        {/* Price */}
        <p>
          {product?.pricing?.length > 0 && (
            <span className="font-medium text-black">
              {currencies?.length > 0
                ? currencies?.find(
                    (currency: Currency) =>
                      currency?.id === product?.pricing[0]?.currency
                  )?.code
                : "KES"}{" "}
              {renderPricingRange(product?.pricing)}
            </span>
          )}
        </p>
      </div>

      {/* Button Section (Anchored at the bottom) */}
      <div className="mt-auto p-3">
        <Button
          width="w-full"
          bg="bg-primary"
          borderRadius="rounded"
          text="text-white font-base"
          padding="py-2"
          margin="m-0"
        >
          Buy tickets
        </Button>
      </div>
    </Link>
  );
};

export default SingleProduct;
