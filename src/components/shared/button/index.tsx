interface ButtonAuthProps {
  children: React.ReactNode;
  type?: any;
  onClick?: () => any;
  disabled?: boolean;
  bg?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  text?: string;
  width?: string;
  height?: string;
  extraClasses?: string;
  isSecondary?: boolean;
}

const Button: React.FC<ButtonAuthProps> = ({
  children,
  type = "button",
  onClick,
  disabled = false,
  bg = "bg-primary",
  padding = "py-2 px-8",
  margin,
  borderRadius,
  text = "text-xs lg:text-sm xl:text-sm 2xl:text-base",
  width,
  height,
  extraClasses,
  isSecondary = false,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      className={`cursor-pointer ${padding || ''} ${margin || ''} ${borderRadius || ''} ${bg || ''} ${width || ''} ${height || ''} ${text || ''} transition-opacity duration-200 hover:opacity-40 ${
        isSecondary ? "bg-transparent border border-black text-black" : ""
      } ${extraClasses}`}
      onClick={() => handleClick()}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
