"use client";

import CarouselBanner from "@/components/carousel";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Banknote,
  CalendarDays,
  ChevronRight,
  Crown,
  Heart,
  Hourglass,
  UserRound,
  Music,
  Palette,
  Utensils,
  Mountain,
  Landmark,
  Trees,
  Theater,
  Trophy,
  ChevronLeft,
  Users,
  Dumbbell,
  Car,
  Bike,
  // Swimming,
  Mic,
  Target,
  Locate,
  Map,
  LocateIcon,
  MapPin,
  ChevronDown,
  SlidersHorizontal,
  SearchIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { truncateText } from "../helpers/general-helper";
import { connect } from "react-redux";
import { RootState } from "@/store";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import TablePaginationComponent from "@/components/ui/pagination";
import { ModalID } from "@/domain/components";
import SingleProduct from "@/components/products/product";
import SingleProductSkeleton from "@/components/shared/shimmers/singleProduct";
import { ProductsFilters } from "@/domain/dto/input";
import { Product } from "@/domain/product";
import { Currency, ProductCategory } from "@/domain/dto/output";
import ProductCategories from "@/components/products/categories";
import { getToken } from "@/utilities/auth.cookie";
import Button from "@/components/shared/button";

type HomePageProps = {
  isLoggedIn: boolean;
  setActiveModal: (modalId: ModalID) => void;
  getProducts: (payload?: ProductsFilters) => void;
  getProductCategories: () => void;
  products: Array<Product>;
  productCategories: Array<ProductCategory>;
  productsRequestProcessing: boolean;
  getCurrencies: () => void;
  currencies: Array<Currency>;
};

const HomePage: FC<HomePageProps> = ({
  isLoggedIn,
  setActiveModal,
  productCategories,
  products,
  productsRequestProcessing,
  getProducts,
  getProductCategories,
  getCurrencies,
  currencies,
}) => {
  const { theme = "light" } = useTheme();
  const [filters, setFilters] = useState<ProductsFilters>({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    getProductCategories();
    getProducts();
    getCurrencies();
  }, []);

  return (
    <div className="flex flex-col h-fit bg-gray-100">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row gap-8 py-3 lg:py-8 md:py-8 xl:py-8 px-2 md:px-3 lg:px-4">
        <div
          className="flex-1 py-1
          px-4 sm:px-7"
        >
          <h1 className="text-3xl lg:text-5xl md:text-5xl xl:text-5xl font-semibold mb-4 lg:mb-8 lg:w-[50%]">
            Seamless Ticket booking at Your Fingertips
          </h1>
          <p className="text-black mb-4 lg:mb-6">
            FullBooker makes booking for events and recreational activities
            quick and hassle-free
          </p>

          {/* Search Inputs */}
          <div className="flex items-center w-full mb-5 lg:mb-8 md:mb-8 xl:mb-8">
            <div className="">
              <MapPin className="h-10 w-10 text-white fill-primary" />
            </div>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Type your preferred destination"
                className="w-full p-3 rounded-full border bg-white shadow-md outline-none border-none pl-3"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronDown className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="flex items-center w-full">
            <div className="relative left-0 right-0 w-full rounded-lg border border-inputBorderColor">
              <div className="absolute top-3 left-2">
                <SearchIcon className="h-6 w-6 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search for activities and events"
                className="w-full p-3 bg-gray-100 rounded-lg outline-none border-none pl-10"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <SlidersHorizontal className="h-6 w-6 text-black fill-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex-row justify-center items-start h-[250px] px-2 md:px-3 lg:px-4">
          <div className="w-full flex justify-between">
            <div className="lg:flex md:flex xl:flex sm:w-[50%] xs:w-[50%]">
              <Image
                src="/assets/popular-event.svg"
                alt="Hero"
                objectFit="contain"
                className="w-[100%] h-[200px]"
                height={200}
                width={500}
              />
            </div>
            <div className="ml-5 sm:w-[50%] xs:w-[50%] pt-8">
              <p className="font-bold text-3xl lg:text-5xl md:text-5xl xl:text-5xl items-center mb-4">
                50,000+
              </p>
              <p className="text-sm text-black w-[70%]">
                Recreational Activities and Events for you to choose from
              </p>
              <div className="flex justify-cente mt-4 w-[90%] lg:w-[70%] md:w-[70%] xl:w-[70%]">
                <div className="border-b-4 lg:border-b-8 md:border-b-8 xl:border-b-8 border-darkOrange w-[70%]"></div>
                <div className="border-b-4 lg:border-b-8 md:border-b-8 xl:border-b-8 border-gray-400 w-[30%]"></div>
              </div>
            </div>
          </div>
          <div className="w-full h-[160px] bg-black mt-4 rounded-sm p-4">
            <div className="mb-20">
              <p className="text-white text-left">
                Find your favorite events here
              </p>
            </div>
            <div>
              <p className="text-white text-right">Find events near you here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Categories */}
      <ProductCategories categories={productCategories} />

      {/* Popular Now Section */}
      <div className="py-2 lg:py-8 md:py-8 xl:py-8 px-2 md:px-3 lg:px-4 bg-white">
        <div
          className="flex justify-between items-center mb-6 py-4
          px-4 sm:px-7"
        >
          <h2 className="text-xl font-semibold">Popular now</h2>
          <Link href="/products" className="text-mainColor">
            See all
          </Link>
        </div>

        {productsRequestProcessing ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 py-0
            px-4 md:px-7"
          >
            {Array(10)
              .fill(null)
              .map((_, index) => (
                <SingleProductSkeleton key={index} />
              ))}
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 py-0
            px-4 md:px-7"
          >
            {products.map((product: Product, index: number) => (
              <SingleProduct
                key={index}
                product={product}
                currencies={currencies}
                categories={productCategories}
              />
            ))}
          </div>
        )}
      </div>
      <div className="py-8 px-2 md:px-3 lg:px-4 bg-white text-center">
        <div className=" px-4 sm:px-7">
          <p className="mb-10">Explore more events and activities</p>
          {!getToken() && (
            <Button
              width="w-full lg:w-[10%] md:w-[25%]"
              bg="bg-primary"
              borderRadius="rounded-md"
              margin="mb-2"
              text="text-black"
              padding="py-2"
              onClick={() => setActiveModal(ModalID.login)}
            >
              Sign In/Sign Up
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const productsRequestProcessing = state.loading.models.products;
  const { isLoggedIn } = state.authentication;
  const { products } = state.products;
  const { productCategories, currencies } = state.settings;
  return {
    isLoggedIn,
    products,
    productCategories,
    productsRequestProcessing,
    currencies,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  setActiveModal: (modalId: ModalID) =>
    dispatch.components.setActiveModal(modalId),
  getProducts: (payload?: ProductsFilters) =>
    dispatch.products.getProducts(payload),
  getProductCategories: () => dispatch.settings.getProductCategories(),
  getCurrencies: () => dispatch.settings.getCurrencies(),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
