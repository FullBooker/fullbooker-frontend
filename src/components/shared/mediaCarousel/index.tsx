"use client";

import { FC, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import ImageOutlet from "../image";
import { MediaType } from "@/domain/constants";
import VideoOutlet from "../video";

type Media = {
  type: MediaType;
  src?: string;
  alt?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
};

type MediaCarouselProps = {
  images: Array<Media>;
  isProcessingRequest?: boolean;
  className?: string;
};

const MediaCarousel: FC<MediaCarouselProps> = ({
  images,
  isProcessingRequest,
  className,
}) => {
  console.log(images)
  if (!images || images.length === 0) {
    console.warn("No images provided to MediaCarousel");
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastImage = currentIndex === images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className={cn("relative w-full overflow-hidden group", className)}>
      <div className="relative h-[250px] w-full">
        {isProcessingRequest && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 shimmer" />
          </div>
        )}

        {images?.length>0 && (
          <>
            {images[currentIndex]?.type === MediaType.image ? (
              <ImageOutlet {...images[currentIndex]} />
            ) : (
              <VideoOutlet {...images[currentIndex]} />
            )}
          </>
        )}

        {currentIndex > 0 && (
          <button
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={goToPrevious}
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {currentIndex < images.length - 1 && (
          <button
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={goToNext}
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        <div
          className="absolute inset-y-0 left-0 w-12"
          onClick={goToPrevious}
        />
        <div className="absolute inset-y-0 right-0 w-12" onClick={goToNext} />
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              currentIndex === index ? "bg-white w-3" : "bg-white/60"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default MediaCarousel;
