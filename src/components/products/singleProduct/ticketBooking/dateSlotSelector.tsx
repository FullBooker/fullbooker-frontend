import {
  Availability,
  CartItem,
  CartSummary,
  DateSlot,
} from "@/domain/product";
import { RootState } from "@/store";
import React, { FC } from "react";
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
  const generateDateSlots = (): Array<DateSlot> => {
    if (!availability?.start || !availability?.end) return [];

    const startDate = new Date(availability.start);
    const endDate = new Date(availability.end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return [];

    const slots: Array<DateSlot> = [];
    const isEvent = !!availability.start_time && !!availability.end_time;
    const isActivity =
      availability.open_days.length > 0 && availability.duration;

    if (isEvent) {
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
          time: formatTime(availability.start_time),
          fullDate: formattedDate,
          isActive: cartSummary?.selected_date === formattedDate,
        });
      }
    } else if (isActivity) {
      availability.open_days.forEach((openDay) => {
        const openDate = new Date(startDate);
        while (openDate <= endDate) {
          if (
            openDay.day_name.toLowerCase() ===
            openDate
              .toLocaleDateString("en-US", { weekday: "long" })
              .toLowerCase()
          ) {
            const formattedDate = moment(openDate).format("YYYY-MM-DD");
            slots.push({
              day: openDate.toLocaleDateString("en-US", { weekday: "long" }),
              month: openDate.toLocaleDateString("en-US", { month: "short" }),
              date: openDate.getDate(),
              time: "",
              fullDate: formattedDate,
              isActive: cartSummary?.selected_date === formattedDate,
            });
          }
          openDate.setDate(openDate.getDate() + 1);
        }
      });
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

  const handleDateSelection = (selectedDate: Date | string) => {
    setProductDetailsToCart({
      ...cartSummary,
      selected_date: selectedDate,
    });
  };

  const slots = generateDateSlots();

  return (
    <div>
      {slots.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto w-full cursor-pointer">
          {slots.map((slot, index) => {
            return (
              <div
                key={index}
                onClick={() => handleDateSelection(slot.fullDate)}
                className={`flex flex-col items-center justify-center min-w-[100px] md:w-[100px] h-28 md:h-36 p-2 rounded-lg border space-y-1 md:space-y-2 ${
                  slot.isActive
                    ? "border-primary text-primary "
                    : "border-gray-500 text-gray-500"
                }`}
              >
                <span className="text-sm">{slot.day}</span>
                <span className="text-xs">{slot.month}</span>
                <div
                  className={`w-6 h-6 rounded-full text-center ${
                    slot.isActive
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
