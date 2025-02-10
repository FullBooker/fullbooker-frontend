import { useState, useEffect, FC } from "react";
import axios from "axios";

type ReverseGeocodingProps = {
  lat: number;
  lng: number;
};

const ReverseGeocoding: FC<ReverseGeocodingProps> = ({ lat, lng }) => {
  const [address, setAddress] = useState("");

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_API_GOOGLE_MAPS_API_KEY}`
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

    fetchAddress();
  }, []);

  return <div>{address}</div>;
};

export default ReverseGeocoding;
