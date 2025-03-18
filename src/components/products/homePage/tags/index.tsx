"use client";

import React, { FC, useRef } from "react";
import { ProductTag } from "@/domain/dto/output";
import { ChevronRight } from "lucide-react";
import { connect } from "react-redux";
import { RootState } from "@/store";
import { ComprehensiveProductFilters } from "@/domain/dto/product.input";
import useDeviceType from "@/lib/hooks/useDeviceType";
import { DeviceType } from "../../../../domain/constants";
import Image from "next/image";

type ProductTagsProps = {
  isProcessingRequest: boolean;
  toggleCategoryFilter: (categoryId: string) => void;
  comprehensiveProductFilters: ComprehensiveProductFilters;
  productTags: Array<ProductTag>;
};

const ProductsTags: FC<ProductTagsProps> = ({
  toggleCategoryFilter,
  comprehensiveProductFilters,
  productTags,
  isProcessingRequest,
}) => {
  const deviceType = useDeviceType();
  const categoriesContainerRef = useRef<HTMLDivElement>(null);

  const Shimmer = () => (
    <div className="flex flex-col items-center gap-1 md:min-w-[80px] flex-shrink-0 animate-pulse">
      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
      <div className="w-12 h-4 bg-gray-300 rounded"></div>
    </div>
  );

  return (
    <div>
      {isProcessingRequest ? (
        <div className="py-1 md:py-2 bg-white px-2 md:px-3 lg:px-4">
          <div className="flex items-center gap-8 py-4 px-4 md:px-7">
            <div className="flex justify-evenly items-center gap-6 overflow-x-auto no-scrollbar">
              {[...Array(deviceType === DeviceType.mobile ? 10 : 51)].map(
                (_, index) => (
                  <Shimmer key={index} />
                )
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          {productTags && productTags?.length > 0 ? (
            <div className="py-1 md:py-2 bg-white px-2 md:px-3 lg:px-4">
              <div
                className="flex items-center gap-8 py-4
      px-4 md:px-7"
              >
                <div
                  ref={categoriesContainerRef}
                  className="flex justify-evenly items-center gap-6 overflow-x-auto no-scrollbar"
                >
                  {productTags.map((tag: ProductTag, index: number) => (
                    <span
                      key={index}
                      className="flex flex-col items-center gap-1 md:min-w-[80px] flex-shrink-0 cursor-pointer"
                      onClick={() => toggleCategoryFilter(tag?.id)}
                    >
                      <div className="flex items-center justify-center">
                        <span
                          className={`${`${
                            comprehensiveProductFilters?.categories?.includes(
                              tag?.id
                            )
                              ? "text-primary"
                              : "text-gray-500"
                          }`}`}
                        >
                          <Image
                            width={10}
                            height={10}
                            src={tag?.icon as string}
                            alt="Tag Icon"
                          />
                        </span>
                      </div>
                      <span
                        className={`text-sm md:text-xs text-center ${
                          comprehensiveProductFilters?.categories?.includes(
                            tag?.id
                          )
                            ? "text-primary"
                            : "text-gray-500"
                        }`}
                      >
                        {tag.name}
                      </span>
                    </span>
                  ))}
                </div>
                <button
                  className="bg-white hover:text-primary flex-shrink-0"
                  onClick={() => {
                    if (categoriesContainerRef.current) {
                      categoriesContainerRef.current.scrollBy({
                        left: 100,
                        behavior: "smooth",
                      });
                    }
                  }}
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const isProcessingRequest = state.loading.effects.settings.getProductTags;
  const { productTags } = state.settings;
  const { comprehensiveProductFilters } = state.products;
  return {
    isProcessingRequest,
    comprehensiveProductFilters,
    productTags,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  toggleCategoryFilter: (categoryId: string) =>
    dispatch.products.toggleCategoryFilter(categoryId),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductsTags);
