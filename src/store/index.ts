import persistPlugin from "@rematch/persist";
import loadingPlugin, { ExtraModelsFromLoading } from "@rematch/loading";
import { init, RematchDispatch, RematchRootState } from "@rematch/core";
import { RootModel, models } from "./models";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  whitelist: ["authentication", "settings", "vendor", "products", "tickets", "profile"],
  storage,
};

type FullModel = ExtraModelsFromLoading<RootModel>;

export const store = init<RootModel, FullModel>({
  models,
  plugins: [
    persistPlugin(persistConfig),
    loadingPlugin(),
  ],
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel, FullModel>;
