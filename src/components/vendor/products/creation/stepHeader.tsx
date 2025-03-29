import React, { FC } from "react";

type StepHeaderProps = {
  title: string;
};

const StepHeader: FC<StepHeaderProps> = ({ title }) => {
  return (
    <div className="mt-16 md:mt-12 lg:mt-12 xl:mt-12">
      <p className="text-center text-xl mb-6 md:mb-12 lg:mb-12 xl:mb-12 font-medium">
        {title}
      </p>
    </div>
  );
};

export default StepHeader;
