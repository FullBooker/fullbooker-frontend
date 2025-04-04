"use client";

import React, { FC, useRef, useState } from "react";
import Image from "next/image";
import { Product, ProductMedia } from "@/domain/product";
import { DeviceType, MediaType } from "@/domain/constants";
import { ChevronLeft, ChevronRight, PlayIcon } from "lucide-react";
import { Dialog } from "@headlessui/react";
import ImageOutlet from "@/components/shared/image";
import useDeviceType from "@/lib/hooks/useDeviceType";
import MediaCarousel from "@/components/shared/mediaCarousel";

type ProductGalleryProps = {
  product: Product;
  productMedia: Array<ProductMedia>;
  isFecthingMedia: boolean;
  isFecthingProduct: boolean;
};

const ProductGallery: FC<ProductGalleryProps> = ({
  productMedia,
  isFecthingMedia,
  isFecthingProduct,
  product,
}) => {
  const deviceType = useDeviceType();
  const galleryContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const handleNext = () => {
    if (currentIndex !== null) {
      setCurrentIndex(
        (prevIndex) => ((prevIndex as number) + 1) % productMedia.length
      );
    }
  };

  const handlePrev = () => {
    if (currentIndex !== null) {
      setCurrentIndex(
        (prevIndex) =>
          ((prevIndex as number) - 1 + productMedia.length) %
          productMedia.length
      );
    }
  };

  return (
    <div>
      {isFecthingMedia || isFecthingProduct ? (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 px-4 md:px-7">
          {Array(deviceType === DeviceType.mobile ? 6 : 8)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="w-full h-[150px] md:h-[300px] bg-gray-300 animate-pulse rounded-lg"
              ></div>
            ))}
        </div>
      ) : (
        <div>
          {product && (
            <div className="flex justify-between w-full">
              {!currentIndex && (
                <button
                  className="hidden lg:block bg-white hover:text-primary flex-shrink-0 p-0"
                  onClick={() => {
                    if (galleryContainerRef.current) {
                      galleryContainerRef.current.scrollBy({
                        left: -200,
                        behavior: "smooth",
                      });
                    }
                  }}
                >
                  <ChevronLeft className="w-8 h-8 md:h-14 md:w-14" />
                </button>
              )}

              {product && productMedia?.length > 0 ? (
                <div className="w-full">
                  {deviceType === DeviceType.mobile ? (
                    <MediaCarousel
                      images={productMedia?.map((media: ProductMedia) => ({
                        type: media?.media_type,
                        src: media?.file,
                        alt: product?.name
                          ? `${product.name} Image`
                          : "Event/Activity Image",
                        fill: true,
                        className: "object-cover",
                      }))}
                      isProcessingRequest={isFecthingMedia}
                      className="block md:hidden"
                    />
                  ) : (
                    <div
                      ref={galleryContainerRef}
                      className="hidden md:grid md:grid-flow-col md:auto-cols-max md:grid-rows-2 gap-2 overflow-x-auto no-scrollbar w-full"
                    >
                      {productMedia?.map(
                        (media: ProductMedia, index: number) => (
                          <div
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                          >
                            {media?.media_type === MediaType.image ? (
                              <ImageOutlet
                                src={media?.file}
                                alt={`${
                                  product?.name
                                    ? `${product?.name} Image`
                                    : "Event/Activity Image"
                                }`}
                                width={250}
                                height={250}
                                className="w-full h-[150px] md:h-[250px] object-cover cursor-pointer"
                              />
                            ) : media?.media_type === MediaType.video ? (
                              <div className="relative">
                                <video
                                  src={media?.file}
                                  className="w-full h-[150px] md:h-[250px] object-cover cursor-pointer"
                                  controls={false}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <button className="bg-white rounded-full p-2">
                                    <PlayIcon className="w-8 h-8" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <></>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full">
                  {deviceType === DeviceType.mobile ? (
                    <div className="w-full">
                      <MediaCarousel
                        images={[
                          {
                            src: "/assets/zero-state-image-default.png",
                            alt: "Event/Activity Image",
                          },
                          {
                            src: "/assets/zero-state-image-default.png",
                            alt: "Event/Activity Image",
                          },
                          {
                            src: "/assets/zero-state-image-default.png",
                            alt: "Event/Activity Image",
                          },
                          {
                            src: "/assets/zero-state-image-default.png",
                            alt: "Event/Activity Image",
                          },
                          {
                            src: "/assets/zero-state-image-default.png",
                            alt: "Event/Activity Image",
                          },
                          {
                            src: "/assets/zero-state-image-default.png",
                            alt: "Event/Activity Image",
                          },
                        ]?.map((media: any) => ({
                          type: MediaType.image,
                          src: media?.src,
                          alt: media?.alt,
                          fill: true,
                          className: "object-cover",
                        }))}
                        isProcessingRequest={isFecthingMedia}
                        className="block md:hidden"
                      />
                    </div>
                  ) : (
                    <div
                      ref={galleryContainerRef}
                      className="grid grid-flow-col auto-cols-max grid-rows-2 gap-2 overflow-x-auto no-scrollbar w-full"
                    >
                      {[...Array(6)].map((_, index: number) => (
                        <div key={index}>
                          <ImageOutlet
                            alt={`${
                              product?.name
                                ? `${product?.name} Image`
                                : "Event/Activity Image"
                            }`}
                            width={250}
                            height={250}
                            className="w-full h-[150px] md:h-[250px] object-cover cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {!currentIndex && (
                <button
                  className="hidden lg:block bg-white hover:text-primary flex-shrink-0"
                  onClick={() => {
                    if (galleryContainerRef.current) {
                      galleryContainerRef.current.scrollBy({
                        left: 200,
                        behavior: "smooth",
                      });
                    }
                  }}
                >
                  <ChevronRight className="w-8 h-8 md:h-14 md:w-14" />
                </button>
              )}
            </div>
          )}
        </div>
      )}
      <Dialog
        open={currentIndex !== null}
        onClose={() => setCurrentIndex(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
          <Dialog.Panel className="max-w-3xl w-full bg-transaparent rounded-lg p-4">
            <button
              onClick={() => setCurrentIndex(null)}
              className="absolute top-3 right-3 text-white text-2xl"
            >
              &times;
            </button>

            {/* Navigation Buttons */}
            {currentIndex !== null && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute -left-2 md:left-2 top-1/2 transform -translate-y-1/2 bg-transparent text-white p-2 rounded-full"
                >
                  <ChevronLeft className="w-8 h-8 md:h-14 md:w-14" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute -right-2 md:right-2 top-1/2 transform -translate-y-1/2 bg-transparent text-white p-2 rounded-full"
                >
                  <ChevronRight className="w-8 h-8 md:h-14 md:w-14" />
                </button>
              </>
            )}

            {/* Image Preview */}
            {currentIndex !== null && (
              <div>
                {productMedia[currentIndex]?.media_type === MediaType.image && (
                  <Image
                    src={productMedia[currentIndex]?.file}
                    alt="Preview"
                    width={400}
                    height={400}
                    className="w-full h-auto object-contain"
                    unoptimized
                  />
                )}
                {productMedia[currentIndex]?.media_type === MediaType.video && (
                  <video
                    src={productMedia[currentIndex]?.file}
                    className="w-full h-auto object-contain"
                    controls
                  />
                )}
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default ProductGallery;
