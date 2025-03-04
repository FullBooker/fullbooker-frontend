"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { RootState } from "@/store";
import "react-loading-skeleton/dist/skeleton.css";
import { ProductsFilters } from "@/domain/dto/input";
import { ComprehensiveProductFilters, Product } from "@/domain/product";
import { Currency, ProductCategory } from "@/domain/dto/output";
import Button from "@/components/shared/button";
import {
  APIProvider,
  ControlPosition,
  MapControl,
  AdvancedMarker,
  Map,
  useMap,
  useMapsLibrary,
  useAdvancedMarkerRef,
  AdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { ChevronDown, MapPin, Search } from "lucide-react";
import useIsMobile from "@/lib/hooks/useIsMobile";
const API_KEY = process.env.NEXT_PUBLIC_API_GOOGLE_MAPS_API_KEY as string;

type SearchFiltersProps = {
  setProductFilters: (payload: ProductsFilters) => void;
  clearProductFilters: () => void;
  productFilters: ComprehensiveProductFilters | null;
  productCategories: Array<ProductCategory>;
  currencies: Array<Currency>;
};

const ComprehensiveSearchFilters: FC<SearchFiltersProps> = ({
  productCategories,
  currencies,
  productFilters,
  setProductFilters,
  clearProductFilters,
}) => {
  const [activeTab, setActiveTab] = useState<string>("location");
  const isMobile = useIsMobile();
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [markerRef, marker] = useAdvancedMarkerRef();
  return (
    <div className="flex flex-col justify-between h-full bg-white">
      <div className="border-b border-gray-400 text-center mb-2">
        <p className="text-black font-semibold text-lg">FILTERS</p>
      </div>
      <div className="text-center mb-2">
        <p className="text-black font-semibold">
          Recreational activities and events
        </p>
      </div>
      <ul className="flex text-sm font-medium text-center rounded-sm border border-gray-400">
        <li className="w-full focus-within:z-10">
          <span
            className={`inline-block w-full p-4 border-r border-gray-200 cursor-pointer hover:text-primary ${
              activeTab === "location" ? "text-primary" : "text-black"
            }`}
            onClick={() => setActiveTab("location")}
          >
            LOCATION
          </span>
        </li>
        <li className="w-full focus-within:z-10">
          <span
            className={`inline-block w-full p-4 border-r border-gray-200 cursor-pointer hover:text-primary ${
              activeTab === "price-range" ? "text-primary" : "text-black"
            }`}
            onClick={() => setActiveTab("price-range")}
          >
            PRICE
          </span>
        </li>
        <li className="w-full focus-within:z-10">
          <span
            className={`inline-block w-full p-4 border-r border-gray-200 cursor-pointer hover:text-primary ${
              activeTab === "categories" ? "text-primary" : "text-black"
            }`}
            onClick={() => setActiveTab("categories")}
          >
            CATEGORY
          </span>
        </li>
      </ul>
      <div className="mt-4 pt-4 mb-8 border-t border-gray-400">
        {/* Location */}
        {activeTab === "location" && (
          <div className="mb-4">
            <div className="relative items-center rounded-md mb-4 row-span-4">
              <APIProvider
                apiKey={API_KEY}
                solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
              >
                <div className="autocomplete-control w-full">
                  <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
                </div>
                <MapHandler place={selectedPlace} marker={marker} />
                <Map
                  mapId={"bf51a910020fa25a"}
                  defaultZoom={3}
                  defaultCenter={
                    selectedPlace
                      ? {
                          lat: selectedPlace?.geometry?.location?.lat() as number,
                          lng: selectedPlace?.geometry?.location?.lng() as number,
                        }
                      : { lat: 1.286389, lng: 36.817223 }
                  }
                  gestureHandling={"greedy"}
                  disableDefaultUI={true}
                  style={{
                    height: isMobile ? "230px" : "250px",
                    width: "100%",
                  }}
                >
                  <AdvancedMarker ref={markerRef} position={null} />
                </Map>
              </APIProvider>
            </div>
            <div className="flex justify-center">
              <Button
                bg="bg-primary"
                borderRadius="rounded"
                margin="mb-2"
                text="text-black"
                padding="py-1 px-2 md:px-6"
                isSecondary
              >
                Save
              </Button>
            </div>
          </div>
        )}

        {/* Price Range */}
        {activeTab === "price-range" && (
          <div className="mb-4">
            <div className="mb-4">
              <h4 className="font-semibold">Price range</h4>
              <p className="text-sm text-black">Prices include taxes</p>
            </div>
            <div className="flex gap-6">
              <input
                type="number"
                placeholder="Min"
                className="w-1/2 p-2 border border-gray-300 rounded"
              />
              <input
                type="number"
                placeholder="Max"
                className="w-1/2 p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex justify-center mt-2 mb-2">
              <input
                type="range"
                min="0"
                max="100000"
                className="w-[80%] text-center mt-2  text-primary"
              />
            </div>
            <div className="flex justify-center">
              <span className="text-sm">KES 0 - KES 100,000</span>
            </div>
          </div>
        )}

        {/* Categories */}
        {activeTab === "categories" && (
          <div className="mb-4">
            <h4 className="font-semibold mb-4">Amenities</h4>
            <div className="grid grid-cols-3 gap-2">
              {[
                "Gear provided",
                "Assisted living",
                "Disability Access",
                "Cafe nearby",
                "Available now",
                "High speed internet",
              ].map((amenity) => (
                <span
                  key={amenity}
                  className="bg-gray-200  py-1 rounded-lg text-xs text-center"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="relative flex justify-between gap-6 bg-white">
        <Button
          width="w-full"
          bg="bg-primary"
          borderRadius="rounded"
          margin="mb-2"
          text="text-black"
          padding="py-2 px-2 md:px-3"
          isSecondary
          onClick={() => clearProductFilters()}
        >
          Clear Filters
        </Button>
        <Button
          width="w-full"
          bg="bg-primary"
          borderRadius="rounded"
          margin="mb-2"
          text="text-white"
          padding="py-2 px-2 md:px-3"
        >
          Load Filters
        </Button>
      </div>
    </div>
  );
};

interface MapHandlerProps {
  place: google.maps.places.PlaceResult | null;
  marker: google.maps.marker.AdvancedMarkerElement | null;
}

const MapHandler = ({ place, marker }: MapHandlerProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !place || !marker) return;

    if (place.geometry?.viewport) {
      map.fitBounds(place.geometry?.viewport);
    }
    marker.position = place.geometry?.location;
  }, [map, place, marker]);

  return null;
};

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

const PlaceAutocomplete = ({ onPlaceSelect }: PlaceAutocompleteProps) => {
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["geometry", "name", "formatted_address"],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener("place_changed", () => {
      onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <div className="autocomplete-container py-1 w-full">
      <div className="flex justify-center items-center w-full mb-5 lg:mb-5 md:mb-5 xl:mb-5">
        <div className="flex items-center w-[80%] border rounded-full px-3">
          <Search className="text-gray-400" />
          <input
            type="text"
            id="autocomplete"
            placeholder="Search for locations"
            className="w-full px-3 bg-transpatent outline-none border-none"
            ref={inputRef}
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const { productFilters } = state.products;
  const { productCategories, currencies } = state.settings;
  return {
    productFilters,
    productCategories,
    currencies,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  setProductFilters: (payload: ComprehensiveProductFilters) =>
    dispatch.products.getProducts(payload),
  clearProductFilters: () => dispatch.products.clearProductFilters(),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ComprehensiveSearchFilters);
