import React, { FC } from "react";
import { RootState } from "@/store";
import { Search } from "lucide-react";
import { AuthData } from "@/domain/dto/output";
import { connect } from "react-redux";

type NavbarProps = {
  authData: AuthData;
};

const Navbar: FC<NavbarProps> = ({ authData }) => {
  const formattedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <div className="hidden md:flex justify-between items-center px-1 py-2 md:px-6 md:py-3 lg:px-6 lg:py-3 xl:px-6 xl:py-3 bg-white shadow-sm mt-10 md:mt-0">
      {/* Left Section */}
      <div className="flex items-center space-x-2">
        <h1 className="text-lg font-medium me-3">Hi {authData?.user?.first_name}</h1>
        <span className="text-gray-400 text-sm">» {formattedDate}</span>
      </div>

      {/* Right Section - Search Box */}
      <div className="hidden md:flex lg:flex xl:flex relative">
        <input
          type="text"
          placeholder="Search here"
          className="pl-4 pr-10 py-2 w-48 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 cursor-pointer" />
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const { authData } = state.authentication;
  return { authData };
};

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
