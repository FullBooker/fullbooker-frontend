interface ButtonAuthProps {
  children: React.ReactNode;
  type?: any;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

const ButtonAuth: React.FC<ButtonAuthProps> = ({
  children,
  type = "button",
  onClick,
  disabled = false,
}) => {
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <button
      type={type}
      className="py-3 lg:py-3 xl:py-4 rounded-full text-xs lg:text-sm xl:text-sm 2xl:text-base bg-gradient-to-bl from-mainColor via-redMediumColor to-redDarkColor text-whiteColor w-100 transition-opacity duration-300 hover:opacity-40"
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default ButtonAuth;
