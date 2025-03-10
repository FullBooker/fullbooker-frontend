import { v4 as uuidv4 } from "uuid";
import {
  getAnonymousAuthToken,
  getToken,
  removeAnonymousAuthToken,
} from "./auth.cookie";

export const buildQueryString = (params: any) => {
  const query = Object.entries(params)
    .map(([key, value]) => {
      if (value !== null && value !== undefined) {
        return `${encodeURIComponent(key)}=${encodeURIComponent(value as any)}`;
      }
      return null; // return null for undefined or null values
    })
    .filter((queryPart) => queryPart !== null) // filter out null values
    .join("&");
  return query;
};

export const hideMiddleCharacters = (number: string, numCharsToHide = 4) => {
  const numString = number?.toString();
  const prefixLength = Math.ceil(numString?.length / 2) - numCharsToHide / 2;
  const suffixLength = Math.floor(numString?.length / 2) + numCharsToHide / 2;

  return `${numString?.slice(0, prefixLength)}${"*".repeat(
    numCharsToHide
  )}${numString?.slice(suffixLength)}`;
};

export const convertToHumanReadableTime = (isoTimestamp: any) => {
  const date = new Date(isoTimestamp);

  // Format options for date and time
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  };

  // Convert to a human-readable string
  return date.toLocaleString("en-US", options as any);
};

export const addCommaSeparators = (num: number): string => {
  return num?.toLocaleString();
};

export const getInitials = (string: string) =>
  string
    ?.split(/\s/)
    .reduce((response, word) => (response += word.slice(0, 1)), "");

export const getQueryParam = (param: string): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

export const extractCoordinates = (coordinateString: string) => {
  const parts = coordinateString?.split("POINT (");
  if (parts?.length < 2) return null;
  const coordinates = parts[1]?.replace(")", "")?.trim()?.split(" ");
  return {
    latitude: parseFloat(coordinates[1]),
    longitude: parseFloat(coordinates[0]),
  };
};

export const generateSlug = (name: string): string => {
  return name?.trim().replace(/\s+/g, "-").toLowerCase();
};

/**
 *
 * @param {*} data
 * @returns
 */
export const encodeBase64 = (data: any) => {
  return Buffer.from(data).toString("base64");
};

/**
 *
 * @param {*} data
 * @returns
 */
export const decodeBase64 = (data: any) => {
  return Buffer.from(data, "base64").toString("ascii");
};

export const generateUUID = () => {
  return uuidv4();
};

export const purgeAnonymousAuthToken = () => {
  const anonymousToken = getAnonymousAuthToken();
  if (anonymousToken) {
    removeAnonymousAuthToken();
  }
};

import { format, parseISO } from "date-fns";

interface OpenDay {
  id: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  host: string;
  day: string;
  day_name: string;
  opening_at: string;
  closing_at: string;
}

interface Availability {
  id: string;
  product: string;
  product_name: string;
  start: string | null;
  end: string | null;
  start_time: string | null;
  end_time: string | null;
  duration: number;
  open_days: OpenDay[];
  closed_dates: string[];
}

export const formatProductAvailability = (
  availability?: Availability
): {
  date: string;
  time: string;
} => {
  if (!availability) {
    return { date: "N/A", time: "N/A" };
  }

  const {
    start = "",
    end = "",
    start_time = "",
    end_time = "",
    open_days = [],
    duration = 0,
  } = availability;

  const formatTime = (time: string) => {
    const current = new Date();
    return format(
      parseISO(
        `${current.getFullYear()}-${(current.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${current
          .getDate()
          .toString()
          .padStart(2, "0")}T${time}`
      ),
      "h:mm a"
    ).replace(/(\d)([AP]M)/, "$1 $2");
  };
  if (start && end && start_time && end_time) {
    const formattedStart = format(parseISO(start), "dd MMM");
    const formattedEnd = format(parseISO(end), "dd MMM");
    const startTime = start_time ? formatTime(start_time) : "";
    const endTime = end_time ? formatTime(end_time) : "";

    return {
      date: `${formattedStart} to ${formattedEnd}`,
      time: `${startTime} - ${endTime}`,
    };
  }

  if (duration && open_days.length > 0) {
    const uniqueDays = Array.from(
      new Set(open_days.map((day) => day.day_name))
    ).join(", ");

    const firstDay = open_days[0];

    const startTime = formatTime(firstDay.opening_at);
    const endTime = formatTime(firstDay.closing_at);

    return {
      date: `${open_days.length}h, ${uniqueDays}`,
      time: `${startTime} - ${endTime}`,
    };
  }

  return { date: "N/A", time: "N/A" };
};

export const humanReadableDate = (isoTimestamp: string): string => {
  const date = new Date(isoTimestamp);
  return date?.toISOString()?.split('T')[0];
};
