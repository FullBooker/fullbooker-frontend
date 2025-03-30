"use client";

import Image from "next/image";
import React, { FC, useEffect, useRef, useState } from "react";
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
import { addCommaSeparators, formatProductAvailability } from "@/utilities";
import useIsMobile from "@/lib/hooks/useIsMobile";
import TicketBooking from "@/components/products/singleProduct/ticketBooking";
import { useRouter } from "next/navigation";
import { SocialShareDialog } from "@/components/products/product/social.share";
import Link from "next/link";
import ProductDescription from "@/components/products/product/description";
import NoRecords from "@/components/vendor/products/shared/no-records";
import ImageOutlet from "@/components/shared/image";

type SingleProductPageProps = {
  productMedia: Array<ProductMedia>;
  product: Product;
  getProductById: (productId: string) => void;
  productCategories: Array<ProductCategory>;
  productsRequestProcessing: boolean;
  getCurrencies: () => void;
  getProductCategories: () => void;
  currencies: Array<Currency>;
  clearState: () => void;
  setActiveModal: (modalId: ModalID) => void;
  modalId: ModalID;
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
  clearState,
  modalId,
  setActiveModal,
}) => {
  const isMobile = useIsMobile();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const buyTicketRef = useRef<HTMLDivElement | null>(null);
  const [fullUrl, setFullUrl] = useState<string>("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFullUrl(window.location.href);
    }
  }, []);
  const router = useRouter();
  useEffect(() => {
    getProductCategories();
    getCurrencies();

    if (params?.slug) {
      getProductById(params?.slug?.split("_")[1] as string);
    }
  }, [params?.slug]);

  const scrollToBuyTicket = () => {
    if (buyTicketRef.current) {
      buyTicketRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

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

  useEffect(() => {
    return () => {
      clearState();
    };
  }, []);

  return (
    <div className="h-fit md:max-w-6xl mx-auto">
      {!productsRequestProcessing && !product && (
        <NoRecords message="No matching event or activity found. Please try a different search." />
      )}

      <div className="md:py-8">
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
          <div>
            {product && (
              <div
                className={`fixed md:hidden z-50 w-full flex justify-between items-center md:justify-center mb-2 px-4 py-3 ${
                  isScrolled ? "shadow-md bg-white" : "bg-transparent"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="md:hidden me-2 rounded-full bg-gray-400 p-2 cursor-pointer">
                    <Link href="/">
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </Link>
                  </span>
                </div>
                <div className="flex justify-between items-center md:hidden space-x-2">
                  <span
                    className="cursor-pointer rounded-full bg-gray-400 p-2"
                    onClick={() => setActiveModal(ModalID.productSocialShare)}
                  >
                    <ShareIcon className="w-6 h-6 text-white" />
                  </span>
                  <span className="cursor-pointer rounded-full bg-gray-400 p-2">
                    <Heart className="w-6 h-6 text-white" />
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        <ProductGallery
          product={product}
          productMedia={productMedia}
          productsRequestProcessing={productsRequestProcessing}
        />

        <div className="px-4 md:px-7">
          {productsRequestProcessing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4 animate-pulse">
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
            <div>
              {product && (
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
                          {
                            formatProductAvailability(product?.availability)
                              ?.date
                          }
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 me-2" />
                        <p>
                          {
                            formatProductAvailability(product?.availability)
                              ?.time
                          }
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
                      <ImageOutlet
                        src={
                          product?.host?.user?.image ||
                          "/assets/default-profile-picture-placeholder.jpg"
                        }
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
            </div>
          )}

          <div className="w-full">
            {productsRequestProcessing ? (
              <div className="w-full flex justify-center animate-pulse mt-4">
                <div className="flex space-x-4 w-full">
                  <div className="h-10 w-1/3 bg-gray-300 rounded-md"></div>
                  <div className="h-10 w-1/3 bg-gray-300 rounded-md"></div>
                  <div className="h-10 w-1/3 bg-gray-300 rounded-md"></div>
                </div>
              </div>
            ) : (
              <div>
                {product && (
                  <div>
                    <div className="space-y-2 pt-3 pb-3 md:pt-10 md:pb-10">
                      <p className="md:text-lg font-semibold md:text-center">
                        ABOUT EVENT
                      </p>
                      <div className="md:hidden flex justify-between items-start">
                        <div className="flex items-center">
                          <ImageOutlet
                            src={
                              product?.host?.user?.image ||
                              "/assets/default-profile-picture-placeholder.jpg"
                            }
                            height={35}
                            width={35}
                            alt="Host Profile Image"
                            className="rounded-lg me-2"
                          />

                          <div className="text-xs space-y-2">
                            <p className="me-2 -mb-2">Hosted by</p>
                            <p className="">
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
                      {product?.description && (
                        <ProductDescription
                          description={product?.description}
                        />
                      )}
                    </div>

                    <div ref={buyTicketRef}>
                      <TicketBooking
                        product={product}
                        productsRequestProcessing={productsRequestProcessing}
                      />
                    </div>

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
            )}
          </div>
        </div>
      </div>
      {modalId === ModalID.productSocialShare && (
        <SocialShareDialog title={product?.name} url={fullUrl} />
      )}
    </div>
  );
};

SingleProductPage.layout = DashBoardLayout;

const mapStateToProps = (state: RootState) => {
  const productsRequestProcessing =
    state.loading.effects.products.getProductById;
  const { product, productMedia } = state.products;
  const { productCategories, currencies } = state.settings;
  const { modalId } = state.components;
  return {
    productMedia,
    product,
    productCategories,
    productsRequestProcessing,
    currencies,
    modalId,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  getProductById: (productId: ModalID) =>
    dispatch.products.getProductById(productId),
  getProductCategories: () => dispatch.settings.getProductCategories(),
  getCurrencies: () => dispatch.settings.getCurrencies(),
  clearState: () => {
    dispatch.products.setProductDetails(null);
    dispatch.products.clearCart();
    dispatch.products.setProductMedia([]);
  },
  setActiveModal: (modalId: ModalID) =>
    dispatch.components.setActiveModal(modalId),
});

export default connect(mapStateToProps, mapDispatchToProps)(SingleProductPage);
