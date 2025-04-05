import {
  Availability,
  CartItem,
  CartSummary,
  DateSlot,
} from "@/domain/product";
import { RootState } from "@/store";
import React, { FC, useEffect, useState } from "react";
import { connect } from "react-redux";
import moment from "moment";

type DateSlotSelectorProps = {
  cartSummary: CartSummary;
  setProductDetailsToCart: (payload: CartSummary) => void;
  availability: Availability;
};

const DateSlotSelector: FC<DateSlotSelectorProps> = ({
  cartSummary,
  setProductDetailsToCart,
  availability,
}) => {
  const [slots, setSlots] = useState<Array<DateSlot>>([]);
  const generateDateSlots = (): Array<DateSlot> => {
    const slots: Array<DateSlot> = [];
    const isEvent = !!availability.start_time && !!availability.end_time;
    const isActivity =
      availability?.open_days?.length > 0 &&
      availability?.duration &&
      availability?.duration > 0;

    const startDate = new Date(availability?.start as string);
    const endDate = new Date(availability?.end as string);

    if (isEvent) {
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return [];
      for (
        let d = new Date(startDate.getTime());
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        const formattedDate = moment(d).format("YYYY-MM-DD");
        if (availability.closed_dates.includes(formattedDate)) continue;

        slots.push({
          day: d.toLocaleDateString("en-US", { weekday: "long" }),
          month: d.toLocaleDateString("en-US", { month: "short" }),
          date: d.getDate(),
          time: `${formatTime(availability.start_time)} ${formatTime(
            availability.end_time
          )}`,
          fullDate: formattedDate,
          isActive: cartSummary?.selected_date === formattedDate,
        });
      }
    } else if (isActivity) {
      const today = new Date();
      const nextYear = new Date();
      nextYear.setFullYear(today.getFullYear() + 1);

      const openingDaysMap = new Map(
        availability.open_days.map((openDay) => [
          openDay.day_name.toLowerCase(),
          openDay,
        ])
      );

      let openDate = new Date(today);
      while (openDate <= nextYear) {
        const dayName = openDate
          .toLocaleDateString("en-US", { weekday: "long" })
          .toLowerCase();

        if (openingDaysMap.has(dayName)) {
          const openDay = openingDaysMap.get(dayName);
          const formattedDate = moment(openDate).format("YYYY-MM-DD");

          const openingTime = openDay?.opening_at?.slice(0, 5);
          const closingTime = openDay?.closing_at?.slice(0, 5);

          slots.push({
            day: dayName.charAt(0).toUpperCase() + dayName.slice(1),
            month: openDate.toLocaleDateString("en-US", { month: "short" }),
            date: openDate.getDate(),
            time: `${formatTime(openingTime as string)} - ${formatTime(
              closingTime as string
            )}`,
            fullDate: formattedDate,
            isActive: cartSummary?.selected_date === formattedDate,
          });
        }

        openDate.setDate(openDate.getDate() + 1);
      }
    } else {
      return [];
    }

    return slots;
  };

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return "N/A";
    const [hour, minute] = timeStr.split(":");
    return `${parseInt(hour) % 12 || 12}:${minute} ${
      parseInt(hour) >= 12 ? "PM" : "AM"
    }`;
  };

  const handleDateSelection = (selectedDate: Date | string, time?: string) => {
    setProductDetailsToCart({
      ...cartSummary,
      selected_date: selectedDate,
      ...(time && {
        selected_open_day: time,
      }),
    });
  };

  useEffect(() => {
    setSlots(generateDateSlots());
  }, [availability]);

  return (
    <div>
      {slots?.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto w-full cursor-pointer overflow-hidden">
          {slots?.map((slot, index) => {
            const isActive = slot?.fullDate === cartSummary?.selected_date;
            return (
              <div
                key={index}
                onClick={() => handleDateSelection(slot.fullDate, slot.time)}
                className={`flex flex-col items-center justify-center min-w-[130px] md:w-[130px] h-[130px] md:h-36 p-2 rounded-lg border space-y-1 md:space-y-2 ${
                  isActive
                    ? "border-primary text-primary "
                    : "border-gray-500 text-gray-500"
                }`}
              >
                <span className="text-sm">{slot.day}</span>
                <span className="text-xs">{slot.month}</span>
                <div
                  className={`w-6 h-6 rounded-full text-center ${
                    isActive
                      ? "bg-primary text-white"
                      : "bg-gray-500 text-white"
                  }`}
                >
                  <span className="text-xs">{slot.date}</span>
                </div>
                {slot.time && <span className="text-xs">{slot.time}</span>}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex justify-center mb-4">
          <p className="text-red-500 text-center">No available dates</p>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const { cartSummary } = state.products;
  return { cartSummary };
};

const mapDispatchToProps = (dispatch: any) => ({
  setProductDetailsToCart: (payload: CartSummary) =>
    dispatch.products.setProductDetailsToCart(payload),
});

export default connect(mapStateToProps, mapDispatchToProps)(DateSlotSelector);
