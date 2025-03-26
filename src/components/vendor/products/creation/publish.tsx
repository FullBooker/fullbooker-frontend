"use client";

import React, { FC, useEffect, useState } from "react";
import { RootState } from "@/store";
import { connect } from "react-redux";
import {
  DeviceType,
  MediaType,
  ProductType,
  ViewType,
} from "@/domain/constants";
import { ActivateProductPayload, NewProductPayload } from "@/domain/dto/input";
import { ProductCategory } from "@/domain/dto/output";
import { ProductMedia, ProductPricing } from "@/domain/product";
import Image from "next/image";
import { ModalID } from "@/domain/components";
import ReverseGeocoding from "./locationPointer";
import { useRouter } from "next/navigation";
import Button from "@/components/shared/button";
import StepHeader from "./stepHeader";
import useDeviceType from "@/lib/hooks/useDeviceType";

type ProductPublishingProps = {
  isProcessingRequest: boolean;
  productType: ProductType;
  setActiveStep: (payload: number) => void;
  newProduct: NewProductPayload;
  productCategories: Array<ProductCategory>;
  setProductPageViewType: (viewType: ViewType) => void;
  setNewProductDetails: (payload: any) => void;
  setProductType: (payload: ProductType) => void;
  productMedia: Array<ProductMedia>;
  setActiveModal: (modalId: ModalID) => void;
  activateProduct: (payload: ActivateProductPayload) => Promise<void>;
};

