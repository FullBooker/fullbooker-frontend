import {
  AddProductLocationPayload,
  NewProductPayload,
  UpdateProductLocationPayload,
} from "@/domain/dto/input";
import { RootState } from "@/store";
import { ChevronDown, MapPin } from "lucide-react";
import React, { useState, useEffect, useRef, FC } from "react";
import { connect } from "react-redux";

declare global {
  interface Window {
    google: any;
  }
}

type LocationSearchProps = {
  loading: boolean;
  newProduct: NewProductPayload;
  addProductLocation: (payload: AddProductLocationPayload) => void;
  updateProductLocation: (payload: UpdateProductLocationPayload) => void;
};

const LocationSearch: FC<LocationSearchProps> = ({
  loading,
  newProduct,
  addProductLocation,
  updateProductLocation,
}) => {
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const autocompleteRef = useRef(null);
  const mapRef = useRef(null);

  const loadGoogleMapsScript = (apiKey: string) => {
    return new Promise((resolve, reject) => {
      if (document.getElementById("google-maps-script")) {
        return;
      }
      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };
  useEffect(() => {
    const apiKey =
      (process.env.NEXT_API_GOOGLE_MAPS_API_KEY as string);
    loadGoogleMapsScript(apiKey).then(() => {
      if (window.google) {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          document.getElementById("autocomplete"),
          {
            types: ["geocode"],
          }
        );
        autocompleteRef.current.addListener("place_changed", handlePlaceSelect);
      }
    });
  }, []);

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      if (newProduct?.locations?.length === 0) {
        addProductLocation({
          product: newProduct?.product,
          lat: place.geometry.location.lat(),
          long: place.geometry.location.lng(),
        } as AddProductLocationPayload);
      } else {
        updateProductLocation({
          product: newProduct?.product,
          lat: place.geometry.location.lat(),
          long: place.geometry.location.lng(),
        } as UpdateProductLocationPayload);
      }
      setLocation(place.formatted_address);
      setCoordinates({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });

      if (mapRef.current) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
          zoom: 15,
        });
        new window.google.maps.Marker({
          position: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
          map,
        });
      }
    }
  };

  return (
    <div className="relative items-center rounded-md mb-4 row-span-4">
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
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <ChevronDown className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>
      <p className="font-thin mb-2">Drag pin to the right location</p>
      <div className="overflow-hidden mb-6">
        <div style={{ width: "100%" }}>
          {location ? (
            <div ref={mapRef} className="w-full h-[200px] md:h-[600px]"></div>
          ) : (
            <iframe
              width="100%"
              height="600"
              frameBorder="0"
              scrolling="no"
              className="h-[200px] md:h-[600px]"
              src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=1%20Grafton%20Street,%20Dublin,%20Ireland+(My%20Business%20Name)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
            >
              <a href="https://www.gps.ie/">gps vehicle tracker</a>
            </iframe>
          )}
        </div>
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
