import { Models } from "@rematch/core";
import { alert } from "./alert";
import { authentication } from "./authentication";
import { components } from "./components";
import { profile } from "./profile";
import { vendor } from "./vendor";
import { settings } from "./settings";
import { products } from "./products";
import { tickets } from "./ticket";
import { metadata } from "./metdata";

export interface RootModel extends Models<RootModel> {
  alert: typeof alert;
  authentication: typeof authentication;
  components: typeof components;
  profile: typeof profile;
  vendor: typeof vendor;
  settings: typeof settings;
  products: typeof products;
  tickets: typeof tickets;
  metadata: typeof metadata;
}

export const models: RootModel = {
  alert,
  authentication,
  components,
  profile,
  vendor,
  settings,
  products,
  tickets,
  metadata,
};
