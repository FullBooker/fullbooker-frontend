"use client";

import React, { FC, useState } from "react";
import { CalendarDays } from "lucide-react";
import NavigationButtons from "./navigationButtons";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { ProductType } from "@/domain/constants";
import { RootState } from "@/store";
import { connect } from "react-redux";
import {
  NewProductPayload,
  OpenDay,
  ProductAvailabilityPayload,
} from "@/domain/dto/input";
import LocationSearch from "./locationSearch";
import ReverseGeocoding from "./locationPointer";

type EventAvailabilityProps = {
  getDaysOfWeek: () => void;
  newProduct: NewProductPayload;
  addProductAvailability: (payload: ProductAvailabilityPayload) => void;
  productType: ProductType;
};

const EventAvailability: FC<EventAvailabilityProps> = ({
  getDaysOfWeek,
  newProduct,
  addProductAvailability,
  productType,
}) => {
  const schema = yup.object().shape({
    start: yup.string().required("Start date is required"),
    end: yup.string().required("End date is required"),
    start_time: yup.string().required("Start time is required"),
    end_time: yup.string().required("End time is required"),
  });

  const {
    control,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      start: newProduct?.availability?.start || "",
      end: newProduct.availability?.end || "",
      start_time: newProduct.availability?.start_time || "",
      end_time: newProduct.availability?.end_time || "",
    },
    mode: "onBlur",
  });

  const processOpenDay = (openDays: any) => {
    let selectedDays: Array<OpenDay> = [];
    openDays?.map((day: any) => {
      selectedDays.push({
        day: day?.id,
        opening_at: day?.opening_at,
        closing_at: day?.closing_at,
      } as OpenDay);
    });
    return selectedDays;
  };

  const onSubmit = (data: any) => {
    addProductAvailability({
      product: newProduct?.id,
      start: data?.start,
      end: data?.end,
      start_time: data?.start_time,
      end_time: data?.end_time,
    } as ProductAvailabilityPayload);
  };

  const [selectedLocation, setSelectedLocation] =
    useState<google.maps.places.PlaceResult | null>(null);

  function extractCoordinates(coordinateString: string) {
    const parts = coordinateString?.split("POINT (");
    if (parts.length < 2) return null;
    const coordinates = parts[1].replace(")", "").trim().split(" ");
    return {
      latitude: parseFloat(coordinates[1]),
      longitude: parseFloat(coordinates[0]),
    };
  }

  return (
    <div className="px-0 md:px-5">
      <p className="font-base mt-4 ml-5 text-center mb-3">
        Where and when does this activity happen?
      </p>
      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-flow-col md:grid-cols-2 gap-4">
          <LocationSearch setSelectedLocation={setSelectedLocation} />

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
                  {(selectedLocation &&
                    selectedLocation?.formatted_address) || (
                    <ReverseGeocoding
                      lat={
                        extractCoordinates(
                          newProduct?.locations[
                            newProduct?.locations?.length - 1
                          ]?.coordinates
                        )?.latitude as number
                      }
                      lng={
                        extractCoordinates(
                          newProduct?.locations[
                            newProduct?.locations?.length - 1
                          ]?.coordinates
                        )?.longitude as number
                      }
                    />
                  )}
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
        <NavigationButtons disableNext={true} />
      </form>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const fetchingDaysOfTheWeek = state.loading.models.settings;
  const { daysOfWeek } = state.settings;
  const { newProduct, productType } = state.vendor;
  return {
    daysOfWeek,
    fetchingDaysOfTheWeek,
    newProduct,
    productType,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  addProductAvailability: (payload: ProductAvailabilityPayload) =>
    dispatch.vendor.addProductAvailability(payload),
});

export default connect(mapStateToProps, mapDispatchToProps)(EventAvailability);
