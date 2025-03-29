import React, { useState } from "react";
import DatePicker from "react-datepicker";

type CustomDatePickerProps = {
  onChange: (payload: any) => void;
  customInput?: any;
  availableDates?: any;
  placement: any;
  minDate?: Date;
  defaultDate: Date | null;
};

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  onChange,
  availableDates,
  customInput,
  placement,
  minDate = new Date(),
  defaultDate,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(defaultDate);
  return (
    <DatePicker
      selected={selectedDate}
      onChange={(date: Date | null) => {
        onChange(date);
        setSelectedDate(date);
      }}
      popperPlacement={placement}
      minDate={minDate}
      customInput={
        customInput ? (
          customInput
        ) : (
          <input className="shadow-md px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        )
      }
      className={`${
        !customInput
          ? "shadow px-4 py-3 border rounded-md focus:outline-none"
          : ""
      }  `}
      {...(availableDates && availableDates?.length > 0 ? { includeDates: availableDates } : {})}
    />
  );
};

export default CustomDatePicker;
