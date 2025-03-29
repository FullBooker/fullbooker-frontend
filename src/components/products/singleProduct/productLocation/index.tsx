import React, { useState, useEffect, FC } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { RootState } from "@/store";
import { connect } from "react-redux";
import LocationIdentifier from "@/components/shared/locationidentifier";

const API_KEY = process.env.NEXT_PUBLIC_API_GOOGLE_MAPS_API_KEY as string;

type ProductLocationProps = {
  coordinates: string;
  productsRequestProcessing: boolean;
};

interface ProcessedCoordinates {
  latitude: number;
  longitude: number;
}

const ProductLocation: FC<ProductLocationProps> = ({
  coordinates,
  productsRequestProcessing,
}) => {
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

  const processedCoordinates: ProcessedCoordinates | null =
    extractCoordinates(coordinates);

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
    <div>
      {productsRequestProcessing ? (
        <div className="w-full h-[200px] md:h-[400px] animate-pulse">
          <div className="h-4 w-24 bg-gray-300 rounded mb-3"></div>
          {/* Location Identifier Placeholder */}
          <div className="h-4 w-40 bg-gray-300 rounded mb-2"></div>

          {/* Map Placeholder */}
          <div className="w-full h-full bg-gray-300 rounded-lg"></div>
        </div>
      ) : (
        <div className="w-full h-[200px] md:h-[400px]">
          <h3 className="text-lg font-semibold">Map</h3>
          <p className="mb-2">
            <LocationIdentifier
              lat={processedCoordinates?.latitude as number}
              lng={processedCoordinates?.longitude as number}
            />
          </p>
          <APIProvider apiKey={API_KEY}>
            <Map
              defaultCenter={{
                lat: processedCoordinates?.latitude as number,
                lng: processedCoordinates?.longitude as number,
              }}
              defaultZoom={20}
              className=""
            >
              <Marker
                position={{
                  lat: processedCoordinates?.latitude as number,
                  lng: processedCoordinates?.longitude as number,
                }}
              />
            </Map>
          </APIProvider>
        </div>
      )}
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

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ProductLocation);

