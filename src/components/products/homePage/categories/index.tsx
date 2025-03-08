"use client";

import React, { FC, useRef } from "react";
import { ProductCategory, Subcategory } from "@/domain/dto/output";
import {
  Baby,
  Briefcase,
  Dumbbell,
  Music,
  PaintBucket,
  Car,
  Bike,
  ChevronRight,
} from "lucide-react";
import { FaSkiingNordic, FaSwimmer } from "react-icons/fa";
import { MdOutlineSportsMotorsports } from "react-icons/md";
import { connect } from "react-redux";
import { RootState } from "@/store";
import { ComprehensiveProductFilters } from "@/domain/dto/product.input";
import useDeviceType from "@/lib/hooks/useDeviceType";
import { DeviceType } from "../../../../domain/constants";

type ProductCategoriesProps = {
  productCategories: Array<ProductCategory>;
  productCategoriesRequestProcessing: boolean;
  toggleCategoryFilter: (categoryId: string) => void;
  comprehensiveProductFilters: ComprehensiveProductFilters;
};

const ProductCategories: FC<ProductCategoriesProps> = ({
  productCategories,
  toggleCategoryFilter,
  comprehensiveProductFilters,
}) => {
  const devieType = useDeviceType();
  const icons = [
    {
      label: "Kids",
      icon: <Baby size={devieType === DeviceType.mobile ? 24 : 30} />,
    },
    {
      label: "Safari",
      icon: <Briefcase size={devieType === DeviceType.mobile ? 24 : 30} />,
    },
    {
      label: "Swimming",
      icon: <FaSwimmer size={devieType === DeviceType.mobile ? 24 : 30} />,
    },
    {
      label: "Gym",
      icon: <Dumbbell size={devieType === DeviceType.mobile ? 24 : 30} />,
    },
    {
      label: "Concert",
      icon: <Music size={devieType === DeviceType.mobile ? 24 : 30} />,
    },
    {
      label: "Paint Balling",
      icon: <PaintBucket size={devieType === DeviceType.mobile ? 24 : 30} />,
    },
    {
      label: "Quad Biking",
      icon: (
        <MdOutlineSportsMotorsports
          size={devieType === DeviceType.mobile ? 24 : 30}
        />
      ),
    },
    {
      label: "Ice Skating",
      icon: <FaSkiingNordic size={devieType === DeviceType.mobile ? 24 : 30} />,
    },
    {
      label: "Car Shows",
      icon: <Car size={devieType === DeviceType.mobile ? 24 : 30} />,
    },
    {
      label: "Cycling",
      icon: <Bike size={devieType === DeviceType.mobile ? 24 : 30} />,
    },
  ];

  const categoriesContainerRef = useRef<HTMLDivElement>(null);

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
                  className="flex flex-col items-center gap-1 md:min-w-[80px] flex-shrink-0 cursor-pointer"
                  onClick={() => toggleCategoryFilter(subCategory?.id)}
                >
                  <div className="flex items-center justify-center">
                    <span
                      className={`${`${
                        comprehensiveProductFilters?.categoies?.includes(
                          subCategory?.id
                        )
                          ? "text-primary"
                          : "text-gray-500"
                      }`}`}
                    >
                      {icons[Math.floor(Math.random() * icons.length)]?.icon}
                    </span>
                    {/* {React.createElement(
                      icons[Math.floor(Math.random() * icons.length)]?.icon,
                      {
                        size: isMobile ? 24 : 30,
                        className: `${`${
                          comprehensiveProductFilters?.categoies?.includes(
                            subCategory?.id
                          )
                            ? "text-primary"
                            : "text-gray-500"
                        }`}`,
                      }
                    )} */}
                  </div>
                  <span
                    className={`text-sm md:text-xs text-center ${
                      comprehensiveProductFilters?.categoies?.includes(
                        subCategory?.id
                      )
                        ? "text-primary"
                        : "text-gray-500"
                    }`}
                  >
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
                  behavior: "smooth", // Smooth scrolling
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
  const { comprehensiveProductFilters } = state.products;
  return {
    productCategories,
    productCategoriesRequestProcessing,
    comprehensiveProductFilters,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  toggleCategoryFilter: (categoryId: string) =>
    dispatch.products.toggleCategoryFilter(categoryId),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductCategories);
