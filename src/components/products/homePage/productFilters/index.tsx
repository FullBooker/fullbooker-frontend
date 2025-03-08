"use client";

import React, { FC } from "react";
import { connect } from "react-redux";
import { RootState } from "@/store";
import "react-loading-skeleton/dist/skeleton.css";
import { Search, SlidersHorizontal } from "lucide-react";
import { ModalID } from "@/domain/components";
import useIsMobile from "@/lib/hooks/useIsMobile";
import { ComprehensiveProductFilters } from "@/domain/dto/product.input";

type SearchFiltersProps = {
  comprehensiveProductFilters: ComprehensiveProductFilters;
  setActiveModal: (modalId: ModalID) => void;
  setcomprehensiveProductFilters: (
    payload: ComprehensiveProductFilters
  ) => void;
};

const SearchFilters: FC<SearchFiltersProps> = ({
  comprehensiveProductFilters,
  setActiveModal,
  setcomprehensiveProductFilters,
}) => {
  const isMobile = useIsMobile();
  return (
    <div className="flex justify-center max-w-7xl mx-auto w-full py-2 md:py-6 px-4 md:px-3">
      <div className="relative w-full md:w-[90%] rounded-lg border border-inputBorderColor p-3 md:p-4 lg:p-5">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Search
            width={isMobile ? 20 : 30}
            height={isMobile ? 20 : 30}
            className="text-gray-400"
          />
        </div>
        <input
          type="text"
          placeholder="Search for activities and events"
          className="w-full outline-none bg-transparent pl-8 text-sm"
          onChange={(e) =>
            setcomprehensiveProductFilters({
              ...comprehensiveProductFilters,
              keyword: e.target.value,
            } as ComprehensiveProductFilters)
          }
        />
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
  const { comprehensiveProductFilters } = state.products;
  return {
    comprehensiveProductFilters,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  setActiveModal: (modalId: ModalID) =>
    dispatch.components.setActiveModal(modalId),
  setcomprehensiveProductFilters: (
    payload: ComprehensiveProductFilters
  ) => dispatch.products.setComprehensiveeProductFilters(payload),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchFilters);
