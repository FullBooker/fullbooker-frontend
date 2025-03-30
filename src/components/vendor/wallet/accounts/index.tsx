import { FC, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { HostAccount } from "@/domain/vendor";

type HostAccountCarouselProps = {
  accounts: Array<HostAccount>;
};

const HostAccountCarousel: FC<HostAccountCarouselProps> = ({ accounts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (accounts.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % accounts.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? accounts.length - 1 : prevIndex - 1
    );
  };

  return (
    <div>
      <div className="bg-green-500 text-white p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <div>
            <div className="text-xs text-green-100">Account Type</div>
            <div className="font-semibold">
              {accounts[currentIndex].account.account_type
                .charAt(0)
                .toUpperCase() +
                accounts[currentIndex].account.account_type.slice(1)}
            </div>
          </div>
          <div className="flex gap-1">
            <div className="w-6 h-6 rounded-full bg-red-500"></div>
            <div className="w-6 h-6 rounded-full bg-yellow-500"></div>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm">
            •••• •••• •••• {accounts[currentIndex].id.slice(-4)}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              KES {accounts[currentIndex].account.balance}
            </span>
            <div className="bg-white bg-opacity-20 p-1 rounded-full">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button className="flex items-center text-gray-500" onClick={prevSlide}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Previous
        </button>
        <div className="flex gap-1">
          {accounts.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? "bg-green-500" : "bg-gray-300"
              }`}
            ></div>
          ))}
        </div>
        <button className="flex items-center text-gray-500" onClick={nextSlide}>
          Next <ArrowRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default HostAccountCarousel;
