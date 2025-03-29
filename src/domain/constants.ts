export enum ViewType {
  productsListView = "PRODUCTS_LIST_VIEW",
  onboardingView = "ONBOARDING_VIEW",
}

export enum MediaType {
  image = "image",
  video = "video",
}

export enum ProductType {
  default = "NONE",
  event = "EVENT",
  others = "OTHERS",
  oneTime = "ONE_TIME",
  multiDay = "MULTI_DAY",
  recurring = "RECURRING",
  ongoing = "ONGOING",
}

export enum PricingType {
  session = "session",
  dayPass = "day_pass",
  monthlySubscription = "monthly_subscription",
  ticket = "ticket",
}

export enum PricingTickerTier {
  regular = "regular",
  vip = "vip",
  vvip = "vvip",
  standard = "standard",
  standard_at_the_gate = "standard_at_the_gate",
  last_minute = "last_minute",
  early_bird = "early_bird",
}

export enum DeviceType {
  mobile = "mobile",
  desktop = "desktop",
  tablet = "tablet",
}
