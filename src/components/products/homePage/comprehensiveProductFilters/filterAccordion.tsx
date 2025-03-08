import React, { FC } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { ChevronDown } from "lucide-react";
import useDeviceType from "@/lib/hooks/useDeviceType";
import { DeviceType } from "@/domain/constants";

type FilterAccordionProps = {
  title: string;
  children: React.ReactNode;
};

const FilterAccordion: FC<FilterAccordionProps> = ({ title, children }) => {
  const deviceType = useDeviceType();

  return (
    <Accordion
      sx={{
        paddingTop: "15px",
        paddingBottom: "15px",
        width: "100% !important",
        maxWidth: "none !important",
        minHeight:
          deviceType === DeviceType.mobile
            ? "5vh !important"
            : deviceType === DeviceType.tablet
            ? "5vh"
            : "10vh !important",
        "& .MuiPaper-root": {
          "@media (max-width: 600px)": {
            minHeight:
              deviceType === DeviceType.mobile
                ? "5vh !important"
                : deviceType === DeviceType.tablet
                ? "5vh"
                : "10vh !important",
          },
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ChevronDown className="w-8 h-8" />}
        aria-controls={title}
        id={title}
      >
        <p className="text-black font-semibold">{title}</p>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          borderTop: "1px solid #E3E3E3",
        }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
};

export default FilterAccordion;
