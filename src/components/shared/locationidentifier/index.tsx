import { useState, useEffect, FC } from "react";
import axios from "axios";
import { extractCoordinates } from "@/utilities";

type LocationIdentifierProps = {
  lat?: number;
  lng?: number;
  coordinates?: string;
};

const LocationIdentifier: FC<LocationIdentifierProps> = ({
  lat,
  lng,
  coordinates,
}) => {
  const [processedCoordinates, setProcessedCoordinates] =
    useState<ProcessedCoordinates | null>(null);
  const [address, setAddress] = useState("");

  interface ProcessedCoordinates {
    latitude: number;
    longitude: number;
  }

  useEffect(() => {
    if (coordinates) {
      setProcessedCoordinates(
        coordinates ? extractCoordinates(coordinates as string) : null
      );
    }
  }, []);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axios.get(
          processedCoordinates
            ? `https://maps.googleapis.com/maps/api/geocode/json?latlng=${processedCoordinates?.latitude},${processedCoordinates?.longitude}&key=${process.env.NEXT_PUBLIC_API_GOOGLE_MAPS_API_KEY}`
            : `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_API_GOOGLE_MAPS_API_KEY}`
        );

        if (response.data.results.length > 0) {
          setAddress(response.data.results[0].formatted_address);
        } else {
          setAddress("Address not found");
        }
      } catch (error) {
        console.error("Error fetching address:", error);
        setAddress("Error retrieving address");
      }
    };

    if ((lat && lng) || processedCoordinates) {
      fetchAddress();
    }
  }, [processedCoordinates]);

  return <div>{address || "N/A"}</div>;
};

export default LocationIdentifier;
