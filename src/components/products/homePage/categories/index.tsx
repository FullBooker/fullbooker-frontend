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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { generateSlug } from "@/utilities";
import { connect } from "react-redux";
import { RootState } from "@/store";
import useIsMobile from "@/lib/hooks/useIsMobile";

type ProductCategoriesProps = {
  productCategories: Array<ProductCategory>;
  productCategoriesRequestProcessing: boolean;
};

const ProductCategories: FC<ProductCategoriesProps> = ({
  productCategories,
}) => {
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const categoriesContainerRef = React.useRef<HTMLDivElement>(null);

  const extractSubcategories = (
    categories: Array<ProductCategory>
  ): Array<Subcategory> => {
    let subcategories: any[] = [];

    const collectSubcategories = (subcats: Array<Subcategory>) => {
      for (const subcat of subcats) {
        subcategories.push(subcat);
        if (subcat.children && subcat.children.length > 0) {
          collectSubcategories(subcat.children);
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
    <div className="py-1 md:py-2 bg-white px-2 md:px-3 lg:px-4">
      {productCategories?.length === 0 ? (
        <div className="flex justify-center py-8">
          <p className="text-red-500">
            Oops! There are no product categories at the moment
          </p>
        </div>
      ) : (
        <div
          className="flex items-center gap-8 py-4
    px-4 md:px-7"
        >
          <div
            ref={categoriesContainerRef}
            className="flex justify-evenly items-center gap-6 overflow-x-auto no-scrollbar"
          >
            {extractSubcategories(productCategories?.reverse())?.map(
              (subCategory: Subcategory, index: number) => (
                <span
                  key={index}
                  className="flex flex-col items-center gap-2 min-w-[80px] flex-shrink-0 cursor-pointer"
                  onClick={() => {
                    const newSearchParams = new URLSearchParams(
                      searchParams.toString()
                    );
                    newSearchParams.set(
                      "category",
                      generateSlug(subCategory?.name)
                    );
                    router.push(`${pathname}?${newSearchParams.toString()}`);
                  }}
                >
                  <div className="flex items-center justify-center">
                    {React.createElement(
                      icons[Math.floor(Math.random() * 13 + 1) - 1].icon,
                      {
                        size: isMobile ? 24 : 32,
                        className: `${`${searchParams?.get("category") ===  generateSlug(subCategory?.name) ? 'text-primary' : 'text-gray-500' }`}`,
                      }
                    )}
                  </div>
                  <span className={`text-sm md:text-xs text-center ${searchParams?.get("category") ===  generateSlug(subCategory?.name) ? 'text-primary' : 'text-gray-500' }`}>
                    {subCategory.name}
                  </span>
                </span>
              )
            )}
          </div>

          <button
            className="bg-white hover:text-primary flex-shrink-0"
            onClick={() => {
              if (categoriesContainerRef.current) {
                categoriesContainerRef.current.scrollBy({
                  left: 100, // Adjust the scroll amount as needed
                  behavior: 'smooth', // Smooth scrolling
                });
              }
            }}
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const productCategoriesRequestProcessing =
    state.loading.effects.settings.getProductCategories;
  const { productCategories } = state.settings;
  return {
    productCategories,
    productCategoriesRequestProcessing,
  };
};

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ProductCategories);
