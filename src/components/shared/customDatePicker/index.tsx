import React, { useState } from "react";
import DatePicker from "react-datepicker";

type CustomDatePickerProps = {
  onChange: (payload: any) => void;
  customInput?: any;
  availableDates?: any;
  placement: any;
  minDate?: Date;
};

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  onChange,
  availableDates,
  customInput,
  placement,
  minDate = new Date(),
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  return (
    <DatePicker
      selected={selectedDate}
      onChange={(date: Date | null) => {
        onChange(date);
        setSelectedDate(date);
      }}
      popperPlacement={placement}
      minDate={minDate}
      includeDates={availableDates}
      customInput={customInput ? customInput : undefined}
    />
  );
};

export default CustomDatePicker;
