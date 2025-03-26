"use client";

import React, { FC, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Dispatch, RootState } from "@/store";
import "react-loading-skeleton/dist/skeleton.css";
import DashBoardLayout from "../../../../layout";
import Button from "@/components/shared/button";
import useIsMobile from "@/lib/hooks/useIsMobile";
import { hideMiddleCharacters } from "@/utilities";
import QRCode from "react-qr-code";
import { Ticket } from "@/domain/ticket";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Link from "next/link";
import { withAuth } from "@/components/views/dash/authGuard";

type CheckoutPageProps = {
  ticket: Ticket;
  getTicketById: (ticketId: string) => void;
  params: {
    ticketId: string;
  };
  fetchingTicketRequestProcessing: boolean;
};

const CheckoutPage: FC<CheckoutPageProps> & { layout: any } = ({
  ticket,
  getTicketById,
  params,
  fetchingTicketRequestProcessing,
}) => {
  const isMobile = useIsMobile();
  const ticketRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (params?.ticketId) {
      getTicketById(params?.ticketId);
    }
  }, [params?.ticketId]);

  const formatEventDate = (
    start: string,
    end: string
  ): {
    date: string;
    time: string;
  } => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const day = startDate.getDate();
    const month = startDate.toLocaleString("en-US", { month: "long" });
    const suffix = getDaySuffix(day);

    const startTime = formatTime(startDate);
    const endTime = formatTime(endDate);

    return {
      date: `${day}${suffix} ${month}`,
      time: `${startTime} - ${endTime}`,
    };
  };

  const getDaySuffix = (day: number): string => {
    if (day >= 11 && day <= 13) return "TH";
    switch (day % 10) {
      case 1:
        return "ST";
      case 2:
        return "ND";
      case 3:
        return "RD";
      default:
        return "TH";
    }
  };

  const formatTime = (date: Date): string => {
    return date
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toUpperCase()
      .replace(" ", "");
  };

  const downloadTicketAsPDF = async () => {
    if (!ticketRef.current) return;
    const canvas = await html2canvas(ticketRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
    pdf.save(`ticket_${ticket?.name || "event"}.pdf`);
  };

  return (
    <div>
      {fetchingTicketRequestProcessing ? (
        <div className="gap-6 max-w-5xl mx-auto py-6 md:py-10 px-4 md:px-7 animate-pulse">
          {/* Header */}
          <div className="mb-4">
            <div className="h-6 w-3/4 mx-auto bg-gray-300 rounded"></div>
          </div>

          {/* Ticket Container */}
          <div className="overflow-x-auto whitespace-nowrap">
            <div className="flex items-center justify-center bg-gray-100 min-w-[800px] md:min-w-[600px] p-6 rounded-md shadow-lg">
              <div className="flex w-[900px] h-[250px] md:h-[280px] bg-white border rounded-md shadow-lg">
                <div className="h-full w-10 bg-gray-400"></div>

                {/* Left Section */}
                <div className="w-full md:w-1/3 bg-white border-r-8 border-dashed p-4 flex flex-col justify-between">
                  <div className="h-4 w-1/2 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 w-3/4 bg-gray-300 rounded mb-1"></div>
                  <div className="h-3 w-1/2 bg-gray-300 rounded mb-4"></div>
                  <div className="flex w-full justify-center">
                    <div className="h-16 w-16 md:h-20 md:w-20 bg-gray-300 rounded"></div>
                  </div>
                </div>

                {/* Right Section */}
                <div className="w-full md:w-2/3 p-4 bg-white relative">
                  <div className="h-5 w-3/4 bg-gray-300 mx-auto rounded mb-4"></div>

                  <div className="space-y-2 mt-3 w-full">
                    <div className="h-3 w-3/4 bg-gray-300 rounded"></div>
                    <div className="h-3 w-1/2 bg-gray-300 rounded"></div>
                    <div className="h-3 w-1/4 bg-gray-300 rounded"></div>
                  </div>

                  <div className="h-3 w-2/3 bg-gray-300 rounded mt-6"></div>

                  {/* Right Floating Section */}
                  <div className="absolute top-4 right-4 text-right">
                    <div className="h-3 w-16 bg-gray-300 rounded mb-1"></div>
                    <div className="h-3 w-12 bg-gray-300 rounded"></div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="absolute bottom-4 right-4 text-right">
                    <div className="h-3 w-24 bg-gray-300 rounded mb-1"></div>
                    <div className="h-3 w-16 bg-gray-300 rounded"></div>
                    <div className="h-3 w-20 bg-gray-300 rounded"></div>
                  </div>
                </div>

                <div className="h-full w-10 bg-gray-400"></div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <div className="h-10 w-40 bg-gray-300 rounded"></div>
          </div>
        </div>
      ) : (
        <div className="gap-6 max-w-7xl mx-auto py-6 md:py-10 px-4 md:px-7 ">
          <div className="mb-4">
            <p className="text-center text-lg font-semibold">
              Hello {ticket?.name}, Download your ticket below or check your
              email at {hideMiddleCharacters(ticket?.email) || ""}
            </p>
          </div>
          <div className="overflow-x-auto whitespace-nowrap">
            <div
              ref={ticketRef}
              className="flex items-center justify-center min-w-[800px] md:min-w-[600px]"
            >
              <div className="flex w-[900px] h-[250px] md:h-[280px] borderrounded-md shadow-lg">
                <p className="[writing-mode:sideways-lr] text-center text-white bg-primary py-4">
                  FULLBOOKER
                </p>

                <div className="w-[full] md:w-1/3 bg-white border-r-8 border-dashed border-gray-700 p-4 flex flex-col justify-between px-4">
                  <div className="w-full">
                    <h2 className="text-sm font-bold">Rock Concert</h2>
                    <p className="text-xs mt-2">
                      <span className="font-semibold">Name:</span>{" "}
                      {ticket?.name}
                    </p>
                    <p className="text-xs">
                      <span className="font-semibold">ID:</span>{" "}
                      {ticket?.id_number}
                    </p>
                  </div>
                  <div className="flex w-full">
                    <QRCode
                      size={isMobile ? 100 : 160}
                      value={
                        ticket?.qr_code ? ticket?.qr_code : params?.ticketId
                      }
                    />
                  </div>
                </div>

                <div
                  className="w-full md:w-2/3 p-4 bg-white relative text-white"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://dev-fullbooker-static.s3.eu-central-1.amazonaws.com/images/default_ticket_background.png")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <h2 className="text-2xl font-bold">Rock Concert</h2>

                  <div className="mt-3 text-sm w-full md:mt-6">
                    <p>
                      <span className="font-semibold">
                        Confirmation Number:
                      </span>{" "}
                      FGEDE46374H2
                    </p>
                    <p>
                      <span className="font-semibold">Name:</span>{" "}
                      {ticket?.name}
                    </p>
                    <p>
                      <span className="font-semibold">ID:</span>{" "}
                      {ticket?.id_number}
                    </p>
                  </div>

                  <p className="relative bottom-0 text-sm font-semibold mt-4 md:mt-20">
                    Location:{" "}
                    <span className="font-normal">
                      Carnivore Grounds, Nairobi, Kenya
                    </span>
                  </p>

                  {/* Right Floating Section */}
                  <div className="absolute top-4 right-4 text-right text-sm">
                    <p className="font-semibold">
                      {formatEventDate(ticket?.start, ticket?.end)?.date}
                    </p>
                    <p> {formatEventDate(ticket?.start, ticket?.end)?.time}</p>
                  </div>

                  <div className="absolute bottom-4 right-4 text-right text-sm">
                    <p className="font-semibold">Emergency Contact</p>
                    <p>+254721611555</p>
                  </div>
                </div>

                <p className="[writing-mode:vertical-rl] text-center text-white bg-primary py-4">
                  REGULAR
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Link href={ticket?.url}>
              <Button
                padding="px-4 py-2"
                margin="mt-4"
                borderRadius="rounded"
                text="text-white text-sm"
                bg="bg-primary"
              >
                Download ticket
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

CheckoutPage.layout = DashBoardLayout;

const mapStateToProps = (state: RootState) => {
  const fetchingTicketRequestProcessing =
    state.loading.effects.tickets.getTicketById;
  const { ticket } = state.tickets;
  return {
    fetchingTicketRequestProcessing,
    ticket,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getTicketById: (ticketId: string) => dispatch.tickets.getTicketById(ticketId),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuth(CheckoutPage));
