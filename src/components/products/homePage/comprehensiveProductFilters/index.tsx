"use client";

import React, { FC } from "react";
import { connect } from "react-redux";
import { Dispatch, RootState } from "@/store";
import "react-loading-skeleton/dist/skeleton.css";
import { Currency, ProductCategory } from "@/domain/dto/output";
import Button from "@/components/shared/button";
import UniversalModal from "@/components/layout/modal/UniversalModal";
import { useThemeMode } from "@/lib/hooks/useTheme";
import { Checkbox, Slider } from "@mui/material";
import FilterAccordion from "./filterAccordion";
import { KENYAN_COUNTIES } from "@/constants";
import { County } from "@/domain/location";
import { ComprehensiveProductFilters } from "@/domain/dto/product.input";
import { addCommaSeparators, formatProductFilters } from "@/utilities";
import Box from "@mui/material/Box";
import { ModalID } from "@/domain/components";

type SearchFiltersProps = {
  setComprehensiveeProductFilters: (
    payload: ComprehensiveProductFilters
  ) => void;
  comprehensiveProductFilters: ComprehensiveProductFilters | null;
  productCategories: Array<ProductCategory>;
  toggleCategoryFilter: (categoryId: string) => void;
  toggleLocationFilter: (location: County) => void;
  clearProductComprehensiveFilters: () => void;
  fetchFilteredProducts: (filters: ComprehensiveProductFilters) => void;
};

