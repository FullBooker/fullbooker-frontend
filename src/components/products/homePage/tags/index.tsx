import React, { FC, useRef, useState, useEffect } from "react";
import { ProductTag } from "@/domain/dto/output";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { connect } from "react-redux";
import { RootState } from "@/store";
import { ComprehensiveProductFilters } from "@/domain/dto/product.input";
import useDeviceType from "@/lib/hooks/useDeviceType";
import { DeviceType } from "../../../../domain/constants";
import Image from "next/image";
import { formatProductFilters } from "@/utilities";
import { ModalID } from "@/domain/components";
import { ProductTagsFilters } from "@/domain/dto/input/settings.input";

type ProductTagsProps = {
  isProcessingRequest: boolean;
  toggleTagFilter: (tagIg: string) => void;
  comprehensiveProductFilters: ComprehensiveProductFilters;
  productTags: Array<ProductTag>;
  fetchFilteredProducts: (filters: ComprehensiveProductFilters) => void;
  getProductTags: (filters: ProductTagsFilters) => void;
};

const ProductsTags: FC<ProductTagsProps> = ({
  toggleTagFilter,
  comprehensiveProductFilters,
  productTags,
  isProcessingRequest,
  fetchFilteredProducts,
  getProductTags,
}) => {
  const deviceType = useDeviceType();
  const categoriesContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const handleScrollLeft = () => {
    if (categoriesContainerRef.current) {
      categoriesContainerRef.current.scrollBy({
        left: -100,
        behavior: "smooth",
      });
    }
  };

  const handleScrollRight = () => {
    if (categoriesContainerRef.current) {
      categoriesContainerRef.current.scrollBy({
        left: 100,
        behavior: "smooth",
      });
    }
  };

  const checkOverflow = () => {
    if (!categoriesContainerRef.current) {
      return;
    }

    const container = categoriesContainerRef.current;
    const { scrollWidth, clientWidth, scrollLeft } = container;

    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  };

  useEffect(() => {
    setTimeout(checkOverflow, 100);
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [productTags]);

  useEffect(() => {
    const container = categoriesContainerRef.current;
    if (container) {
      categoriesContainerRef.current.addEventListener("scroll", checkOverflow);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", checkOverflow);
      }
    };
  }, []);

  useEffect(() => {
    getProductTags({
      page: 1,
      page_size: 100,
    } as ProductTagsFilters);
  }, []);

  return (
    <div>
      {isProcessingRequest ? (
        <div className="py-1 md:py-2 bg-white px-2 md:px-3 lg:px-4">
          <div className="flex items-center gap-8 py-4 px-4 md:px-7">
            <div className="flex justify-evenly items-center gap-6 overflow-x-auto no-scrollbar">
              {[...Array(deviceType === DeviceType.mobile ? 10 : 51)].map(
                (_, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-1 md:min-w-[80px] flex-shrink-0 animate-pulse"
                  >
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div className="w-12 h-4 bg-gray-300 rounded"></div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          {productTags && productTags?.length > 0 ? (
            <div className={`bg-white px-2 md:px-3 lg:px-4 `}>
              <div className="flex justify-center items-center gap-2 px-2 py-2 md:py-0 md:px-7">
                {canScrollLeft && (
                  <button
                    className="bg-white hover:text-primary flex-shrink-0"
                    onClick={() => {
                      handleScrollLeft();
                      checkOverflow();
                    }}
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                )}
                <div
                  ref={categoriesContainerRef}
                  className="flex md:justify-evenly items-center gap-10 md:gap-6 overflow-x-auto no-scrollbar"
                >
                  {productTags.map((tag: ProductTag, index: number) => (
                    <span
                      key={index}
                      className={`flex flex-col items-center gap-1 md:min-w-[80px] flex-shrink-0 cursor-pointer pb-2  ${
                        comprehensiveProductFilters?.tag === tag?.id
                          ? "border-b-2 border-primary"
                          : ""
                      }`}
                      onClick={() => {
                        toggleTagFilter(tag?.id);
                        if (
                          !comprehensiveProductFilters?.tag ||
                          (comprehensiveProductFilters?.tag &&
                            comprehensiveProductFilters?.tag !== tag?.id)
                        ) {
                          fetchFilteredProducts({ tag: tag?.id });
                        }
                      }}
                    >
                      <div className="flex items-center justify-center">
                        <span
                          className={`${
                            comprehensiveProductFilters?.tag &&
                            comprehensiveProductFilters?.tag === tag?.id
                              ? "text-primary"
                              : "text-gray-500"
                          }`}
                        >
                          <Image
                            width={deviceType === DeviceType.mobile ? 24 : 30}
                            height={deviceType === DeviceType.mobile ? 24 : 30}
                            src={tag?.icon as string}
                            alt="Tag Icon"
                            unoptimized={true}
                          />
                        </span>
                      </div>
                      <span
                        className={`text-xs md:text-xs text-center ${
                          comprehensiveProductFilters?.tag &&
                          comprehensiveProductFilters?.tag === tag?.id
                            ? "text-primary"
                            : "text-gray-500"
                        }`}
                      >
                        {tag.name}
                      </span>
                    </span>
                  ))}
                </div>
                {canScrollRight && (
                  <button
                    className="bg-white hover:text-primary flex-shrink-0"
                    onClick={() => {
                      handleScrollRight();
                      checkOverflow();
                    }}
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                )}
              </div>
            </div>
          ) : null}
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
  getProductTags: (filters: ProductTagsFilters) =>
    dispatch.settings.getProductTags(filters),
  toggleTagFilter: (tagId: string) => dispatch.products.toggleTagFilter(tagId),
  fetchFilteredProducts: (filters: ComprehensiveProductFilters) => {
    const formattedFilters = formatProductFilters(filters);
    const finalFilters = {
      ...formattedFilters,
      page: 1,
      page_size: 5,
      tag: filters?.tag,
    } as any;
    dispatch.products.getPopularProducts(finalFilters);
    dispatch.products.getNearByProducts(finalFilters);
    dispatch.products.getPopularProducts(finalFilters);
    dispatch.products.getRecommendedProducts(finalFilters);
    dispatch.products.getUpcomingProducts(finalFilters);
    dispatch.components.setActiveModal(ModalID.none);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductsTags);
