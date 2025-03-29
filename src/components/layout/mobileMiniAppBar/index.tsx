import React, { FC } from "react";

type MobileMiniAppBarProps = {
  title: string;
};

const MobileMiniAppBar: FC<MobileMiniAppBarProps> = ({ title }) => {
  return (
    <div className="flex justify-between items-center md:justify-center mb-2 px-4 py-3 shadow md:hidden">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg">{title}</p>
      </div>
    </div>
  );
};

export default MobileMiniAppBar;
