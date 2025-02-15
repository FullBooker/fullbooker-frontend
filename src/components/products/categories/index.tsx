"use client";

import React, { FC } from "react";
import { ProductCategory, Subcategory } from "@/domain/dto/output";
import {
  ChevronLeft,
  ChevronRight,
  Trophy,
  Utensils,
  Landmark,
  Mountain,
  Palette,
  Mic,
  Car,
  Target,
  Bike,
  Dumbbell,
  Users,
  Music,
} from "lucide-react";
import { useRouter } from "next/navigation";

type ProductCategoriesProps = {
  categories: Array<ProductCategory>;
};

const ProductCategories: FC<ProductCategoriesProps> = ({ categories }) => {
  const icons = [
    {
      name: "Kids",
      icon: Users,
    },
    {
      name: "Concerts",
      icon: Music,
    },
    {
      name: "Gyms",
      icon: Dumbbell,
    },
    {
      name: "Go karting",
      icon: Car,
    },
    {
      name: "Quad biking",
      icon: Bike,
    },
    {
      name: "Stand Ups",
      icon: Mic,
    },
    {
      name: "Car shows",
      icon: Car,
    },
    {
      name: "Paintballing",
      icon: Target,
    },
    {
      name: "Sports",
      icon: Trophy,
    },
    {
      name: "Arts",
      icon: Palette,
    },
    {
      name: "Food",
      icon: Utensils,
    },
    {
      name: "Adventure",
      icon: Mountain,
    },
    {
      name: "Culture",
      icon: Landmark,
    },
  ];
  const router = useRouter();

  const extractSubcategories = (categories: Array<ProductCategory>): Array<Subcategory> => {
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

  return (
    <div className="py-3 lg:py-6 md:py-6 xl:py-6 bg-white px-2 md:px-3 lg:px-4 ">
      <div
        className="flex items-center gap-8  py-4
    px-4 sm:px-7"
      >
        <button className="rounded-full bg-white hover:bg-gray-200 flex-shrink-0 border border-gray-800">
          <ChevronLeft className="w-10 h-10 text-black" />
        </button>

        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
          {extractSubcategories(categories)?.map(
            (subCategory: Subcategory, index: number) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 min-w-[80px] flex-shrink-0 cursor-pointer"
                onClick={() =>
                  router.push(
                    `/products/${
                      subCategory?.category?.toLocaleLowerCase
                    }/${subCategory?.name.toLowerCase()}`
                  )
                }
              >
                <div className="w-6 h-6 lg:w-12 md:w-12 xl:w-12 lg:h-12 md:h-12 xl:h-12 rounded-ful flex items-center justify-center">
                  {React.createElement(
                    icons[Math.floor(Math.random() * 13 + 1) - 1].icon,
                    {
                      size: 24,
                      className: "text-gray-600",
                    }
                  )}
                </div>
                <span className="text-sm text-center">{subCategory.name}</span>
              </div>
            )
          )}
        </div>

        <button className="rounded-full bg-white hover:bg-gray-200 flex-shrink-0 border border-gray-800">
          <ChevronRight className="w-10 h-10 text-black" />
        </button>
      </div>
    </div>
  );
};

export default ProductCategories;
