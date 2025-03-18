import React, { FC, useEffect } from "react";
import { RootState } from "@/store";
import { connect } from "react-redux";
import * as yup from "yup";
import { NewProductPayload, UpdateProductPayload } from "@/domain/dto/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import NavigationButtons from "./navigationButtons";
import StepHeader from "./stepHeader";

type ProductInfoProps = {
  setNewProductDetails: (payload: NewProductPayload) => void;
  newProduct: NewProductPayload;
  registerProduct: (payload: NewProductPayload) => void;
  isProcessingRequest: boolean;
  updateProduct: (payload: UpdateProductPayload) => void;
};

const ProductInfo: FC<ProductInfoProps> = ({
  newProduct,
  setNewProductDetails,
  registerProduct,
  isProcessingRequest,
  updateProduct,
}) => {
  const defaultValues = {
    name: newProduct?.name || "",
    description: newProduct?.description || "",
  };

  interface FormData {
    name: string;
    description?: string;
  }

  const schema = yup.object().shape({
    name: yup.string().required("Event name is required"),
    description: yup.string(),
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

  useEffect(() => {
    if (newProduct?.name) {
      setValue("name", newProduct?.name);
    }

    if (newProduct?.description) {
      setValue("description", newProduct?.description);
    }
  }, [newProduct?.name, newProduct?.description]);

  return (
    <div>
      <StepHeader title="More information about this event" />
      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <div className="px-0 md:px-20 ">
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
        <div className="px-2 md:px-10 mt-4 md:mt-10">
          <NavigationButtons
            isFormSubmit
            isProcessingRequest={isProcessingRequest}
          />
        </div>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductInfo);
