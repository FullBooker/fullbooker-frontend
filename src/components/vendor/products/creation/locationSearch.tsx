import React, { useState, useEffect, useRef, FC } from "react";
import {
  APIProvider,
  AdvancedMarker,
  Map,
  useMap,
  useMapsLibrary,
  useAdvancedMarkerRef,
  MapMouseEvent,
} from "@vis.gl/react-google-maps";
import { ChevronDown, MapPin } from "lucide-react";
import {
  NewProductPayload,
  AddProductLocationPayload,
  UpdateProductLocationPayload,
} from "@/domain/dto/input";
import { RootState } from "@/store";
import { connect } from "react-redux";
import { extractCoordinates } from "@/utilities/helpers";

const API_KEY = process.env.NEXT_PUBLIC_API_GOOGLE_MAPS_API_KEY as string;

type LocationSearchProps = {
  loading: boolean;
  newProduct: NewProductPayload;
  addProductLocation: (payload: AddProductLocationPayload) => void;
  updateProductLocation: (payload: UpdateProductLocationPayload) => void;
  setSelectedLocation: (payload: google.maps.places.PlaceResult | null) => void;
  validationErrors: any;
};

const LocationSearch: FC<LocationSearchProps> = ({
  newProduct,
  addProductLocation,
  updateProductLocation,
  setSelectedLocation,
  validationErrors,
}) => {
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const saveProductLocation = (
    payload: AddProductLocationPayload | AddProductLocationPayload
  ): void => {
    if (newProduct?.locations?.length > 0) {
      updateProductLocation({
        ...payload,
        id: newProduct.locations[0].id,
      });
    } else {
      addProductLocation(payload);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userLoc);
          setMarkerPosition(userLoc);
        },
        () => {
          setUserLocation({ lat: 1.286389, lng: 36.817223 });
          setMarkerPosition({ lat: 1.286389, lng: 36.817223 });
        }
      );
    } else {
      setUserLocation({ lat: 1.286389, lng: 36.817223 });
      setMarkerPosition({ lat: 1.286389, lng: 36.817223 });
    }
  }, []);

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
      saveProductLocation({
        product: newProduct?.id,
        lat: selectedPlace?.geometry?.location?.lat(),
        long: selectedPlace?.geometry?.location?.lng(),
        address: selectedPlace?.formatted_address,
      } as AddProductLocationPayload);
    }
  }, [selectedPlace]);

  const fetchFormattedAddress = async (newPos: {
    lat: number;
    lng: number;
  }) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${newPos.lat},${newPos.lng}&key=${API_KEY}`
      );
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        const formattedAddress = data.results[0].formatted_address;

        setMarkerPosition(newPos);
        saveProductLocation({
          product: newProduct?.id as string,
          lat: newPos.lat,
          long: newPos.lng,
          address: formattedAddress,
        });
      } else {
        console.error("No address found for this location");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  const handleMarkerDragEnd = (event: any) => {
    const location: google.maps.LatLngLiteral | null = event?.detail?.latLng;
    if (!location) return;

    const newPos = {
      lat: location?.lat,
      lng: location?.lng,
    };

    fetchFormattedAddress(newPos);
  };

  const handleMapClick = async (event: MapMouseEvent) => {
    const location: google.maps.LatLngLiteral | null = event?.detail?.latLng;
    if (!location) return;

    const newPos = {
      lat: location?.lat,
      lng: location?.lng,
    };

    fetchFormattedAddress(newPos);
  };

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
          defaultZoom={10}
          defaultCenter={
            newProduct?.locations?.length > 0
              ? {
                  lat: extractCoordinates(
                    newProduct?.locations[newProduct?.locations?.length - 1]
                      ?.coordinates
                  )?.latitude as number,
                  lng: extractCoordinates(
                    newProduct?.locations[newProduct?.locations?.length - 1]
                      ?.coordinates
                  )?.longitude as number,
                }
              : userLocation ?? { lat: 1.286389, lng: 36.817223 }
          }
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          style={{
            height: isMobile ? "150px" : "80%",
            width: "100%",
          }}
          onClick={handleMapClick}
        >
          {markerPosition && (
            <AdvancedMarker
              ref={markerRef}
              position={markerPosition}
              draggable={true}
              onDragEnd={handleMarkerDragEnd}
            />
          )}
        </Map>
      </APIProvider>
      {validationErrors && (
        <p className="text-red-500 text-sm mt-3">
          {validationErrors?.location?.message}
        </p>
      )}
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
