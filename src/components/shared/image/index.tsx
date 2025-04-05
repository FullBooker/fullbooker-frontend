import Image from "next/image";

interface ImageOutletProps {
  src?: string;
  alt?: string;
  width?: number;
  fill?: boolean;
  height?: number;
  className?: string;
}

const ImageOutlet: React.FC<ImageOutletProps> = ({
  src = "/assets/zero-state-image-default.png",
  alt = "Fullbooker Image",
  fill = false,
  width = 35,
  height = 35,
  className = "",
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
      unoptimized
    />
  );
};

export default ImageOutlet;
