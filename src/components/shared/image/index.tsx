import Image from "next/image";

interface ImageOutletProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

const ImageOutlet: React.FC<ImageOutletProps> = ({
  src = "/assets/zero-state-image-default.png",
  alt = "Profile Image",
  width = 35,
  height = 35,
  className = "",
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      unoptimized={true}
    />
  );
};

export default ImageOutlet;
