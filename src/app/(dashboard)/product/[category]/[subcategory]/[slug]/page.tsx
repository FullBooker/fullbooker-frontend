"use client";

import Image from "next/image";
import React, { FC, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { RootState } from "@/store";
import "react-loading-skeleton/dist/skeleton.css";
import { ModalID } from "@/domain/components";
import { Product, ProductMedia, ProductPricing } from "@/domain/product";
import { Currency, ProductCategory } from "@/domain/dto/output";
import DashBoardLayout from "../../../../layout";
import Button from "@/components/shared/button";
import {
  Clock,
  Heart,
  Calendar as CalendarIcon,
  MapPin,
  Star,
  ShareIcon,
  ChevronLeft,
} from "lucide-react";
import ProductLocation from "@/components/products/singleProduct/productLocation";
import ProductGallery from "@/components/products/singleProduct/gallery";
import {
  addCommaSeparators,
  extractCoordinates,
  formatProductAvailability,
} from "@/utilities";
import LocationIdentifier from "@/components/shared/locationidentifier";
import useIsMobile from "@/lib/hooks/useIsMobile";
import TicketBooking from "@/components/products/singleProduct/ticketBooking";
import { useRouter } from "next/navigation";

type SingleProductPageProps = {
  productMedia: Array<ProductMedia>;
  product: Product;
  getProductById: (productId: string) => void;
  productCategories: Array<ProductCategory>;
  productsRequestProcessing: boolean;
  getCurrencies: () => void;
  getProductCategories: () => void;
  currencies: Array<Currency>;
  params: {
    slug: string;
  };
};

const SingleProductPage: FC<SingleProductPageProps> & { layout: any } = ({
  product,
  productsRequestProcessing,
  getProductById,
  getProductCategories,
  getCurrencies,
  currencies,
  params,
  productMedia,
}) => {
  const isMobile = useIsMobile();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const buyTicketRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  useEffect(() => {
    getProductCategories();
    getCurrencies();

    if (params?.slug) {
      getProductById(params?.slug?.split("_")[1] as string);
    }
  }, [params?.slug]);

  const scrollToMap = () => {
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToBuyTicket = () => {
    if (buyTicketRef.current) {
      buyTicketRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  interface ProcessedCoordinates {
    latitude: number;
    longitude: number;
  }

  const processedCoordinates: ProcessedCoordinates | null =
    product?.locations?.length > 0
      ? extractCoordinates(product?.locations[0]?.coordinates)
      : null;

  const getPricingRangeString = (pricing: Array<ProductPricing>): string => {
    if (pricing?.length === 1) {
      return addCommaSeparators(Math.round(parseFloat(pricing[0]?.cost)));
    } else if (pricing?.length > 0) {
      const prices = pricing.map((p: ProductPricing) =>
        Math.round(parseFloat(p.cost))
      );
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      return `${addCommaSeparators(minPrice)} - ${addCommaSeparators(
        maxPrice
      )}`;
    } else {
      return "N/A";
    }
  };

  return (
    <div className="h-fit md:max-w-6xl mx-auto">
      <div className="py-3 md:py-8">
        {productsRequestProcessing ? (
          <div className="flex justify-between mb-2 animate-pulse px-4 md:px-7">
            <div>
              <div className="-mb-1">
                <div className="h-4 w-24 bg-gray-300 rounded"></div>
              </div>
              <div>
                <div className="h-6 w-32 bg-gray-300 rounded mt-2"></div>
              </div>
            </div>
            <div>
              <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center md:justify-center mb-2 px-4">
            <div className="flex justify-between items-center">
              <span
                className="md:hidden me-2 cursor-pointer"
                onClick={() => router.back()}
              >
                <ChevronLeft className="w-5 h-5 text-black" />
              </span>
              <p className="text-base font-semibold">{product?.name}</p>
            </div>
            <div className="flex justify-between items-center md:hidden space-x-2">
              <span>
                <ShareIcon className="w-5 h-5 text-black" />
              </span>
              <span>
                <Heart className="w-5 h-5 text-black" />
              </span>
            </div>
          </div>
        )}

        {/* Product Gallery */}
        <ProductGallery
          product={product}
          productMedia={productMedia}
          productsRequestProcessing={productsRequestProcessing}
        />

        <div className="px-4 md:px-7">
          {productsRequestProcessing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4 animate-pulse">
              {/* Left Section */}
              <div>
                <div className="h-6 w-48 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 w-40 bg-gray-300 rounded mb-2"></div>
                <div className="h-6 w-24 bg-gray-300 rounded"></div>
              </div>

              {/* Right Button */}
              <div className="text-right">
                <div className="h-10 w-24 bg-gray-300 rounded-lg inline-block"></div>
              </div>

              {/* Host Info */}
              <div className="hidden md:flex justify-end items-start">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-gray-300 rounded-lg me-2"></div>
                  <div>
                    <div className="h-4 w-20 bg-gray-300 rounded mb-1"></div>
                    <div className="h-4 w-28 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 border-b border-gray-400 pb-3 md:p-4">
              <div className="space-y-2">
                <p className="text-black text-base">
                  <strong>{product?.name}</strong>
                </p>
                <div className="flex items-center text-[#808080] space-x-2">
                  <MapPin className="h-5 w-5" />
                  <p className="text-sm">
                    {product?.locations?.length > 0 ? (
                      <span>{product?.locations[0]?.address}</span>
                    ) : (
                      "N/A"
                    )}
                  </p>
                </div>
                <div
                  className={`${
                    isMobile ? "flex justify-between items-center" : ""
                  } text-[#808080] space-y-1 md:space-y-2 text-sm font-light`}
                >
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 me-2" />
                    <p>
                      {formatProductAvailability(product?.availability)?.date}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 me-2" />
                    <p>
                      {formatProductAvailability(product?.availability)?.time}
                    </p>
                  </div>
                </div>
                <p>
                  {product?.pricing?.length > 0 && (
                    <span className="font-semibold">
                      {currencies?.length > 0
                        ? currencies?.find(
                            (currency: Currency) =>
                              currency?.id === product?.pricing[0]?.currency
                          )?.code
                        : "KES"}{" "}
                      {getPricingRangeString(product?.pricing)}
                    </span>
                  )}
                </p>
              </div>
              <div className="hidden md:block text-center">
                <Button
                  extraClasses=""
                  margin="mt-2"
                  borderRadius="rounded"
                  text="text-sm text-white"
                  onClick={() => scrollToBuyTicket()}
                >
                  Buy Tickets
                </Button>
              </div>
              <div className="hidden lg:flex justify-end items-start">
                <div className="flex items-center">
                  <Image
                    src={`${
                      product?.host?.user?.image ||
                      "/assets/default-profile-picture-placeholder.jpg"
                    }`}
                    alt={"Host Profile Image"}
                    width={isMobile ? 50 : 50}
                    height={isMobile ? 50 : 50}
                    className="rounded-full me-2"
                  />
                  <div className="text-base">
                    <p className="-mb-1">Hosted by</p>
                    <p>
                      {product?.host?.user?.first_name
                        ? `${product?.host?.user?.first_name} ${product?.host?.user?.last_name}`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Booking Section */}
          <div className="w-full">
            {productsRequestProcessing ? (
              <div className="w-full flex justify-center animate-pulse mt-4">
                <div className="flex space-x-4 w-full">
                  {/* Tab placeholders */}
                  <div className="h-10 w-1/3 bg-gray-300 rounded-md"></div>
                  <div className="h-10 w-1/3 bg-gray-300 rounded-md"></div>
                  <div className="h-10 w-1/3 bg-gray-300 rounded-md"></div>
                </div>
              </div>
            ) : (
              <div>
                {/* Product Bio */}
                <div className="space-y-2 pt-3 pb-3 md:pt-10 md:pb-10">
                  <p className="md:text-lg font-semibold md:text-center">
                    ABOUT EVENT
                  </p>
                  <div className="md:hidden flex justify-between items-start">
                    <div className="flex items-center">
                      <Image
                        src="/assets/default-profile-picture-placeholder.jpg"
                        alt={"Host Profile Image"}
                        width={35}
                        height={35}
                        className="rounded-lg me-2"
                      />
                      <div className="text-xs space-y-2">
                        <p className="me-2">Hosted by</p>
                        <p>
                          {product?.host?.user?.first_name
                            ? `${product?.host?.user?.first_name} ${product?.host?.user?.last_name}`
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Star
                        className="h-4 w-4"
                        fill="#E4A70A"
                        style={{
                          color: "#E4A70A",
                        }}
                      />
                      <Star
                        className="h-4 w-4"
                        fill="#E4A70A"
                        style={{
                          color: "#E4A70A",
                        }}
                      />
                      <Star
                        className="h-4 w-4"
                        fill="#E4A70A"
                        style={{
                          color: "#E4A70A",
                        }}
                      />
                      <Star
                        className="h-4 w-4"
                        fill="#E4A70A"
                        style={{
                          color: "#E4A70A",
                        }}
                      />
                      <Star
                        className="h-4 w-4"
                        fill="#DDDDDD"
                        style={{
                          color: "#DDDDDD",
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-sm font-light">{product?.description}</p>
                </div>

                {/* Ticket Booking */}
                <div ref={buyTicketRef}>
                  <TicketBooking
                    product={product}
                    productsRequestProcessing={productsRequestProcessing}
                  />
                </div>

                {/* Map Section */}
                <div
                  className="mt-0 md:mt-6 md:border-t border-gray-400 py-8 h-[300px] md:h-[550px]"
                  ref={mapRef}
                >
                  {product?.locations?.length > 0 && (
                    <ProductLocation
                      coordinates={product?.locations[0]?.coordinates}
                      productsRequestProcessing={productsRequestProcessing}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

SingleProductPage.layout = DashBoardLayout;

const mapStateToProps = (state: RootState) => {
  const productsRequestProcessing =
    state.loading.effects.products.getProductById;
  const { product, productMedia } = state.products;
  const { productCategories, currencies } = state.settings;
  return {
    productMedia,
    product,
    productCategories,
    productsRequestProcessing,
    currencies,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  getProductById: (productId: ModalID) =>
    dispatch.products.getProductById(productId),
  getProductCategories: () => dispatch.settings.getProductCategories(),
  getCurrencies: () => dispatch.settings.getCurrencies(),
});

export default connect(mapStateToProps, mapDispatchToProps)(SingleProductPage);
