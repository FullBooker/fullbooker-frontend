"use client";

import React, { FC, useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  ChevronDown,
  CalendarDays,
  Trash,
  Plus,
} from "lucide-react";
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
import { DayOfWeek } from "@/domain/dto/output";
import { CircularProgress } from "@mui/material";
import LocationSearch from "./locationSearch";

type OtherProductsAvailabilityProps = {
  daysOfWeek: Array<DayOfWeek>;
  fetchingDaysOfTheWeek: boolean;
  getDaysOfWeek: () => void;
  newProduct: NewProductPayload;
  addProductAvailability: (payload: ProductAvailabilityPayload) => void;
};

const OtherProductsAvailability: FC<OtherProductsAvailabilityProps> = ({
  daysOfWeek,
  fetchingDaysOfTheWeek,
  getDaysOfWeek,
  newProduct,
  addProductAvailability,
}) => {
  const schema = yup.object().shape({
    durationHours: yup.string().required("Required"),
    durationMinutes: yup.string().required("Required"),
    open_days: yup
      .array()
      .of(
        yup.object().shape({
          id: yup.string().required(),
          day: yup.string(),
          selected: yup.boolean(),
          opening_at: yup.string().when("day", {
            is: (day: string | undefined) => !!day,
            then: (schema) => schema.required("Opening time is required"),
          }),
          closing_at: yup.string().when("day", {
            is: (day: string | undefined) => !!day,
            then: (schema) => schema.required("Closing time is required"),
          }),
        })
      )
      .min(1, "At least one open day must be selected"),
    closed_dates: yup.array().of(
      yup.object().shape({
        date: yup.string(),
      })
    ),
  });

  function convertMinutesToHoursAndMinutes(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return {
      hours: hours,
      minutes: remainingMinutes,
    };
  }

  const {
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      durationHours: newProduct?.availability?.duration
        ? convertMinutesToHoursAndMinutes(
            newProduct?.availability?.duration
          )?.hours?.toString()
        : "",
      durationMinutes: newProduct?.availability?.duration
        ? convertMinutesToHoursAndMinutes(
            newProduct?.availability?.duration
          )?.minutes?.toString()
        : "",
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
      duration:
        parseInt(data?.durationHours || "0") * 60 +
        parseInt(data?.durationMinutes || "0"),
      open_days: processOpenDay(
        data?.open_days?.filter((day: any) => day?.selected === true)
      ),
      closed_dates: data?.closed_dates,
    } as ProductAvailabilityPayload);
  };

  useEffect(() => {
    getDaysOfWeek();
  }, []);

  const [selectedLocation, setSelectedLocation] =
    useState<google.maps.places.PlaceResult | null>(null);

  const [dateInput, setDateInput] = useState("");

  const addClosedDate = () => {
    if (!dateInput) return;

    const currentDates = getValues("closed_dates") || [];
    const updatedDates = [...currentDates, { date: dateInput }];

    setValue("closed_dates", updatedDates);
    setDateInput("");
  };

  const removeClosedDate = (index: number) => {
    const currentDates = getValues("closed_dates") || [];
    const updatedDates = currentDates.filter((_, i) => i !== index);

    setValue("closed_dates", updatedDates);
  };
  
  return (
    <div className="px-0 md:px-5">
      <p className="font-base mt-4 ml-5 text-center mb-3">
        Where and when does this activity happen?
      </p>
      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-flow-col md:grid-cols-2 gap-4">
          <LocationSearch setSelectedLocation={setSelectedLocation} />

          <div className="border rounded-sm border-primary p-4 col-span-2 text-center">
            <h3 className="text-md font-light">How long is this activity?</h3>
            <div className="flex justify-center gap-4 mt-2 text-center">
              <div className="">
                <p className="font-light">Hours</p>
                <Controller
                  name="durationHours"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <select {...field} className="border">
                      <option></option>
                      {Array.from({ length: 24 }, (_, h) => h)
                        .filter((h) => h !== 0)
                        .map((h) => (
                          <option key={h} value={h.toString()}>{`${h} Hour${
                            h !== 1 ? "s" : ""
                          }`}</option>
                        ))}
                    </select>
                  )}
                />
                {errors.durationHours && (
                  <p className="text-red-500 text-sm">
                    {errors.durationHours.message}
                  </p>
                )}
              </div>
              <div className="">
                <p className="font-light">Minutes</p>
                <Controller
                  name="durationMinutes"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <select {...field} className="border">
                      <option></option>
                      {[15, 30, 45].map((m) => (
                        <option key={m} value={m.toString()}>{`${m} Minute${
                          m !== 1 ? "s" : ""
                        }`}</option>
                      ))}
                    </select>
                  )}
                />
                {errors.durationMinutes && (
                  <p className="text-red-500 text-sm">
                    {errors.durationMinutes.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="border rounded-sm border-primary p-4 col-span-2 text-center">
            <h3 className="text-md font-light">
              Select the days of the week that you are open
            </h3>
            {fetchingDaysOfTheWeek ? (
              <div className="flex justify-center items-center mt-4 mb-4">
                <CircularProgress size={18} color="inherit" className="me-2" />
                <span>Fetching categories..</span>
              </div>
            ) : (
              <div className="gap-2 mt-4 w-full">
                <div className="flex justify-between">
                  <div></div>
                  <div className="flex justify-between items-center gap-2 w-[50%]">
                    <p className="text-md font-light">Opening at</p>
                    <p className="text-md font-light">Closing at</p>
                  </div>
                </div>
                {daysOfWeek.map((day: DayOfWeek, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center gap-2 w-full m-2"
                  >
                    <div className="flex items-center gap-2">
                      <Controller
                        name={`open_days.${index}.id` as const}
                        control={control}
                        defaultValue={day.id}
                        render={({ field }) => (
                          <input type="hidden" {...field} />
                        )}
                      />

                      {/* Checkbox to track selection */}
                      <Controller
                        name={`open_days.${index}.selected` as const}
                        control={control}
                        render={({ field }) => (
                          <input
                            type="checkbox"
                            ref={field.ref}
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        )}
                      />
                      <span className="text-sm font-light">{day.name}</span>
                    </div>
                    <div className="flex items-center gap-2 w-[50%]">
                      <div className="w-full">
                        <Controller
                          name={`open_days.${index}.opening_at`}
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="time"
                              className="border p-1 text-sm w-full"
                              placeholder="Opening at"
                            />
                          )}
                        />
                        {errors.open_days?.[index] && (
                          <p className="text-red-500 text-sm text-sm">
                            {errors?.open_days?.[index]?.opening_at?.message}
                          </p>
                        )}
                      </div>
                      <div className="w-full">
                        <Controller
                          name={`open_days.${index}.closing_at`}
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="time"
                              className="border p-1 text-sm w-full"
                            />
                          )}
                        />
                        {errors.open_days?.[index] && (
                          <p className="text-red-500 text-sm text-sm">
                            {errors?.open_days?.[index]?.closing_at?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {errors.open_days && (
                  <p className="text-red-500 text-sm text-sm">
                    {errors.open_days.message}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="border rounded-sm border-primary p-4 col-span-2  text-center">
            <h3 className="font-light mb-3">
              Choose the specific days of the year when your activity will
              remain closed (Optional)
            </h3>
            <div className="flex justify-between mb-3 gap-4">
              <div className="w-full">
                <div className="flex justify-between items-center mt-2">
                  {/* <CalendarDays className="text-primary w-10 h-10 me-1" /> */}
                  <Controller
                    name="closed_dates"
                    control={control}
                    render={({ field }) => (
                      <input
                        value={dateInput}
                        onChange={(e) => setDateInput(e.target.value)}
                        className="border p-1 rounded-sm me-2 text-sm w-[60%]"
                        type="date"
                      />
                    )}
                  />
                  <button
                    className="bg-primary rounded flex justify-center py-1 items-center w-[40%]"
                    onClick={addClosedDate}
                    type="button"
                  >
                    <Plus className="w-5 h-5 text-black" />{" "}
                    <span className="text-black">Add</span>
                  </button>
                </div>
              </div>

              <div className="mt-2  py-3 border border-grey w-full text-center rounded-sm">
                <h4 className="font-semibold text-sm text-center border-b border-primary">
                  Activity Not Open on
                </h4>
                <div className="px-4 py-4 space-y-2">
                  {watch("closed_dates") &&
                    (watch("closed_dates") as Array<any>)?.map(
                      (date: any, index: number) => (
                        <div
                          key={index}
                          className="flex justify-center items-center"
                        >
                          <p
                            key={index}
                            className="flex justify-center text-sm me-2"
                          >
                            {date?.date}
                          </p>
                          <span
                            className="cursor-pointer flex justify-center"
                            onClick={() => removeClosedDate(index)}
                          >
                            <Trash className="w-5 h-5 text-red-500" />
                          </span>
                        </div>
                      )
                    )}
                </div>
              </div>
              {errors.closed_dates && (
                <p className="text-red-500 text-sm">
                  {errors.closed_dates.message}
                </p>
              )}
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
  getDaysOfWeek: () => dispatch.settings.getDaysOfWeek(),
  addProductAvailability: (payload: ProductAvailabilityPayload) =>
    dispatch.vendor.addProductAvailability(payload),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OtherProductsAvailability);
