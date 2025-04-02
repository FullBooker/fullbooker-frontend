import { DeviceType } from "@/domain/constants";
import useDeviceType from "@/lib/hooks/useDeviceType";
import { useState } from "react";

export default function ProductDescription({
  description,
}: {
  description: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const deviceType = useDeviceType();
  const MAX_LENGTH = deviceType === DeviceType.mobile ? 250 : 700; 

  return (
    <p className="text-sm font-light">
      {expanded ? description : `${description?.substring(0, MAX_LENGTH)}... `}
      {description?.length > MAX_LENGTH && (
        <span
          className="text-primary cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? " Show less" : "Read more"}
        </span>
      )}
    </p>
  );
}
