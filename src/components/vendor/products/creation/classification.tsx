"use client";

import React, { FC, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { RootState } from "@/store";
import { connect } from "react-redux";
import { ProductCategory, Subcategory } from "@/domain/dto/output";
import { CircularProgress } from "@mui/material";
import { NewProductPayload } from "@/domain/dto/input";
import NavigationButtons from "./navigationButtons";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { ProductType } from "@/domain/constants";

type ProductClassificationProps = {
  productCategories: Array<ProductCategory>;
  loading: boolean;
  getProductCategories: () => void;
  setNewProductDetails: (payload: NewProductPayload) => void;
  newProduct: NewProductPayload;
  setProductType: (payload: ProductType) => void;
};

const ProductClassification: FC<ProductClassificationProps> = ({
  productCategories,
  loading,
  getProductCategories,
  newProduct,
  setNewProductDetails,
  setProductType,
}) => {
  const defaultValues = {
    category: newProduct?.category || "",
    subcategory: newProduct?.subcategory || "",
  };

  interface FormData {
    category: string;
    subcategory: string;
  }

  const schema = yup.object().shape({
    category: yup.string().required("Category is required"),
    subcategory: yup.string().required("Subcategory is required"),
  });

  const {
    control,
    setError,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    const { category, subcategory } = data;
    setNewProductDetails({
      ...newProduct,
      category: category,
      subcategory: subcategory,
    } as NewProductPayload);
  };

  useEffect(() => {
    getProductCategories();
  }, []);

  return (
    <div>
      <p className="font-base mt-4 ml-0 md:ml-5 lg:ml-5 xl:ml-5">
        Add your products to fullbooker
      </p>
      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-8 md:mt-12 lg:mt-12 xl:mt-12">
          <p className="text-center mb-10 md:mb-12 lg:mb-12 xl:mb-12 font-base">
            Choose the one that best describes your product
          </p>
          <div className="px-0 md:px-20 lg:px-20 xl:px-20">
            {loading ? (
              <div className="flex justify-center items-center">
                <CircularProgress size={18} color="inherit" className="me-2" />
                <span>Fetching categories..</span>
              </div>
            ) : (
              <>
                {productCategories.map(
                  (category: ProductCategory, index: number) => (
                    <div
                      key={index}
                      className="flex w-full mb-3 md:mb-8"
                      onClick={() => {
                        setNewProductDetails({
                          ...newProduct,
                          category: category?.id,
                        } as NewProductPayload);
                        setValue("category", category?.id);
                        setProductType(
                          category?.name?.includes("Event")
                            ? ProductType.event
                            : ProductType.others
                        );
                      }}
                    >
                      <div
                        className={`flex justify-between items-center border ${
                          newProduct?.category === category?.id
                            ? "border-orange-500"
                            : "border-black"
                        } p-4 cursor-pointer w-[40%]`}
                      >
                        <span className="text-black">{category?.name}</span>
                      </div>
                      <div
                        className={`flex justify-between items-center border ${
                          newProduct?.category === category?.id
                            ? "border-orange-500"
                            : "border-black"
                        } p-4 cursor-pointer w-[60%]`}
                      >
                        <Controller
                          name="subcategory"
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <select
                              className="w-full border-none outline-none"
                              value={value}
                              onChange={(e) => {
                                onChange(e);
                                setNewProductDetails({
                                  ...newProduct,
                                  subcategory: value,
                                } as NewProductPayload);
                              }}
                            >
                              <option></option>
                              {category?.subcategories?.map(
                                (sub: Subcategory, idx: number) => (
                                  <option key={idx} value={sub.id}>
                                    {sub?.name}
                                  </option>
                                )
                              )}
                            </select>
                          )}
                        />
                      </div>
                    </div>
                  )
                )}
              </>
            )}
          </div>
          <div className="flex items-center">
            {errors?.category?.message && (
              <p className="text-red-500">{errors?.category?.message}</p>
            )}
            {errors?.subcategory?.message && (
              <p className="text-red-500">{errors?.subcategory?.message}</p>
            )}
          </div>
        </div>
        <div className="px-2 md:px-10 mt-4 md:mt-10">
          <NavigationButtons disableNet={Object.keys(errors).length > 0} />
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const loading = state.loading.models.settings;
  const { productCategories } = state.settings;
  const { newProduct } = state.vendor;
  return {
    productCategories,
    loading,
    newProduct,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  getProductCategories: () => dispatch.settings.getProductCategories(),
  setNewProductDetails: (payload: NewProductPayload) =>
    dispatch.vendor.setNewProductDetails(payload),
  setProductType: (payload: ProductType) =>
    dispatch.vendor.setProductType(payload),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductClassification);
