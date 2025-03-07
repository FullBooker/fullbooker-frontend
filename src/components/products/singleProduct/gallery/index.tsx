import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/shared/button";
import { Product, ProductMedia } from "@/domain/product";
import { MediaType } from "@/domain/constants";

type ProductGalleryProps = {
  product: Product;
  productMedia: Array<ProductMedia>;
  productsRequestProcessing: boolean;
};

const ProductGallery: FC<ProductGalleryProps> = ({
  product,
  productMedia,
  productsRequestProcessing,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div>
      {productsRequestProcessing ? (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          {Array(4)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="w-full h-[150px] md:h-[300px] bg-gray-300 animate-pulse rounded-lg"
              ></div>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {productMedia
            ?.filter(
              (media: ProductMedia) => media.media_type === MediaType.image
            )
            ?.map((photo: ProductMedia, index: number) => (
              <Image
                key={index}
                src={`${photo?.file || "/assets/quad.png"}`}
                alt={"Event"}
                width={isMobile ? 150 : 300}
                height={isMobile ? 150 : 300}
                className="w-full h-[150px] md:h-[300px] object-cover"
                unoptimized={true}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
