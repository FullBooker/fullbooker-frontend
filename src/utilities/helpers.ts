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
  const numString = number.toString();
  const prefixLength = Math.ceil(numString.length / 2) - numCharsToHide / 2;
  const suffixLength = Math.floor(numString.length / 2) + numCharsToHide / 2;

  return `${numString.slice(0, prefixLength)}${"*".repeat(
    numCharsToHide
  )}${numString.slice(suffixLength)}`;
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
