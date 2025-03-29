"use client";

import React, { FC, useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import NavigationButtons from "../navigationButtons";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { Dispatch, RootState } from "@/store";
import { connect } from "react-redux";
import {
  NewProductPayload,
  ProductAvailabilityPayload,
  UpdateProductAvailabilityPayload,
} from "@/domain/dto/input";
import LocationSearch from "../locationSearch";
import { extractCoordinates } from "@/utilities";
import StepHeader from "../stepHeader";

type EventAvailabilityProps = {
  newProduct: NewProductPayload;
  addProductAvailability: (payload: ProductAvailabilityPayload) => void;
  updateProductAvailability: (
    payload: UpdateProductAvailabilityPayload
  ) => void;
  isProcessingRequest: boolean;
};

const EventAvailability: FC<EventAvailabilityProps> = ({
  newProduct,
  addProductAvailability,
  updateProductAvailability,
  isProcessingRequest,
}) => {
  const schema = yup.object().shape({
    start: yup.string().required("Start date is required"),
    end: yup.string().required("End date is required"),
    start_time: yup.string().required("Start time is required"),
    end_time: yup
      .string()
      .required("End time is required")
      .test(
        "is-greater",
        "End time must be later than start time",
        function (value) {
          const { start_time } = this.parent;
          if (!start_time || !value) return true;
          return value > start_time;
        }
      ),
    location: yup
      .object()
      .shape({
        lat: yup
          .number()
          .required("Latitude is required")
          .typeError("Latitude must be a number"),
        lng: yup
          .number()
          .required("Longitude is required")
          .typeError("Longitude must be a number"),
      })
      .required("Location is required"),
  });

  const {
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      start: newProduct?.availability?.start || "",
      end: newProduct.availability?.end || "",
      start_time: newProduct.availability?.start_time || "",
      end_time: newProduct.availability?.end_time || "",
      location:
        newProduct?.locations && newProduct?.locations?.length > 0
          ? {
              lat: extractCoordinates(newProduct?.locations[0]?.coordinates)
                ?.latitude as number,
              lng: extractCoordinates(newProduct?.locations[0]?.coordinates)
                ?.longitude as number,
            }
          : undefined,
    },
    mode: "onBlur",
  });

  const onSubmit = (data: any) => {
    if (newProduct?.availability) {
      updateProductAvailability({
        id: newProduct?.availability?.id,
        product: newProduct?.id,
        start: data?.start,
        end: data?.end,
        start_time: data?.start_time,
        end_time: data?.end_time,
      } as UpdateProductAvailabilityPayload);
    } else {
      addProductAvailability({
        product: newProduct?.id,
        start: data?.start,
        end: data?.end,
        start_time: data?.start_time,
        end_time: data?.end_time,
      } as ProductAvailabilityPayload);
    }
  };

  useEffect(() => {
    if (newProduct?.locations && newProduct?.locations?.length > 0) {
      setValue("location", {
        lat: extractCoordinates(newProduct?.locations[0]?.coordinates)
          ?.latitude as number,
        lng: extractCoordinates(newProduct?.locations[0]?.coordinates)
          ?.longitude as number,
      });
    }
  }, [newProduct?.locations]);

  return (
    <div className="px-0 md:px-5">
      <StepHeader title="Where and when does this activity happen?" />
      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-flow-col md:grid-cols-2 gap-4">
          <LocationSearch
            validationErrors={errors}
          />
          <div className="border rounded-sm border-primary px-3 md:px-4 py-4 col-span-2">
            <h3 className="font-base mb-3">When will this event happen?</h3>
            <div className="flex justify-between items-center gap-1 md:gap-4">
              <div className="flex flex-col w-full">
                <label className="text-sm font-light mb-1">
                  Event Starts on
                </label>
                <div className="flex items-center py-2 w-full">
                  <CalendarDays className="text-primary w-6 h-6 me-1" />
                  <Controller
                    name="start"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <input
                        {...field}
                        className="focus:outline-none border rounded p-1 text-sm font-light w-full"
                        type="date"
                      />
                    )}
                  />
                </div>
                {errors.start && (
                  <p className="text-red-500 text-sm">{errors.start.message}</p>
                )}
              </div>
              <div className="flex flex-col w-full">
                <label className="text-sm font-light mb-1">Event ends on</label>
                <div className="flex items-center py-2 w-full">
                  <CalendarDays className="text-primary w-6 h-6 me-1" />
                  <Controller
                    name="end"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <input
                        {...field}
                        className="focus:outline-none border rounded p-1 text-sm font-light w-full"
                        type="date"
                      />
                    )}
                  />
                </div>
                {errors.end && (
                  <p className="text-red-500 text-sm">{errors.end.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="border rounded-sm border-primary p-4 col-span-2">
            <div className="mb-3">
              <h3 className="font-base mb-3">
                What time will this event start?
              </h3>
              <div className="flex items-center space-x-2">
                <Controller
                  name="start_time"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="border rounded px-3 py-1 focus:outline-none text-sm font-light w-full"
                      type="time"
                    />
                  )}
                />
              </div>
              {errors.start_time && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.start_time.message}
                </p>
              )}
            </div>

            <div className="">
              <h3 className="font-base mb-3">What time will this event end?</h3>
              <div className="flex items-center space-x-2">
                <Controller
                  name="end_time"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="border rounded px-3 py-1 focus:outline-none text-sm font-light w-full"
                      type="time"
                    />
                  )}
                />
              </div>
              {errors.end_time && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.end_time.message}
                </p>
              )}
            </div>
          </div>

          <div className="border rounded-sm border-primary p-4 col-span-2  text-center">
            <h3 className="font-base text-center">Summary</h3>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between">
                <span className="font-base">Location:</span>
                <span className="font-light">
                  {
                    <>
                      {newProduct?.locations?.length > 0
                        ? newProduct?.locations[0]?.address
                        : "N/A"}
                    </>
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-base">Event will happen on:</span>
                <span className="font-light text-sm">
                  {watch("start") as string}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-base">Event starts at:</span>
                <span className="font-light text-sm">
                  {" "}
                  {watch("start_time") as string}{" "}
                  {`${watch("start") && watch("start_time") ? ", " : ""} `}{" "}
                  {watch("start") as string}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-base">Event ends at:</span>
                <span className="font-light text-sm">
                  {watch("end_time") as string}{" "}
                  {`${watch("end") && watch("end_time") ? ", " : ""} `}{" "}
                  {watch("end") as string}
                </span>
              </div>
            </div>
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
    state.loading.effects.vendor.addProductAvailability ||
    state.loading.effects.vendor.updateProductAvailability;
  const { daysOfWeek } = state.settings;
  const { newProduct, productType } = state.vendor;
  return {
    daysOfWeek,
    isProcessingRequest,
    newProduct,
    productType,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addProductAvailability: (payload: ProductAvailabilityPayload) =>
    dispatch.vendor.addProductAvailability(payload),
  updateProductAvailability: (payload: UpdateProductAvailabilityPayload) =>
    dispatch.vendor.updateProductAvailability(payload),
});

export default connect(mapStateToProps, mapDispatchToProps)(EventAvailability);
