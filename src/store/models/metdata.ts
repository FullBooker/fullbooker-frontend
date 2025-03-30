import { createModel } from "@rematch/core";
import type { RootModel } from ".";

type MetadataState = {
  title: string;
  description: string;
  image: string;
  url: string;
};

export const metadata = createModel<RootModel>()({
  state: {
    title: "Fullbooker",
    description: "Seamless Ticket Booking at your fingertipssddsd",
    image: "/assets/logo.svg",
    url: "https://www.fullbooker.com",
  } as MetadataState,
  reducers: {
    setMetadata(state: MetadataState, payload: Partial<MetadataState>) {
      return { ...state, ...payload };
    },
  },
});
