"use client";

import { RootState } from "@/store";
import { NextSeo } from "next-seo";
import * as React from "react";
import { useSelector } from "react-redux";

const SEOProvider: React.FC = ({}) => {
  const { title, description, url, image } = useSelector(
    (state: RootState) => state.metadata
  );
  return (
    <NextSeo
      title={title}
      description={description}
      canonical={url}
      openGraph={{
        url: url,
        title: title,
        description: description,
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: "Fullbooker Image",
          },
        ],
        site_name: "Fullbooker",
      }}
      twitter={{
        handle: "@fullbooker",
        site: "@fullbooker",
        cardType: "summary_large_image",
      }}
    />
  );
};

export default SEOProvider;
