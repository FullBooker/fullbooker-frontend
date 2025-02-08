import React, { useState, useEffect, useRef, FC } from "react";
import { createRoot } from "react-dom/client";
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
import { ChevronDown, MapPin } from "lucide-react";
import {
  NewProductPayload,
  AddProductLocationPayload,
  UpdateProductLocationPayload,
} from "@/domain/dto/input";
import { RootState } from "@/store";
import { connect } from "react-redux";

const API_KEY = process.env.NEXT_PUBLIC_API_GOOGLE_MAPS_API_KEY as string;

type LocationSearchProps = {
  loading: boolean;
  newProduct: NewProductPayload;
  addProductLocation: (payload: AddProductLocationPayload) => void;
  updateProductLocation: (payload: UpdateProductLocationPayload) => void;
  setSelectedLocation: (payload: google.maps.places.PlaceResult | null) => void;
};

const LocationSearch: FC<LocationSearchProps> = ({
  loading,
  newProduct,
  addProductLocation,
  updateProductLocation,
  setSelectedLocation,
}) => {
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [markerRef, marker] = useAdvancedMarkerRef();
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

  useEffect(() => {
    setSelectedLocation(selectedPlace);
    if (selectedPlace && selectedPlace?.geometry?.location) {
      addProductLocation({
        product: newProduct?.id,
        lat: selectedPlace?.geometry?.location?.lat(),
        long: selectedPlace?.geometry?.location?.lng(),
      } as AddProductLocationPayload);
    }
  }, [selectedPlace]);

  return (
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
          defaultCenter={{ lat: 1.286389, lng: 36.817223 }}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          style={{
            height: isMobile ? "150px" : "85%",
            width: "100%"
          }}
        >
          <AdvancedMarker ref={markerRef} position={null} />
        </Map>
      </APIProvider>
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
      <div className="flex items-center w-full mb-5 lg:mb-5 md:mb-5 xl:mb-5">
        <div className="">
          <MapPin className="h-10 w-10 text-white fill-primary" />
        </div>
        <div className="relative w-full">
          <input
            type="text"
            id="autocomplete"
            placeholder="Where is the product located?"
            className="w-full p-3 rounded-full border bg-white shadow-md outline-none border-none pl-3"
            ref={inputRef}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <ChevronDown className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>
      <div className="px-3">
        <p className="font-thin text-[14px] mb-4">
          Drag pin to the right location
        </p>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const loading = state.loading.models.vendor;
  const { newProduct } = state.vendor;
  return {
    loading,
    newProduct,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  addProductLocation: (payload: AddProductLocationPayload) =>
    dispatch.vendor.addProductLocation(payload),
  updateProductLocation: (payload: UpdateProductLocationPayload) =>
    dispatch.vendor.updateProductLocation(payload),
});

export default connect(mapStateToProps, mapDispatchToProps)(LocationSearch);
