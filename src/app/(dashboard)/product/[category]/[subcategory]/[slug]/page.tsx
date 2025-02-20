"use client";

import Image from "next/image";
import Link from "next/link";
import React, { FC, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { RootState } from "@/store";
import "react-loading-skeleton/dist/skeleton.css";
import { ModalID } from "@/domain/components";
import { ProductsFilters } from "@/domain/dto/input";
import { Product, ProductMedia } from "@/domain/product";
import { Currency, ProductCategory, Subcategory } from "@/domain/dto/output";
import DashBoardLayout from "../../../../layout";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { MediaType } from "@/domain/constants";
import Button from "@/components/shared/button";
import { Heart } from "lucide-react";
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
    limit: 10,
  });

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

  const [selectedDate, setSelectedDate] = useState<any>();

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

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const mapRef = useRef<HTMLDivElement | null>(null);

  const scrollToMap = () => {
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
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

  return (
    <div className="flex flex-col h-fit bg-gray-100 max-w-7xl mx-auto px-4 md:px-7">
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
          <div className="flex justify-between mb-2">
            <div>
              <div className="-mb-1">
                <p>
                  {productCategories?.length > 0
                    ? extractSubcategories(productCategories)?.find(
                        (subcat: Subcategory) =>
                          subcat?.id === product?.subcategory
                      )?.name
                    : "N/A"}
                </p>
              </div>
              <div>
                <p>{product?.name}</p>
              </div>
            </div>
            <div>
              <span>
                <Heart className="w-6 h-6 text-black" />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4">
            <div>
              <h2 className="text-xl font-semibold">{product?.name}</h2>
              <p className="text-gray-500">
                {processedCoordinates ? (
                  <LocationIdentifier
                    lat={processedCoordinates?.latitude}
                    lng={processedCoordinates?.longitude}
                  />
                ) : (
                  "N/A"
                )}
              </p>
              <p className="text-gray-500">Mon to Sat from 9AM to 4PM</p>
              <p className="text-lg font-semibold">
                {currencies?.length > 0
                  ? currencies?.find(
                      (currency: Currency) =>
                        currency?.id === product?.pricing[0]?.currency
                    )?.code
                  : "KES"}{" "}
                {addCommaSeparators(
                  Math.round(parseFloat(product?.pricing[0]?.cost))
                )}
              </p>
            </div>
            <div className="text-right">
              <Button
                extraClasses=""
                margin="mt-2"
                borderRadius="rounded-lg"
                text="text-sm"
                onClick={() => scrollToMap()}
              >
                View Map
              </Button>
            </div>
            <div className="hidden md:flex justify-end items-start">
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
                  <p>Kelvin Laichena</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Booking Section */}
        <div className="mt-6  w-full">
          {productsRequestProcessing ? (
            <div className="w-full flex justify-center animate-pulse">
              <div className="flex space-x-4 w-full">
                {/* Tab placeholders */}
                <div className="h-10 w-1/3 bg-gray-300 rounded-md"></div>
                <div className="h-10 w-1/3 bg-gray-300 rounded-md"></div>
                <div className="h-10 w-1/3 bg-gray-300 rounded-md"></div>
              </div>
            </div>
          ) : (
            <div>
               {/* Ticket Details */}
              <TicketDetails
                product={product}
                productsRequestProcessing={productsRequestProcessing}
              />

              {/* Map Section */}
              <div className="mt-6 border-t border-b border-gray-400 py-8 h-[300px] md:h-[550px]" ref={mapRef}>
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
