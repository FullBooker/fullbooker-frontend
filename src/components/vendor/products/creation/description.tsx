import React, { FC, useEffect, useState } from "react";
import { RootState } from "@/store";
import { connect } from "react-redux";
import * as yup from "yup";
import { NewProductPayload, UpdateProductPayload } from "@/domain/dto/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import NavigationButtons from "./navigationButtons";
import StepHeader from "./stepHeader";
import { ProductType } from "@/domain/constants";
import {
  Calendar,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  RefreshCcw,
} from "lucide-react";

type ProductInfoProps = {
  setNewProductDetails: (payload: NewProductPayload) => void;
  newProduct: NewProductPayload;
  registerProduct: (payload: NewProductPayload) => void;
  isProcessingRequest: boolean;
  updateProduct: (payload: UpdateProductPayload) => void;
  setProductType: (payload: ProductType) => void;
};

const ProductInfo: FC<ProductInfoProps> = ({
  newProduct,
  setNewProductDetails,
  registerProduct,
  isProcessingRequest,
  updateProduct,
  setProductType,
}) => {
  const defaultValues = {
    name: newProduct?.name || "",
    description: newProduct?.description || "",
    product_type: "",
  };

  interface ProductOption {
    id: ProductType;
    icon: any;
    title: string;
    description: string;
    example: string;
  }

  const productOptions: Array<ProductOption> = [
    {
      id: ProductType.oneTime,
      icon: <Calendar size={32} />,
      title: "One-time",
      description: "A single-day event happening on a specific date.",
      example: "Example: Concert, product launch, seminar.",
    },
    {
      id: ProductType.multiDay,
      icon: <CheckCircle size={32} />,
      title: "Multi-day (Single Booking)",
      description: "Spans multiple days, one ticket covers all days.",
      example: "Example: 3-day conference, weekend retreat.",
    },
    {
      id: ProductType.recurring,
      icon: <RefreshCcw size={32} />,
      title: "Recurring (Multiple Bookings)",
      description: "Happens on different dates, users book specific sessions.",
      example: "Example: Weekly yoga, recurring workshop.",
    },
    {
      id: ProductType.ongoing,
      icon: <Clock size={32} />,
      title: "Ongoing (Open Booking Window)",
      description: "Runs for a period, users book any date.",
      example: "Example: Museum exhibition, open-entry training.",
    },
  ];

  interface FormData {
    name: string;
    description?: string;
    product_type: string;
  }

  const schema = yup.object().shape({
    name: yup.string().required("Event name is required"),
    description: yup.string(),
    product_type: yup.string().required("Product type is required"),
  });

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    const { name, description } = data;
    const payload = {
      ...newProduct,
      name: name,
      description: description,
    } as NewProductPayload;
    setNewProductDetails(payload);
    newProduct?.id
      ? updateProduct({
          ...payload,
          id: newProduct?.id,
          name: name,
          description: description,
        } as UpdateProductPayload)
      : registerProduct({
          ...payload,
          active: false,
        });
  };
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(
    null
  );

  const handleProductOptionSelect = (option: ProductOption) => {
    setSelectedOption(option);
    setProductType(option?.id);
    setValue("product_type", option?.id);
  };

  const handleBackToProductTypeOptions = () => {
    setSelectedOption(null);
    setValue("product_type", "");

    setProductType(ProductType.default);
  };

  useEffect(() => {
    if (newProduct?.name) {
      setValue("name", newProduct?.name);
    }

    if (newProduct?.description) {
      setValue("description", newProduct?.description);
    }
  }, [newProduct?.name, newProduct?.description]);

  return (
    <div className="md:pb-[200px]">
      <StepHeader title="More information about this event" />
      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <div className="px-0 md:px-20 ">
          <div className="mb-4 md:mb-10">
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <div>
                  {!selectedOption ? (
                    <div>
                      {productOptions.map(
                        (option: ProductOption, index: number) => (
                          <div
                            key={index}
                            className={`flex justify-between items-center w-full mb-3 md:mb-8 border rounded-sm bg-gray-100  p-4 cursor-pointer`}
                            onClick={() => handleProductOptionSelect(option)}
                          >
                            <div>
                              <div className="flex items-center w-full">
                                <span className="me-2 text-primary">{option?.icon}</span>
                                <span className="text-black">
                                  {option?.title}
                                </span>
                              </div>
                              <div>
                                <p className="text-gray-500 text-sm mt-1">
                                  {option?.description}
                                </p>
                                <p className="text-gray-500 mt-1 text-xs">
                                  {option?.example}
                                </p>
                              </div>
                            </div>
                            <div>
                              <ChevronRight className="h-5 w-5 text-gray-500" />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div>
                      <button
                        className="flex items-center mb-4 cursor-pointer text-gray-600"
                        onClick={() => handleBackToProductTypeOptions()}
                      >
                        <ChevronLeft className="h-5 w-5 mr-1" />
                        <span>Back to product types</span>
                      </button>

                      <div className="relative mb-6 border border-primary bg-white rounded-sm p-4">
                        <span className="absolute top-1 right-1 bg-primary text-white text-xs font-light px-2 py-1 rounded-full">
                          Selected
                        </span>

                        <div>
                          <div className="flex items-center w-full">
                          <span className="me-2 text-primary">{selectedOption?.icon}</span>
                            <span className="text-black">
                              {selectedOption?.title}
                            </span>
                          </div>
                          <div>
                            <p className="text-gray-500 text-sm mt-1">
                              {selectedOption?.description}
                            </p>
                            <p className="text-gray-500 mt-1 text-xs">
                              {selectedOption?.example}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            />
             {errors?.product_type?.message && (
              <p className="text-red-500">{errors?.product_type?.message}</p>
            )}
          </div>
          <div className="mb-4 md:mb-10">
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <input
                  type="text"
                  placeholder="Provide the name of this event:"
                  className="border border-primary p-3 w-full font-light text-black outline-none"
                  onChange={onChange}
                  value={value}
                />
              )}
            />
            {errors?.name?.message && (
              <p className="text-red-500">{errors?.name?.message}</p>
            )}
          </div>
          <div className="mb-4 md:mb-10">
            <Controller
              name="description"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <textarea
                  placeholder="Provide any other details about this event. (optional)"
                  className="border border-primary p-3 w-full mb-4 md:8 h-[230px] md:h-[300px] font-light outline-none"
                  onChange={onChange}
                  value={value}
                ></textarea>
              )}
            />
            {errors?.description?.message && (
              <p className="text-red-500">{errors?.description?.message}</p>
            )}
          </div>
        </div>
        <NavigationButtons
          isFormSubmit
          isProcessingRequest={isProcessingRequest}
        />
      </form>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const isProcessingRequest =
    state.loading.effects.vendor.registerProduct ||
    state.loading.effects.vendor.updateProduct;
  const { newProduct } = state.vendor;
  return {
    isProcessingRequest,
    newProduct,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  setNewProductDetails: (payload: NewProductPayload) =>
    dispatch.vendor.setNewProductDetails(payload),
  registerProduct: (payload: NewProductPayload) =>
    dispatch.vendor.registerProduct(payload),
  updateProduct: (payload: UpdateProductPayload) =>
    dispatch.vendor.updateProduct(payload),
  setProductType: (payload: ProductType) =>
    dispatch.vendor.setProductType(payload),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductInfo);
