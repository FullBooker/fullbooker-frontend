import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { FC, useState } from "react";

type NavLinkDropDownProps = {
  label: string;
  href: string;
  children?: any;
  level?: string;
};

const NavLinkDropDown: FC<NavLinkDropDownProps> = ({
  label,
  href,
  children,
  level,
}) => {
  const cleanHref = href.replace(/\s*\/\s*/g, "/").trim();
  const encodedHref = encodeURI(cleanHref);
  const [open, setOpen] = useState(false);

  return (
    <Link
      className={`relative group hover:text-white`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      href={encodedHref}
    >
      <button
        className={`px-4 py-2 text-sm font-medium text-black bg-white hover:bg-primary hover:text-white flex items-center justify-between transition-opacity duration-300 hover:opacity-4 w-full`}
        onClick={() => setOpen(!open)}
      >
        <span className="text-black me-2 hover:text-white">{label}</span>
        {children && <ChevronDown />}
      </button>
      {open && children && (
        <div className="absolute left-10 top-10 mt-0 bg-white shadow-lg transition-opacity duration-300 hover:bg-primary hover:text-white w-48 z-50">
          {children}
        </div>
      )}
    </Link>
  );
};

export default NavLinkDropDown;
