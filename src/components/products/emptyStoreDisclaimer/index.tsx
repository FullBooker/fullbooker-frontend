"use client";

import Link from "next/link";
import { Package2, RefreshCw, ShoppingBag } from "lucide-react";
import Button from "@/components/shared/button";

interface EmptyStoreDisclaimerProps {
  title?: string;
  description?: string;
  showRefreshButton?: boolean;
  onRefresh?: () => void;
  ctaText?: string;
  ctaLink?: string;
}

export default function EmptyStoreDisclaimer({
  title = "No products available at the moment",
  description = "We don't have any products in our store right now. Please check back later or browse our categories for upcoming items.",
  showRefreshButton = true,
  onRefresh = () => window.location.reload(),
  ctaText = "Browse categories",
  ctaLink = "/categories",
}: EmptyStoreDisclaimerProps) {
  return (
    <div className="flex min-h-[600px] md:h-screen w-full flex-col items-center justify-center rounded-lg p-8 text-center animate-in fade-in-50">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <ShoppingBag className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mt-6 text-2xl font-semibold">{title}</h3>
      <p className="mt-2 text-center text-muted-foreground md:max-w-md">
        {description}
      </p>
      <div className="mt-6 flex gap-2"></div>
    </div>
  );
}
