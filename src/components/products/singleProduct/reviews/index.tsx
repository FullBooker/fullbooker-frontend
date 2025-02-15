import React, { FC, useState, useEffect } from "react";
import Image from "next/image";

type ProductReviewsProps = {
  productsRequestProcessing: boolean;
};

const ProductReviews: FC<ProductReviewsProps> = ({
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
        <div className="mt-6 border-b border-gray-400 py-10 animate-pulse">
           <div className="h-4 w-24 bg-gray-300 rounded mb-3"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 space-y-4">
            {[1, 2].map((_, index) => (
              <div key={index} className="flex space-x-4">
                <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 w-40 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 w-24 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 w-[80%] bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6 border-b border-gray-400 py-10">
          <h3 className="text-lg font-semibold mb-3">Reviews</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
            <div className="flex space-x-4 mb-6 md:mb-0">
              <Image
                src="/assets/default-profile-picture-placeholder.jpg"
                className="w-24 h-24 rounded-full"
                alt={"Host Profile Image"}
                width={isMobile ? 24 : 24}
                height={isMobile ? 24 : 24}
              />
              <div>
                <p className="font-medium">Stella Njoki</p>
                <p className="text-gray-240 font-light">Nanyuki, Kenya</p>
                <p className="v">Rating: 5 stars</p>
                <p className="font-light">
                  We thoroughly enjoyed the activity. Highly recommended!
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Image
                src="/assets/default-profile-picture-placeholder.jpg"
                className="w-24 h-24 rounded-full"
                alt={"Host Profile Image"}
                width={isMobile ? 24 : 24}
                height={isMobile ? 24 : 24}
              />
              <div>
                <p className="font-medium">Priscilla Kabirithu</p>
                <p className="text-gray-240 font-light">
                  Johannesburg, South Africa
                </p>
                <p className="font-light">Rating: 5 stars</p>
                <p className="font-light">
                  It was worth every cent! I highly recommend this.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
