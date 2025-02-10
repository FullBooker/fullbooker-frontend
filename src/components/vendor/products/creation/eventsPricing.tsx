"use client";

import React, { FC, useEffect, useState } from "react";
import { RootState } from "@/store";
import { connect } from "react-redux";
import NavigationButtons from "./navigationButtons";
import { ProductType } from "@/domain/constants";
import { Currency } from "@/domain/dto/output";
import { CircularProgress, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { ChevronDown } from "lucide-react";
import EarlyBirdTicketPricing from "./pricing/events/earlyBird";
import StandardTicketPricing from "./pricing/events/standard";
import VIPTicketPricing from "./pricing/events/vip";
import VVIPTicketPricing from "./pricing/events/vvip";
import StandardAtTheGateTicketPricing from "./pricing/events/standardAtTheGate";
import LastMinuteTicketPricing from "./pricing/events/lastMinute";

type EventsPricingProps = {
  getCurrencies: () => void;
  currencies: Array<Currency>;
  fetchingCurrencies: boolean;
};

const EventsPricing: FC<EventsPricingProps> = ({
  getCurrencies,
  currencies,
  fetchingCurrencies,
}) => {
  useEffect(() => {
    getCurrencies();
  }, []);

  const [currency, setSelectedCurrency] = useState<string>("");

  return (
    <div>
      <p className="font-base mt-4 mb-3 mr-1 md:mr-6 text-right">
        Cost per ticket category
      </p>
      <div className="gap-4">
        <div className="px-1 md:px-6 bg-white space-y-6">
          <div className="flex items-center pb-4 px-0 py-2">
            <p className="text-lg font-semibold me-3">
              Select a currency for this event
            </p>
            {fetchingCurrencies ? (
              <div className="flex justify-center items-center mt-4 mb-4">
                <CircularProgress size={18} color="inherit" className="me-2" />
                <span>Fetching currencies...</span>
              </div>
            ) : (
              <select
                className="border p-1"
                onChange={(e) => setSelectedCurrency(e.target.value)}
              >
                <option value="">Select currency</option>
                {currencies.map((currency) => (
                  <option key={currency.id} value={currency.id}>
                    {currency.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <Accordion>
            <AccordionSummary
              expandIcon={<ChevronDown className="w-10 h-10" />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography component="span">Early Bird</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <EarlyBirdTicketPricing currency={currency}/>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ChevronDown className="w-10 h-10" />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography component="span">Standard</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <StandardTicketPricing currency={currency}/>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ChevronDown className="w-10 h-10" />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography component="span">Standard at the Gate</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <StandardAtTheGateTicketPricing currency={currency}/>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ChevronDown className="w-10 h-10" />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography component="span">Last Minute</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <LastMinuteTicketPricing currency={currency}/>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ChevronDown className="w-10 h-10" />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography component="span">VIP</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <VIPTicketPricing currency={currency}/>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ChevronDown className="w-10 h-10" />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography component="span">VVIP</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <VVIPTicketPricing currency={currency}/>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
      <div className="px-2 md:px-10 mt-4 md:mt-10">
        <NavigationButtons />
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const fetchingCurrencies = state.loading.models.settings;
  const { currencies } = state.settings;
  return {
    currencies,
    fetchingCurrencies,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  getCurrencies: () => dispatch.settings.getCurrencies(),
});

export default connect(mapStateToProps, mapDispatchToProps)(EventsPricing);
