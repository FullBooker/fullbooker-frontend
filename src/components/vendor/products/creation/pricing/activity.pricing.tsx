"use client";

import React, { FC, useEffect } from "react";
import { Dispatch, RootState } from "@/store";
import { connect } from "react-redux";
import { CircularProgress } from "@mui/material";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addCommaSeparators } from "@/utilities";
import {
  NewProductPayload,
  ProductPricingPayload,
  UpdateProductPricingPayload,
} from "@/domain/dto/input";
import { ProductPricing, SessionPricingCategory } from "@/domain/product";
import Button from "@/components/shared/button";

type ActivityPricingProps = {
  isProcessingRequest: boolean;
  addProductPricing: (payload: ProductPricingPayload) => void;
  updateProductPricing: (payload: UpdateProductPricingPayload) => void;
  newProduct: NewProductPayload;
  currency: string;
  pricingType: SessionPricingCategory;
};

const ActivityPricing: FC<ActivityPricingProps> = ({
  isProcessingRequest,
  addProductPricing,
  newProduct,
  currency,
  pricingType,
  updateProductPricing,
}) => {
  const schema = yup.object().shape({
    id: yup.string(),
    currency: yup.string().required("Currency is required"),
    cost: yup.number().positive().required("Price is required"),
    bulk_discount: yup.number().min(0),
    maximum_number_of_tickets: yup
      .number()
      .positive()
      .required("Maximum tickets for this pricing is required"),
  });

  const checkIdProductHasCurrentPricingInContext = (): boolean => {
    return (
      newProduct?.pricing?.filter(
        (pricing: ProductPricing) => pricing.type === pricingType.key
      )?.length > 0
    );
  };

  const getExisitngProductPricing = (): ProductPricing => {
    return newProduct?.pricing?.find(
      (pricing: ProductPricing) => pricing.type === pricingType.key
    ) as ProductPricing;
  };

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: checkIdProductHasCurrentPricingInContext()
      ? (() => {
          const existingPricing = getExisitngProductPricing();
          return {
            id: existingPricing?.id,
            currency: existingPricing?.currency,
            cost: parseInt(existingPricing?.cost),
            bulk_discount: existingPricing?.bulk_discount,
            maximum_number_of_tickets:
              existingPricing?.maximum_number_of_tickets,
          };
        })()
      : {
          currency: currency,
          bulk_discount: 0,
        },
    mode: "onBlur",
  });

  const onSubmitPricing = (data: any) => {
    const productHasCurrentPricingInContext =
      checkIdProductHasCurrentPricingInContext();
    const existingPricing = getExisitngProductPricing();
    if (productHasCurrentPricingInContext) {
      updateProductPricing({
        id: existingPricing.id,
        product: newProduct?.id,
        currency: currency,
        cost: data.cost,
        maximum_number_of_tickets: data?.maximum_number_of_tickets,
      } as UpdateProductPricingPayload);
    } else {
      addProductPricing({
        product: newProduct?.id,
        currency: currency,
        cost: data.cost,
        type: pricingType.key,
        maximum_number_of_tickets: data?.maximum_number_of_tickets,
      } as ProductPricingPayload);
    }
  };

  useEffect(() => {
    setValue("currency", currency);
  }, [currency]);

  return (
    <div className="space-y-4 pb-6 col-span-1 grid md:grid-flow-col w-full gap-4">
      <div className="flex border-b border-primary pb-3 md:pb-12">
        <h3 className="flex items-center justify-center w-6 h-6 p-5 md:w-12 lg:w-12 xl:w-12 md:h-12 lg:h-12 xl:h-12 bg-black text-primary text-lg font-bold rounded-full shadow-lg me-4">
          A
        </h3>
        <div className="space-y-2 w-full">
          <form onSubmit={handleSubmit(onSubmitPricing)}>
            <p className="font-medium">{pricingType.title}</p>
            <label className="flex justify-between">
              <p className="font-light me-1">
                Please enter the price per person per {pricingType.label}
              </p>
              <div className="w-full">
                <Controller
                  name="cost"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      className="block w-full border p-1 mt-2"
                    />
                  )}
                />
                {errors.cost && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.cost.message}
                  </p>
                )}
              </div>
            </label>
            <label className="flex justify-between mt-2">
              <p className="font-light me-1">
                Bulk booking discounts (Optional)
              </p>
              <div className="w-full">
                <Controller
                  name="bulk_discount"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      className="block w-full border p-1 mt-2"
                    />
                  )}
                />
                {errors.bulk_discount && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.bulk_discount.message}
                  </p>
                )}
              </div>
            </label>

            <label className="flex justify-between mt-2">
              <p className="font-light me-1">
                Maximum number of tickets per session
              </p>
              <div className="w-full">
                <Controller
                  name="maximum_number_of_tickets"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      className="block w-full border p-1 mt-2"
                    />
                  )}
                />
                {errors.maximum_number_of_tickets && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.maximum_number_of_tickets.message}
                  </p>
                )}
              </div>
            </label>
            <div>
              {errors.currency && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.currency.message}
                </p>
              )}
            </div>
            <div className="flex justify-end">
              <Button
                margin="mt-6"
                bg="bg-primary"
                borderRadius="rounded"
                text="text-white"
                padding="py-1 px-3"
                type="submit"
                width="w-[50%]"
              >
                {isProcessingRequest ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <div className="border border-primary px-6 py-4 space-y-3">
        <h4 className="font-medium">
          TOTAL CHARGEABLE {`(PER ${pricingType.label.toUpperCase()})`}
        </h4>
        <ul className="space-y-1">
          <li className="flex justify-between">
            <p>Amount:</p>{" "}
            <span>
              {(watch("cost") && addCommaSeparators(watch("cost") as number)) ||
                0.0}
            </span>
          </li>
          <li className="flex justify-between">
            <p> Discount:</p>
            <span>
              {(watch("bulk_discount") &&
                addCommaSeparators(watch("bulk_discount") as number)) ||
                0.0}
            </span>
          </li>
          <li className="flex justify-between">
            <p>Service fee (5%):</p>
            <span>
              {Math.round(
                0.05 * ((watch("cost") ?? 0) - (watch("bulk_discount") ?? 0))
              )}
            </span>
          </li>
          <li className="font-bold text-green-600 flex justify-between">
            <p>Total:</p>{" "}
            <span>
              {Math.round(
                (watch("cost") ?? 0) -
                  (watch("bulk_discount") ?? 0) +
                  0.05 * ((watch("cost") ?? 0) - (watch("bulk_discount") ?? 0))
              )}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const isProcessingRequest =
    state.loading.effects.vendor.addProductPricing ||
    state.loading.effects.vendor.updateProductPricing;
  const { newProduct } = state.vendor;
  return {
    isProcessingRequest,
    newProduct,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getCurrencies: () => dispatch.settings.getCurrencies(),
  addProductPricing: (payload: ProductPricingPayload) =>
    dispatch.vendor.addProductPricing(payload),
  updateProductPricing: (payload: UpdateProductPricingPayload) =>
    dispatch.vendor.updateProductPricing(payload),
});

export default connect(mapStateToProps, mapDispatchToProps)(ActivityPricing);