const ProductPublishing: FC<ProductPublishingProps> = ({
  isProcessingRequest,
  setActiveStep,
  newProduct,
  productCategories,
  productType,
  setProductPageViewType,
  setNewProductDetails,
  setProductType,
  productMedia,
  setActiveModal,
  activateProduct,
}) => {
  const router = useRouter();
  type TicketCategory = {
    key: string;
    title: string;
  };
  const ticketCategories: Array<TicketCategory> = [
    {
      key: "early_bird",
      title: "Early bird ticket",
    },
    {
      key: "standard",
      title: "Standard Ticket",
    },
    {
      key: "standard_at_the_gate",
      title: "Standard at the Gate",
    },
    {
      key: "last_minute",
      title: "Last Minute Ticket",
    },
    {
      key: "vip",
      title: "VIP ticket",
    },
    {
      key: "vvip",
      title: "VVIP Ticket",
    },
  ];

  type PricingCategory = {
    key: string;
    title: string;
  };

  const pricingCategories: Array<PricingCategory> = [
    {
      key: "session",
      title: "Cost per Session",
    },
    {
      key: "day_pass",
      title: "Day Pass",
    },
    {
      key: "monthly_subscription",
      title: "Monthly Subscription",
    },
  ];
  const publishProduct = () => {
    if (!newProduct?.active) {
      activateProduct({
        product: newProduct?.id,
        active: true,
      } as ActivateProductPayload).then(() => {
        router.push("/vendor/products");
      });
    } else {
      router.push("/vendor/products");
    }
  };

  const deviceType = useDeviceType();

  const changeMedia = () => {
    setActiveStep(4);
  };

  const changePricing = () => {
    setActiveStep(5);
  };

  const changeCategory = () => {
    setActiveStep(1);
  };

  const changeLocation = () => {
    setActiveStep(3);
  };

  const renderCategories = (pricing: Array<ProductPricing>) => {
    let categories: Array<string> = [];
    if (productType === ProductType.event) {
      pricing?.map((p: ProductPricing) => {
        categories.push(
          ticketCategories?.find(
            (cat: TicketCategory) => cat.key === p?.ticket_tier
          )?.title as string
        );
      });
    } else {
      pricing?.map((p: ProductPricing) => {
        categories.push(
          pricingCategories?.find((cat: PricingCategory) => cat.key === p?.type)
            ?.title as string
        );
      });
    }
    return categories.join(", ");
  };

  const renderCategoriesMaximumNumberOfTickets = (
    pricing: Array<ProductPricing>
  ) => {
    let categories: Array<string> = [];
    if (productType === ProductType.event) {
      pricing?.map((p: ProductPricing) => {
        categories.push(
          `[${
            ticketCategories?.find(
              (cat: TicketCategory) => cat.key === p?.ticket_tier
            )?.title as string
          } ${p?.maximum_number_of_tickets}]`
        );
      });
    } else {
      pricing?.map((p: ProductPricing) => {
        categories.push(
          `[${
            pricingCategories?.find(
              (cat: PricingCategory) => cat.key === p?.type
            )?.title as string
          } ${p?.maximum_number_of_tickets}]`
        );
      });
    }
    return categories.join(", ");
  };

  function extractCoordinates(coordinateString: string) {
    const parts = coordinateString?.split("POINT (");
    if (parts.length < 2) return null;
    const coordinates = parts[1].replace(")", "").trim().split(" ");
    return {
      latitude: parseFloat(coordinates[1]),
      longitude: parseFloat(coordinates[0]),
    };
  }

  return (
    <div className="px-2 md:px-10">
      <StepHeader title="Product Overview" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border p-6 rounded-xl shadow-sm">
          <h2 className="font-semibold text-lg text-center">
            {" "}
            {productType === ProductType.event ? "Event" : "Activity"} details
          </h2>
          <div className="flex justify-between items-center mb-2">
            <p className="me-1">
              <span className="font-medium">Category:</span>{" "}
              <span className="font-light">
                {renderCategories(newProduct?.pricing)}
              </span>
            </p>
            <Button
              bg="bg-primary"
              borderRadius="rounded"
              text="text-white text-xs"
              padding="py-1 px-4"
              type="button"
              onClick={() => changePricing()}
            >
              Change
            </Button>
          </div>
          <div className="flex justify-between items-center mb-2">
            <p className="me-1">
              <span className="font-medium">Location:</span>{" "}
              <span className="font-light">
                {newProduct?.locations?.length > 0 ? (
                  <ReverseGeocoding
                    lat={
                      extractCoordinates(
                        newProduct?.locations[newProduct?.locations?.length - 1]
                          ?.coordinates
                      )?.latitude as number
                    }
                    lng={
                      extractCoordinates(
                        newProduct?.locations[newProduct?.locations?.length - 1]
                          ?.coordinates
                      )?.longitude as number
                    }
                  />
                ) : (
                  "N/A"
                )}
              </span>
            </p>
            <Button
              bg="bg-primary"
              borderRadius="rounded"
              text="text-white text-xs"
              padding="py-1 px-4"
              type="button"
              onClick={() => changeLocation()}
            >
              Change
            </Button>
          </div>
          <div className="flex justify-between items-center mb-2">
            <p className="me-1">
              <span className="font-medium">Event starts on:</span>{" "}
              {productType === ProductType.event ? (
                <span className="font-light">
                  {`${newProduct?.availability?.start}, ${newProduct?.availability?.start_time} to ${newProduct?.availability?.end}, ${newProduct?.availability?.end_time}`}
                </span>
              ) : (
                <span className="font-light">N/A</span>
              )}
            </p>
            <Button
              bg="bg-primary"
              borderRadius="rounded"
              text="text-white text-xs"
              padding="py-1 px-4"
              type="button"
              onClick={() => changeLocation()}
            >
              Change
            </Button>
          </div>
          <div className="flex justify-between items-center">
            <p className="me-1">
              <span className="font-medium">Maximum No. of tickets: </span>
              <span className="font-light">
                {renderCategoriesMaximumNumberOfTickets(newProduct?.pricing)}
              </span>
            </p>
            <Button
              bg="bg-primary"
              borderRadius="rounded"
              text="text-white text-xs"
              padding="py-1 px-4"
              type="button"
              onClick={() => changePricing()}
            >
              Change
            </Button>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-3 gap-1 w-full">
            <div className="col-span-3 grid grid-flow-col auto-cols-max grid-rows-2 gap-2 overflow-x-auto no-scrollbar w-full min-w-full">
              {productMedia
                ?.filter((p: ProductMedia) => p.media_type === MediaType.image)
                .map((photo: ProductMedia, index: number) => (
                  <div
                    key={index}
                    className="relative mb-2 rounded overflow-hidden"
                  >
                    <Image
                      src={photo?.file}
                      alt={`Photo ${index + 1}`}
                      width={deviceType === DeviceType.mobile ? 150 : 150}
                      height={deviceType === DeviceType.mobile ? 150 : 150}
                      className="w-full h-[150px] md:h-[150px] object-cover cursor-pointer"
                      unoptimized={true}
                    />
                    <button
                      type="button"
                      onClick={() => changeMedia()}
                      className="absolute bottom-2 left-2 px-2 py-1 rounded-full text-xs text-center bg-white"
                    >
                      Change Photo
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {productType === ProductType.event ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newProduct?.pricing?.map(
              (pricing: ProductPricing, index: number) => (
                <div
                  key={index}
                  className="border p-4 rounded-xl shadow flex flex-col min-h-[250px]"
                >
                  <div className="space-y-4 flex-grow">
                    <h3 className="font-semibold text-center mb-2">
                      {
                        ticketCategories.find(
                          (cat: TicketCategory) =>
                            cat.key === pricing.ticket_tier
                        )?.title
                      }{" "}
                      charges
                    </h3>
                    <p className="text-sm font-medium text-center">
                      Cost per Ticket
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Amount</span>
                        <span>KES {Math.round(parseFloat(pricing.cost))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service fee</span>
                        <span>KES {0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Maximum no. of tickets</span>
                        <span>{pricing?.maximum_number_of_tickets}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-auto">
                    <Button
                      width="w-full"
                      bg="bg-primary"
                      borderRadius="rounded"
                      text="text-white text-xs"
                      padding="py-1"
                      margin="mt-3"
                      type="button"
                      onClick={() => changePricing()}
                    >
                      Change
                    </Button>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newProduct?.pricing?.map(
              (pricing: ProductPricing, index: number) => (
                <div
                  key={index}
                  className="border p-4 rounded-xl shadow space-y-2"
                >
                  <h3 className="font-semibold text-center">
                    {
                      pricingCategories.find(
                        (cat: PricingCategory) => cat.key === pricing.type
                      )?.title
                    }{" "}
                    charges
                  </h3>
                  <p className="text-sm font-medium text-center">
                    Cost per{" "}
                    {pricing?.type === "day_pass"
                      ? "per Day Pass"
                      : pricing?.type === "monthly_subscription"
                      ? "Monthly Subscription"
                      : "Session"}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Amount</span>
                      <span>KES {Math.round(parseFloat(pricing.cost))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service fee</span>
                      <span>KES {0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Maximum no. of tickets</span>
                      <span>{pricing?.maximum_number_of_tickets}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <Button
                      width="w-full"
                      bg="bg-primary"
                      borderRadius="rounded"
                      text="text-white text-xs"
                      padding="py-1"
                      margin="mt-3"
                      type="button"
                      onClick={() => changePricing()}
                    >
                      Change
                    </Button>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        <div>
          <div className="grid grid-cols-3 gap-1 w-full">
            <div className="col-span-3 grid grid-flow-col auto-cols-max grid-rows-2 gap-2 overflow-x-auto no-scrollbar w-full min-w-full">
              {productMedia
                ?.filter((p: ProductMedia) => p.media_type === MediaType.video)
                .map((video: ProductMedia, index: number) => (
                  <div
                    key={index}
                    className="relative mb-2 rounded overflow-hidden shadow"
                  >
                    <video
                      src={video?.file}
                      width={deviceType === DeviceType.mobile ? 150 : 150}
                      height={deviceType === DeviceType.mobile ? 150 : 150}
                      className="w-full h-[150px] md:h-[150px] object-cover cursor-pointer"
                      controls={false}
                    />
                    <button
                      type="button"
                      onClick={() => changeMedia()}
                      className="absolute bottom-2 left-2 px-2 py-1 rounded-full text-xs text-center bg-white"
                    >
                      Change Video
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between gap-10 md:gap-0 mb-4 md:mb-10 mt-8 md:mt-4 w-full">
        <div className="w-full flex">
          {newProduct?.active && (
            <Button
              width="w-full md:w-[20%]"
              bg="bg-primary"
              borderRadius="rounded"
              text="text-black"
              padding="py-2"
              margin="mb-2"
              type="button"
              isSecondary
              extraClasses="me-1 md:me-4"
              onClick={() => setActiveModal(ModalID.pauseProductConfirmation)}
            >
              {deviceType === DeviceType.mobile ? (
                "Pause"
              ) : (
                <span>
                  Pause{" "}
                  {productType === ProductType.event ? "Event" : "Activity"}
                </span>
              )}
            </Button>
          )}
        </div>
        {!newProduct?.active && (
          <Button
            width="w-full md:w-[20%]"
            bg="bg-primary"
            borderRadius="rounded"
            text="text-white"
            padding="py-2"
            margin="mb-2"
            type="button"
            onClick={() => {
              setActiveModal(ModalID.activateProductConfirmation);
            }}
            disabled={isProcessingRequest}
          >
            Publish{" "}
          </Button>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const isProcessingRequest = state.loading.effects.vendor.activateProduct;
  const { productType, productMedia, newProduct } = state.vendor;
  return {
    productType,
    isProcessingRequest,
    productMedia,
    newProduct,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  setActiveStep: (payload: number) => dispatch.vendor.setActiveStep(payload),
  setProductPageViewType: (viewType: ViewType) =>
    dispatch.vendor.setProductPageViewType(viewType),
  setNewProductDetails: (payload: any) =>
    dispatch.vendor.setNewProductDetails(payload),
  setProductType: (payload: ProductType) =>
    dispatch.vendor.setProductType(payload),
  setActiveModal: (modalId: ModalID) =>
    dispatch.components.setActiveModal(modalId),
  activateProduct: (payload: ActivateProductPayload) =>
    dispatch.vendor.activateProduct(payload),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductPublishing);
