import React from "react";
import NavigationButtons from "./navigationButtons";

const ProductCreationIntro = () => {
  const steps = [
    {
      number: "1",
      title: "Tell us about your product",
      description:
        "What activities do you have? When do they happen? Where are they located?",
    },
    {
      number: "2",
      title: "Upload Photos and videos of your product",
      description:
        "A picture is worth a thousand words, share photos and videos that showcase your products",
    },
    {
      number: "3",
      title: "Publish Your Product",
      description: "Make it official, publish your product and start selling",
    },
  ];

  return (
    <div>
      <p className="font-base mt-4 ml-0 md:ml-5 lg:ml-5 xl:ml-5">
        Add your products to fullbooker
      </p>
      <div className="mt-8 md:mt-20 lg:mt-20 xl:mt-20">
        <p className="text-center text-xl mb-10 md:mb-20 lg:mb-20 xl:mb-20 font-base">
          Let's Get you Started
        </p>
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex items-start space-x-4 mb-8 ml-1 md:ml-10 lg:ml-10 xl:ml-10"
          >
            {/* Circle with number */}
            <div className="flex items-center justify-center w-6 h-6 p-5 md:w-12 lg:w-12 xl:w-12 md:h-12 lg:h-12 xl:h-12 bg-black text-primary text-lg font-bold rounded-full shadow-lg">
              {step.number}
            </div>

            {/* Text Content */}
            <div>
              <h3 className="text-lg md:text-lg lg:text-lg xl:ml-text-lg text-black">
                {step.title}
              </h3>
              <p className="text-black text-sm md:text-lg lg:text-lg xl:ml-text-lg font-thin">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="px-2 md:px-10 mt-4 md:mt-10">
        <NavigationButtons />
      </div>
    </div>
  );
};

export default ProductCreationIntro;
