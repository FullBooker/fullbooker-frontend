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
}) => {
  const [typeInput, setTypeInput] = useState(is_password ? "password" : type);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setTypeInput(showPassword ? "password" : "text");
  };

  return (
    <div className={`flex flex-col space-y-2`}>
      <label htmlFor={id} className="text-xs lg:text-sm xl:text-base">
        {children}
      </label>
      <div className="relative">
        <Input
          type={typeInput}
          name={name}
          id={id}
          placeholder={placeholder}
          // error={error}
          value={value}
          onChange={onChange}
        />
        {is_password ? (
          <div
            className="absolute inset-y-0 right-0 pr-3.5 sm:pr-3 md:pr-3 lg:pr-4 xl:pr-5 flex items-center cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-7 sm:w-5 sm:h-8 lg:w-5 lg:h-9 xl:w-7 xl:h-10" />
            ) : (
              <Eye className="w-4 h-7 sm:w-5 sm:h-8 lg:w-5 lg:h-9 xl:w-7 xl:h-10" />
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default FormInputAuth;
