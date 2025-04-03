import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from "dayjs";

type CustomTimePickerProps = {
  onChange: (payload: any) => void;
  minTime: string;
  maxTime: string;
  label: string;
};

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  onChange,
  label,
  minTime,
  maxTime,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["TimePicker"]}>
        <TimePicker
          label={label}
          onChange={onChange}
          views={["hours", "minutes"]}
          minTime={dayjs(minTime, "hh:mm A")}
          maxTime={dayjs(maxTime, "hh:mm A")}
          className="w-full"
        />
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default CustomTimePicker;