const ComprehensiveSearchFilters: FC<SearchFiltersProps> = ({
  productCategories,
  comprehensiveProductFilters,
  setComprehensiveeProductFilters,
  toggleCategoryFilter,
  toggleLocationFilter,
  clearProductComprehensiveFilters,
  fetchFilteredProducts,
}) => {
  const { themeMode } = useThemeMode();
  const [value, setValue] = React.useState<number[]>([
    parseInt(comprehensiveProductFilters?.min_price as string) || 0,
    parseInt(comprehensiveProductFilters?.max_price as string) || 10000,
  ]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
    if (Array.isArray(newValue)) {
      setComprehensiveeProductFilters({
        ...comprehensiveProductFilters,
        min_price: newValue[0].toString(),
        max_price: newValue[1].toString(),
      } as ComprehensiveProductFilters);
    }
  };

  return (
    <UniversalModal
      theme={themeMode}
      open={true}
      title={"Filters"}
      content={
        <div className="md:px-2">
          <div className="mb-3">
            <FilterAccordion title="Pricing">
              <Box sx={{ width: "100%" }}>
                <Slider
                  getAriaLabel={() => "Price range"}
                  value={value}
                  onChange={handleChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100000}
                  sx={{
                    color: "#FC8135",
                    height: "5px",
                    "& .MuiSlider-thumb": {
                      backgroundColor: "#FFF",
                    },
                    "& .MuiSlider-track": {
                      backgroundColor: "#FC8135",
                    },
                    "& .MuiSlider-rail": {
                      backgroundColor: "#E3E3E3",
                    },
                  }}
                />
                <div className="flex justify-between items-center">
                  <div className="text-center space-y-2">
                    <p className="text-center">Minimum</p>
                    <p className="text-sm border border-gray-400 rounded-lg p-2">
                      KES{" "}
                      {addCommaSeparators(
                        parseInt(
                          comprehensiveProductFilters?.min_price as string
                        )
                      ) || 0}
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-center">Maximum</p>
                    <p className="text-sm border border-gray-400 rounded-lg p-2">
                      KES{" "}
                      {addCommaSeparators(
                        parseInt(
                          comprehensiveProductFilters?.max_price as string
                        )
                      ) || 0}
                    </p>
                  </div>
                </div>
              </Box>
            </FilterAccordion>
          </div>
          <div className="mb-3">
            <FilterAccordion title="Dates">
              <div className="mb-4">
                <div className="mb-4">
                  <p className="font-medium">Date range</p>
                </div>
                <div className="flex gap-6">
                  <div className="w-1/2">
                    <p>From</p>
                    <input
                      type="date"
                      placeholder="From"
                      className=" p-2 border border-gray-300 rounded w-full"
                      value={comprehensiveProductFilters?.start_date}
                      onChange={(e) =>
                        setComprehensiveeProductFilters({
                          ...comprehensiveProductFilters,
                          start_date: e.target.value,
                        } as ComprehensiveProductFilters)
                      }
                    />
                  </div>
                  <div className="w-1/2">
                    <p>To</p>
                    <input
                      type="date"
                      placeholder="To"
                      className=" p-2 border border-gray-300 rounded w-full"
                      value={comprehensiveProductFilters?.end_date}
                      onChange={(e) =>
                        setComprehensiveeProductFilters({
                          ...comprehensiveProductFilters,
                          end_date: e.target.value,
                        } as ComprehensiveProductFilters)
                      }
                    />
                  </div>
                </div>
              </div>
            </FilterAccordion>
          </div>
          <div className="mb-3">
            <FilterAccordion title="Location">
              <div className="flex">
                <div className="w-1/2">
                  {KENYAN_COUNTIES?.slice(
                    0,
                    Math.ceil(KENYAN_COUNTIES.length / 2)
                  ).map((county: County, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        className="text-primary"
                        checked={comprehensiveProductFilters?.locations?.some(
                          (loc) => loc === county
                        )}
                        onClick={() => toggleLocationFilter(county)}
                      />
                      <p className="">{county?.name}</p>
                    </div>
                  ))}
                </div>
                <div className="w-1/2">
                  {KENYAN_COUNTIES?.slice(
                    Math.ceil(KENYAN_COUNTIES.length / 2)
                  ).map((county: County, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        className="text-primary"
                        checked={comprehensiveProductFilters?.locations?.some(
                          (loc) => loc === county
                        )}
                        onClick={() => toggleLocationFilter(county)}
                      />
                      <p className="">{county?.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FilterAccordion>
          </div>
          <div className="mb-3">
            <FilterAccordion title="Category">
              <div className="mb-4 ">
                <div>
                  {productCategories?.map(
                    (category: ProductCategory, index: number) => (
                      <div key={index} className="flex items-center space-x-1">
                        <Checkbox
                          className="text-primary"
                          checked={comprehensiveProductFilters?.categories?.includes(
                            category?.id
                          )}
                          onClick={() => toggleCategoryFilter(category?.id)}
                        />
                        <p className="">{category?.name}</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </FilterAccordion>
          </div>
        </div>
      }
      showDividers={true}
      footer={
        <div className="flex justify-between gap-6 bg-white w-full py-2 px-2">
          <Button
            width="w-full"
            bg="bg-primary"
            borderRadius="rounded"
            margin="mb-2"
            text="text-black"
            padding="py-2 px-2 md:px-3"
            isSecondary
            onClick={() => clearProductComprehensiveFilters()}
          >
            Clear Filters
          </Button>
          <Button
            width="w-full"
            bg="bg-primary"
            borderRadius="rounded"
            margin="mb-2"
            text="text-white"
            padding="py-2 px-2 md:px-3"
            onClick={() =>
              fetchFilteredProducts(
                comprehensiveProductFilters as ComprehensiveProductFilters
              )
            }
          >
            Apply Filters
          </Button>
        </div>
      }
    />
  );
};

const mapStateToProps = (state: RootState) => {
  const { comprehensiveProductFilters } = state.products;
  const { productCategories, currencies } = state.settings;
  return {
    comprehensiveProductFilters,
    productCategories,
    currencies,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setComprehensiveeProductFilters: (payload: ComprehensiveProductFilters) =>
    dispatch.products.setComprehensiveeProductFilters(payload),
  toggleCategoryFilter: (categoryId: string) =>
    dispatch.products.toggleCategoryFilter(categoryId),
  toggleLocationFilter: (location: County) =>
    dispatch.products.toggleLocationFilter(location),
  clearProductComprehensiveFilters: () =>
    dispatch.products.clearProductComprehensiveFilters(),
  fetchFilteredProducts: (filters: ComprehensiveProductFilters) => {
    const formattedFilters = formatProductFilters(filters);
    const finalFilters = {
      ...formattedFilters,
      page: 1,
      page_size: 5,
    } as any;
    dispatch.products.getPopularProducts(finalFilters);
    dispatch.products.getNearByProducts(finalFilters);
    dispatch.products.getPopularProducts(finalFilters);
    dispatch.products.getRecommendedProducts(finalFilters);
    dispatch.products.getUpcomingProducts(finalFilters);
    dispatch.components.setActiveModal(ModalID.none);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ComprehensiveSearchFilters);
