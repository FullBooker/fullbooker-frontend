import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, useState } from "react";

type Subcategory = {
  name: string;
  path: string;
  children?: Subcategory[];
};

type ProductCetgoriesMenuItemProps = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  descendants?: Subcategory[];
};

const ProductCetgoriesMenuItem: FC<ProductCetgoriesMenuItemProps> = ({
  label,
  href,
  icon,
  descendants,
}) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative group flex flex-row items-center py-2 px-6 justify-between hover:opacity-40 w-full">
      {/* <Link href={href}> */}
        <button
          onClick={() => setOpen(!open)}
          className={`flex justify-between flex-row space-x-4 items-center w-full ${
            href === pathname
              ? "border-b-[3px] border-b-mainColor pb-1 w-1/2"
              : ""
          }`}
        >
          <div className="flex w-full space-x-4">
            {icon}
            <span className="font-light text-base flex">{label}</span>
          </div>
          {descendants &&
            (open ? <ChevronUp size={20} /> : <ChevronDown size={20} />)}
        </button>
      {/* </Link> */}

      {open && descendants && (
        <div className="pl-4 mt-2 space-y-2">
          {descendants?.map((child: Subcategory, index: number) => (
            <ProductCetgoriesMenuItem
              key={index}
              label={child.name}
              href={`${href}/${child.path}`}
              descendants={child?.children}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCetgoriesMenuItem;
