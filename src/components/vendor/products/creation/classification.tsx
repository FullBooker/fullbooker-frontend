"use client";

import React, { FC, useEffect } from "react";
import { RootState } from "@/store";
import { connect } from "react-redux";
import { ProductCategory, Subcategory } from "@/domain/dto/output";
import { NewProductPayload } from "@/domain/dto/input";
import NavigationButtons from "./navigationButtons";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { ProductType } from "@/domain/constants";
import StepHeader from "./stepHeader";

type ProductClassificationProps = {
  productCategories: Array<ProductCategory>;
  loading: boolean;
  getProductCategories: () => void;
  setNewProductDetails: (payload: NewProductPayload) => Promise<void>;
  newProduct: NewProductPayload;
  setProductType: (payload: ProductType) => void;
  setActiveStep: (step: number) => void;
  activeStep: number;
};

const ProductClassification: FC<ProductClassificationProps> = ({
  productCategories,
  loading,
  getProductCategories,
  newProduct,
  setNewProductDetails,
  setProductType,
  activeStep,
  setActiveStep,
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
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: newProduct?.category || "",
      subcategory: newProduct?.subcategory || "",
    },
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    const { category, subcategory } = data;
    setNewProductDetails({
      ...newProduct,
      category: category,
      subcategory: subcategory,
    } as NewProductPayload).then(() => {
      setActiveStep(activeStep + 1);
    });
  };

  useEffect(() => {
    getProductCategories();
  }, []);

  useEffect(() => {
    if (newProduct?.category) {
      setValue("category", newProduct?.category);
    }

    if (newProduct?.subcategory) {
      setValue("subcategory", newProduct?.subcategory);
    }
  }, [newProduct?.category, newProduct?.subcategory]);

  const flattenSubcategories = (
    subs: Subcategory[],
    level = 0
  ): Array<{ id: string; name: string }> => {
    let result: Array<{ id: string; name: string }> = [];

    subs.forEach((sub) => {
      result.push({ id: sub.id, name: `${"— ".repeat(level)}${sub.name}` });

      if (sub.children && sub.children.length > 0) {
        result = result.concat(flattenSubcategories(sub.children, level + 1));
      }
    });

    return result;
  };

  return (
    <div>
      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <StepHeader title=" Choose the one that best describes your product" />
        <div className="px-0 md:px-20 lg:px-20 xl:px-20">
          {loading ? (
            <div>
              {Array(5)
                .fill(null)
                .map((_, index) => (
                  <div key={index} className="flex w-full mb-3 md:mb-8">
                    <div className="animate-pulse bg-gray-200 h-12 w-[40%] rounded"></div>
                    <div className="animate-pulse bg-gray-200 h-12 w-[60%] ml-2 rounded"></div>
                  </div>
                ))}
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
                        render={({ field: { value, onChange } }) => {
                          const flattenedSubcategories = flattenSubcategories(
                            category?.subcategories || []
                          );

                          return (
                            <select
                              className="w-full border-none outline-none"
                              value={value}
                              onChange={onChange}
                            >
                              {!watch("subcategory") ? (
                                <option value="">Select a subcategory</option>
                              ) : (
                                <option value=""></option>
                              )}
                              {flattenedSubcategories.map((sub, idx) => (
                                <option key={idx} value={sub.id}>
                                  {sub.name}
                                </option>
                              ))}
                            </select>
                          );
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </>
          )}
          <div className="flex items-center">
            {errors?.category?.message && (
              <p className="text-red-500 me-1">{errors?.category?.message}</p>
            )}
            {errors?.subcategory?.message && (
              <p className="text-red-500">{errors?.subcategory?.message}</p>
            )}
          </div>
        </div>
        <div className="px-2 md:px-10 mt-4 md:mt-10">
          <NavigationButtons isFormSubmit />
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const loading = state.loading.models.settings;
  const { productCategories } = state.settings;
  const { newProduct, activeStep } = state.vendor;
  return {
    productCategories,
    loading,
    newProduct,
    activeStep,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  getProductCategories: () => dispatch.settings.getProductCategories(),
  setNewProductDetails: async (payload: NewProductPayload) =>
    dispatch.vendor.setNewProductDetails(payload),
  setProductType: (payload: ProductType) =>
    dispatch.vendor.setProductType(payload),
  setActiveStep: (step: number) => dispatch.vendor.setActiveStep(step),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductClassification);
