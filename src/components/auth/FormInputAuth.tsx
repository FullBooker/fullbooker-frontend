import { Input } from "@/components/auth/input";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

interface FormInputAuthProps {
  name: string;
  id: string;
  type: string;
  placeholder: string;
  is_password?: boolean;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode; // New prop for the icon
}

const FormInputAuth: React.FC<FormInputAuthProps> = ({
  name,
  id,
  type,
  placeholder,
  is_password = false,
  value,
  onChange,
  error,
  children,
  icon,
}) => {
  const [typeInput, setTypeInput] = useState(is_password ? "password" : type);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setTypeInput(showPassword ? "password" : "text");
  };

  return (
    <div className="flex flex-col space-y-1  font-thin text-sm">
      <label htmlFor={id} className="text-xs lg:text-sm xl:text-base">
        {children}
      </label>
      <div className="relative gap rounded-sm bg-gray-100 shadow-md text-black">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <Input
          type={typeInput}
          name={name}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`pl-${icon ? "4" : "4"} pr-${is_password ? "12" : "4"}`}
          style={{
            border: 'none',
            fontSize: '14px',
            paddingLeft: '34px',
            paddingTop: '10px',
            paddingBottom: '10px',
            color: '#000'
          }}
        />
        {is_password && (
          <div
            className="absolute inset-y-0 right-0 pr-3.5 sm:pr-3 md:pr-3 lg:pr-4 xl:pr-5 flex items-center cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 text-primary" />
            ) : (
              <Eye className="w-4 h-4 text-primary" />
            )}
          </div>
        )}
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default FormInputAuth;
