"use client";

import { type FC, useEffect, useState } from "react";
import type { RootState } from "@/store";
import { connect } from "react-redux";
import type { ProductCategory, Subcategory } from "@/domain/dto/output";
import type { NewProductPayload } from "@/domain/dto/input";
import NavigationButtons from "./navigationButtons";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { ProductType } from "@/domain/constants";
import StepHeader from "./stepHeader";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/shared/button";

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
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory | null>(null);
  const [flattenedSubcategories, setFlattenedSubcategories] = useState<
    Array<{ id: string; name: string; level: number }>
  >([]);

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
      const category = productCategories.find(
        (cat) => cat.id === newProduct.category
      );
      if (category) {
        setSelectedCategory(category);
        setFlattenedSubcategories(
          flattenSubcategories(category.subcategories || [])
        );
      }
    }

    if (newProduct?.subcategory) {
      setValue("subcategory", newProduct?.subcategory);
    }
  }, [newProduct?.category, newProduct?.subcategory, productCategories]);

  const flattenSubcategories = (
    subs: Subcategory[],
    level = 0
  ): Array<{ id: string; name: string; level: number }> => {
    let result: Array<{ id: string; name: string; level: number }> = [];

    subs.forEach((sub) => {
      result.push({ id: sub.id, name: sub.name, level });

      if (sub.children && sub.children.length > 0) {
        result = result.concat(flattenSubcategories(sub.children, level + 1));
      }
    });

    return result;
  };

  const handleCategorySelect = (category: ProductCategory) => {
    setSelectedCategory(category);
    setNewProductDetails({
      ...newProduct,
      category: category?.id,
      subcategory: "",
    } as NewProductPayload);
    setValue("category", category?.id);
    setValue("subcategory", "");
    setProductType(
      category?.name?.includes("Event") ? ProductType.event : ProductType.others
    );

    setFlattenedSubcategories(
      flattenSubcategories(category.subcategories || [])
    );
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setFlattenedSubcategories([]);
    setValue("subcategory", "");

    setNewProductDetails({
      ...newProduct,
      category: "",
      subcategory: "",
    } as NewProductPayload);
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    setValue("subcategory", subcategoryId);
    setNewProductDetails({
      ...newProduct,
      subcategory: subcategoryId,
    } as NewProductPayload);
  };

  const getGroupedSubcategories = () => {
    const grouped: {
      [key: number]: Array<{ id: string; name: string; level: number }>;
    } = {};

    flattenedSubcategories.forEach((sub) => {
      if (!grouped[sub.level]) {
        grouped[sub.level] = [];
      }
      grouped[sub.level].push(sub);
    });

    return grouped;
  };

  return (
    <div>
      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <StepHeader title="Choose the one that best describes your product" />
        <div className="px-0 md:px-20 lg:px-20 xl:px-20">
          {loading ? (
            <div>
              {Array(5)
                .fill(null)
                .map((_, index) => (
                  <div key={index} className="flex w-full mb-3 md:mb-8">
                    <div className="animate-pulse bg-gray-200 h-20 w-full rounded"></div>
                  </div>
                ))}
            </div>
          ) : (
            <>
              {!selectedCategory ? (
                productCategories.map(
                  (category: ProductCategory, index: number) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center w-full mb-3 md:mb-8 border rounded-sm bg-gray-100  p-4 cursor-pointer`}
                      onClick={() => handleCategorySelect(category)}
                    >
                      <div>
                        <div className=" items-center w-full">
                          <span className="text-black">{category?.name}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 text-sm mt-1">
                            {category?.description ||
                              "Choose this for " +
                                category?.name.toLowerCase() +
                                " related products"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      </div>
                    </div>
                  )
                )
              ) : (
                <div>
                  <button
                    className="flex items-center mb-4 cursor-pointer text-gray-600"
                    onClick={() => handleBackToCategories()}
                  >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    <span>Back to categories</span>
                  </button>

                  <div className="relative mb-6 border border-primary bg-white rounded-sm p-4">
                    <span className="absolute top-1 right-1 bg-primary text-white text-xs font-light px-2 py-1 rounded-full">
                      Selected
                    </span>

                    <div className="flex justify-between items-center w-full">
                      <span className="text-black font-medium">
                        {selectedCategory.name}
                      </span>
                    </div>

                    <span className="text-gray-500 text-sm mt-1">
                      {selectedCategory?.description ||
                        "Choose this for " +
                          selectedCategory?.name.toLowerCase() +
                          " related products"}
                    </span>
                  </div>

                  <div className="mb-2 text-gray-700">
                    Select a subcategory:
                  </div>
                  {flattenedSubcategories.length === 0 ? (
                    <div className="text-gray-500 text-sm italic bg-gray-100 p-4 rounded">
                      <p>
                        {" "}
                        No subcategories available for this category.{" "}
                        <span
                          className="text-primary cursor-pointer"
                          onClick={() => handleBackToCategories()}
                        >
                          Change category instead
                        </span>
                      </p>
                    </div>
                  ) : (
                    <Controller
                      name="subcategory"
                      control={control}
                      render={({ field }) => {
                        const groupedSubcategories = getGroupedSubcategories();

                        return (
                          <div className="space-y-4">
                            {Object.keys(groupedSubcategories).map((level) => (
                              <div key={level} className="flex flex-wrap gap-2">
                                {groupedSubcategories[
                                  Number.parseInt(level)
                                ].map((sub, idx) => (
                                  <div
                                    key={idx}
                                    className={`
                                    inline-flex items-center px-3 py-1 rounded-full
                                    transition-all duration-200 cursor-pointer text-sm
                                    ${
                                      field.value === sub.id
                                        ? "bg-primary text-white font-medium shadow-sm"
                                        : "bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200"
                                    }
                                  `}
                                    onClick={() =>
                                      handleSubcategorySelect(sub.id)
                                    }
                                  >
                                    <span className="font-light">
                                      {sub.name}
                                    </span>
                                    {field.value === sub.id && (
                                      <Check className="h-3.5 w-3.5 ml-1.5 stroke-[3]" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        );
                      }}
                    />
                  )}
                </div>
              )}
            </>
          )}
          <div className="flex items-center mt-4">
            {errors?.category?.message && (
              <p className="text-red-500 me-1">{errors?.category?.message}</p>
            )}
            {errors?.subcategory?.message && (
              <p className="text-red-500">{errors?.subcategory?.message}</p>
            )}
          </div>
        </div>
        <NavigationButtons isFormSubmit />
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
