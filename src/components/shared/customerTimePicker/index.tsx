import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

type CustomTimePickerProps = {
  onChange: (payload: any) => void;
};

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({ onChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["TimePicker"]}>
        <TimePicker label="Select Time" onChange={onChange} views={["hours", "minutes"]} />
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default CustomTimePicker;
