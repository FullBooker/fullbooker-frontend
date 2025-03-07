"use client";

import Image from "next/image";
import Link from "next/link";
import React, { FC, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { RootState } from "@/store";
import "react-loading-skeleton/dist/skeleton.css";
import { ModalID } from "@/domain/components";
import { ProductsFilters } from "@/domain/dto/input";
import {
  Product,
  ProductMedia,
  ProductPricing,
  TicketPricingCategory,
  SessionPricingCategory,
} from "@/domain/product";
import { Currency, ProductCategory, Subcategory } from "@/domain/dto/output";
import DashBoardLayout from "../../../../layout";
import {
  AccordionSummary,
  Accordion,
  Box,
  Card,
  CardContent,
  Typography,
  AccordionDetails,
} from "@mui/material";
import { MediaType } from "@/domain/constants";
import Button from "@/components/shared/button";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Heart,
  Calendar as CalendarIcon,
  MapPin,
  Star,
} from "lucide-react";
import { Calendar } from "react-date-range";
import ProductLocation from "@/components/products/singleProduct/productLocation";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useTheme } from "@mui/material/styles";
import ProductReviews from "@/components/products/singleProduct/reviews";
import HostDetails from "@/components/products/singleProduct/hostDetails";
import ProductGallery from "@/components/products/singleProduct/gallery";
import { addCommaSeparators, extractCoordinates } from "@/utilities";
import LocationIdentifier from "@/components/shared/locationidentifier";
import TicketDetails from "@/components/products/singleProduct/ticketDetails";
import ProductsByVendor from "@/components/products/singleProduct/productsByVendor";
import {
  SESSION_PRICING_CATEGORIES,
  TICKET_PRICING_CATEGORIES,
} from "@/constants";
import useIsMobile from "@/lib/hooks/useIsMobile";
import TicketBooking from "@/components/products/singleProduct/ticketBooking";

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
  productCategories,
  product,
  productsRequestProcessing,
  getProductById,
  getProductCategories,
  getCurrencies,
  currencies,
  params,
  productMedia,
}) => {
  const [filters, setFilters] = useState<ProductsFilters>({
    page: 1,
    page_size: 10,
  });
  const [selectedDate, setSelectedDate] = useState<any>();
  const [showOtherPricingOptions, setShowOtherPricingOptions] =
    useState<boolean>(false);

  useEffect(() => {
    getProductCategories();
    getCurrencies();

    if (params?.slug) {
      getProductById(params?.slug?.split("_")[1] as string);
    }
  }, [params?.slug]);

  const extractSubcategories = (
    categories: Array<ProductCategory>
  ): Array<Subcategory> => {
    let subcategories: any[] = [];

    const collectSubcategories = (subcats: Array<Subcategory>) => {
      for (const subcat of subcats) {
        subcategories.push(subcat);
        if (subcat.children && subcat.children.length > 0) {
          collectSubcategories(subcat.children); // Recursively collect nested children
        }
      }
    };

    for (const category of categories) {
      if (category.subcategories && category.subcategories.length > 0) {
        collectSubcategories(category.subcategories);
      }
    }

    return subcategories;
  };

  interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
  }

  function a11yProps(index: number) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const theme = useTheme();

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        className="bg-white"
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  const isMobile = useIsMobile();

  const mapRef = useRef<HTMLDivElement | null>(null);
  const buyTicketRef = useRef<HTMLDivElement | null>(null);

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

  const getDefaultPricingOption = (
    pricingOptions: Array<ProductPricing>
  ): {
    currency: Currency;
    pricingOption: ProductPricing;
  } => {
    if (pricingOptions?.length > 0) {
      const defaultPricingOption = pricingOptions[0];
      return {
        currency: currencies?.find(
          (currency: Currency) =>
            currency?.id === defaultPricingOption?.currency
        ) as Currency,
        pricingOption: defaultPricingOption,
      };
    } else {
      return {
        currency: {} as Currency,
        pricingOption: {} as ProductPricing,
      };
    }
  };

  const renderDefaultPricingOption = () => {
    const defaultPricing: {
      currency: Currency;
      pricingOption: ProductPricing;
    } = getDefaultPricingOption(product?.pricing);

    return (
      <div className="flex justify-between items-center w-full">
        <div className="items-center w-full">
          <p className="text-lg font-semibold text-black">
            {currencies?.length > 0
              ? currencies?.find(
                  (currency: Currency) =>
                    currency?.id === defaultPricing?.pricingOption?.currency
                )?.code
              : "KES"}{" "}
            {addCommaSeparators(
              Math.round(parseFloat(defaultPricing?.pricingOption?.cost))
            )}
          </p>
          <div
            className={`bg-primary rounded-xl px-2 flex justify-center ${
              product?.pricing?.length > 1
                ? "w-[70%] md:w-[70%]"
                : "w-[40%] md:w-[50%] lg:w-[30%]"
            }`}
          >
            <span className="text-white text-xs">
              {defaultPricing?.pricingOption?.type === "ticket"
                ? TICKET_PRICING_CATEGORIES.find(
                    (tCat: TicketPricingCategory) =>
                      tCat.key === defaultPricing?.pricingOption?.ticket_tier
                  )?.title
                : SESSION_PRICING_CATEGORIES.find(
                    (spCat: SessionPricingCategory) =>
                      spCat.key === defaultPricing?.pricingOption?.type
                  )?.title}
            </span>
          </div>
        </div>
        {product?.pricing?.length > 1 && (
          <div
            className="flex items-center cursor-pointer w-full"
            onClick={() => setShowOtherPricingOptions(!showOtherPricingOptions)}
          >
            <p className="text-primary text-sm lg:text-base">
              More pricing options
            </p>
            <span>
              {showOtherPricingOptions ? (
                <ChevronUp className="w-8 h-8 text-primary" />
              ) : (
                <ChevronDown className="w-8 h-8 text-primary" />
              )}
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderPricingRange = (pricing: Array<ProductPricing>): string => {
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
    <div className="flex flex-col h-fit max-w-7xl mx-auto px-4 md:px-7">
      <div className="py-4 md:py-8">
        {productsRequestProcessing ? (
          <div className="flex justify-between mb-2 animate-pulse">
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
          <div className="flex justify-center mb-2">
            <div>
              <p className="text-base font-semibold">{product?.name}</p>
            </div>
            {/* <div>
              <span>
                <Heart className="w-6 h-6 text-black" />
              </span>
            </div> */}
          </div>
        )}

        {/* Product Gallery */}
        <ProductGallery
          product={product}
          productMedia={productMedia}
          productsRequestProcessing={productsRequestProcessing}
        />

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
              <div className="flex items-center text-gray-400 space-x-2">
                <MapPin className="h-5 w-5" />
                <p className="text-sm">
                  {processedCoordinates ? (
                    <LocationIdentifier
                      lat={processedCoordinates?.latitude}
                      lng={processedCoordinates?.longitude}
                    />
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>
              <div
                className={`${
                  isMobile ? "flex justify-between items-center" : ""
                } text-gray-400 space-y-1 md:space-y-2 text-sm font-light`}
              >
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 me-2" />
                  <p className="text-gray-400">Mon to Sat</p>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 me-2" />
                  <p className="text-gray-400">9AM to 4PM</p>
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
                    {renderPricingRange(product?.pricing)}
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
                  src="/assets/default-profile-picture-placeholder.jpg"
                  alt={"Host Profile Image"}
                  width={isMobile ? 50 : 50}
                  height={isMobile ? 50 : 50}
                  className="rounded-lg me-2"
                />
                <div className="text-base">
                  <p className="-mb-2">Hosted by</p>
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
                    <div className="text-xs">
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

              {/* Ticket Details */}
              {/* <div ref={buyTicketRef}>
                <TicketDetails
                  product={product}
                  productsRequestProcessing={productsRequestProcessing}
                />
              </div> */}

              {/* Map Section */}
              <div
                className="mt-0 md:mt-6 md:border-t border-b border-gray-400 py-8 h-[300px] md:h-[550px]"
                ref={mapRef}
              >
                {product?.locations?.length > 0 && (
                  <ProductLocation
                    coordinates={product?.locations[0]?.coordinates}
                    productsRequestProcessing={productsRequestProcessing}
                  />
                )}
              </div>

              {/* Reviews Section */}
              <ProductReviews
                productsRequestProcessing={productsRequestProcessing}
              />

              {/* Host Details */}
              <HostDetails
                productsRequestProcessing={productsRequestProcessing}
              />

              {/* More products by vendor */}
              <ProductsByVendor />
            </div>
          )}
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
