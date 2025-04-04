"use client";

import React, { FC } from "react";
import { connect } from "react-redux";
import { RootState } from "@/store";
import "react-loading-skeleton/dist/skeleton.css";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ModalID } from "@/domain/components";
import useIsMobile from "@/lib/hooks/useIsMobile";
import { ComprehensiveProductFilters } from "@/domain/dto/product.input";
import { formatProductFilters } from "@/utilities";

import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

type SearchFiltersProps = {
  comprehensiveProductFilters: ComprehensiveProductFilters;
  setActiveModal: (modalId: ModalID) => void;
  setcomprehensiveProductFilters: (
    payload: ComprehensiveProductFilters
  ) => void;
  fetchFilteredProducts: (filters: ComprehensiveProductFilters) => void;
  addSearchKeyword: (search: string) => void;
  removeSearchKeyword: (search: string) => void;
  searchHistory: Array<string>;
};

const SearchFilters: FC<SearchFiltersProps> = ({
  comprehensiveProductFilters,
  setActiveModal,
  setcomprehensiveProductFilters,
  fetchFilteredProducts,
  addSearchKeyword,
  removeSearchKeyword,
  searchHistory,
}) => {
  const isMobile = useIsMobile();
  const [showHistory, setShowHistory] = React.useState(false);

  const defaultValues = {
    search: "",
  };

  interface FormData {
    search: string;
  }

  const schema = yup.object().shape({
    search: yup.string().required("search is required"),
  });

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    const { search } = data;
    if (!search.trim()) return;
    addSearchKeyword(search);
    fetchFilteredProducts({ search: search });
  };
  return (
    <div className="flex justify-center max-w-7xl mx-auto w-full py-2 md:py-6 px-4 md:px-3">
      <div className="relative w-full md:w-[90%] rounded-lg border border-inputBorderColor p-3 md:p-4 lg:p-5">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Search
            width={isMobile ? 20 : 30}
            height={isMobile ? 20 : 30}
            className="text-gray-400 cursor-pointer"
            onClick={() => {
              if (comprehensiveProductFilters?.search) {
                fetchFilteredProducts({
                  search: comprehensiveProductFilters?.search,
                });
              }
            }}
          />
        </div>
        <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="search"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <input
                type="text"
                placeholder="Search for activities and events"
                className="w-full outline-none bg-transparent pl-8 text-sm"
                value={value}
                onChange={(e) => {
                  setcomprehensiveProductFilters({
                    ...comprehensiveProductFilters,
                    search: e.target.value,
                  } as ComprehensiveProductFilters);
                  onChange(e);
                }}
                onFocus={() => setShowHistory(true)}
                onBlur={() => setTimeout(() => setShowHistory(false), 200)}
              />
            )}
          />
        </form>
        {showHistory && searchHistory?.length > 0 && (
          <div className="absolute top-full left-0 w-full bg-white shadow-md rounded mt-2 z-10">
            {searchHistory?.map((search: string, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center px-3 py-2 cursor-pointer hover:bg-gray-100"
              >
                <span
                  className="cursor-pointer text-gray-600"
                  onClick={() => fetchFilteredProducts({ search })}
                >
                  {search}
                </span>
                <button
                  onClick={() => removeSearchKeyword(search)}
                  className="text-gray-500 hover:text-red-500 cursor-pointer"
                >
                  <X className="w-5 h-5 text-blue-400" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
          onClick={() => setActiveModal(ModalID.comprehensiveProductFilters)}
        >
          <SlidersHorizontal
            width={isMobile ? 20 : 30}
            height={isMobile ? 20 : 30}
            className="text-gray-400"
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const { comprehensiveProductFilters, searchHistory } = state.products;
  return {
    comprehensiveProductFilters,
    searchHistory,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  setActiveModal: (modalId: ModalID) =>
    dispatch.components.setActiveModal(modalId),
  setcomprehensiveProductFilters: (payload: ComprehensiveProductFilters) =>
    dispatch.products.setComprehensiveeProductFilters(payload),
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
  addSearchKeyword: (search: string) =>
    dispatch.products.addSearchKeyword(search),
  removeSearchKeyword: (search: string) =>
    dispatch.products.removeSearchKeyword(search),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchFilters);
