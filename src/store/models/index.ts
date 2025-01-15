import { Models } from "@rematch/core";
import { alert } from "./alert";
import { authentication } from "./authentication";
import { components } from "./components";
import { settings } from "./settings";
import { profile } from './profile';

export interface RootModel extends Models<RootModel> {
  alert: typeof alert;
  authentication: typeof authentication;
  components: typeof components;
  settings: typeof settings;
  profile: typeof profile;
}

export const models: RootModel = {
  alert,
  authentication,
  components,
  settings,
  profile,
};
