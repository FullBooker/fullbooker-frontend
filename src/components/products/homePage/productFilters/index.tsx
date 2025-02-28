"use client";

import React, { FC } from "react";
import { connect } from "react-redux";
import { RootState } from "@/store";
import "react-loading-skeleton/dist/skeleton.css";
import { ProductsFilters } from "@/domain/dto/input";
import { ComprehensiveProductFilters } from "@/domain/product";
import { Search, SlidersHorizontal } from "lucide-react";
import { ModalID } from "@/domain/components";

type SearchFiltersProps = {
  productFilters: ComprehensiveProductFilters;
  setActiveModal: (modalId: ModalID) => void;
  setProductFilters: (payload: ComprehensiveProductFilters) => void;
};

const SearchFilters: FC<SearchFiltersProps> = ({
  productFilters,
  setActiveModal,
  setProductFilters,
}) => {
  return (
    <div className="flex justify-center max-w-7xl mx-auto w-full py-2 md:py-6 px-4 md:px-3">
      <div className="relative w-full md:w-[50%] rounded-lg border border-inputBorderColor p-3">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Search width={20} height={20} />
        </div>
        <input
          type="text"
          placeholder="Search for activities and events"
          className="w-full outline-none bg-transparent pl-8 text-sm"
          value={productFilters?.keyword || ""}
          onChange={(e) =>
            setProductFilters({
              ...productFilters,
              keyword: e.target.value,
            } as ComprehensiveProductFilters)
          }
        />
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
          onClick={() => setActiveModal(ModalID.productFilters)}
        >
          <SlidersHorizontal width={20} height={20} />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const { productFilters } = state.products;
  return {
    productFilters,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  setActiveModal: (modalId: ModalID) =>
    dispatch.components.setActiveModal(modalId),
  setProductFilters: (payload: ComprehensiveProductFilters) =>
    dispatch.products.getProducts(payload),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchFilters);
