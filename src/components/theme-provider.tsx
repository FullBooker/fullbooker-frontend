"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

import { getPersistor } from "@rematch/persist";
import { PersistGate } from "redux-persist/lib/integration/react";

import { store } from "../../src/store";
import { Provider } from "react-redux";
import NotificationHandler from "../lib/useNotificationHandler";
import AuthProvider from "@/providers/auth.provider";
import SeoProvider from "@/providers/seo.provider";

const persistor = getPersistor();

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SeoProvider />
        <AuthProvider>
          <NextThemesProvider {...props}>{children}</NextThemesProvider>
          <NotificationHandler />
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}
