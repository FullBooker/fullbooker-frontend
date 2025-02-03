import React, { FC } from "react";
import { RootState } from "@/store";
import { connect } from "react-redux";
import * as yup from "yup";
import { NewProductPayload, UpdateProductPayload } from "@/domain/dto/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import NavigationButtons from "./navigationButtons";

type ProductInfoProps = {
  setNewProductDetails: (payload: NewProductPayload) => void;
  newProduct: NewProductPayload;
  registerProduct: (payload: NewProductPayload) => void;
  loading: boolean;
  updateProduct: (payload: UpdateProductPayload) => void;
};

const ProductInfo: FC<ProductInfoProps> = ({
  newProduct,
  setNewProductDetails,
  registerProduct,
  loading,
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
    setError,
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
      : registerProduct(payload);
  };
  return (
    <div>
      <p className="font-base mt-4 ml-0 md:ml-5 lg:ml-5 xl:ml-5 text-center mb-8 md:mb-20">
        More information about this event
      </p>
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
                  className="border border-primary p-3 w-full mb-4 md:8 h-[150px] md:h-[300px] font-light outline-none"
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
          <NavigationButtons disableNext={true} />
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const loading = state.loading.models.vendor;
  const { newProduct } = state.vendor;
  return {
    loading,
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
