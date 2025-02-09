"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

const ComingSoon = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };

  }, []);
  return (
    <div className="h-screen grid place-items-center text-center">
      <div>
        <Image
          src="/assets/frustrated.jpg"
          alt="Fullbooker Logo"
          width={isMobile ? 200 : 400}
          height={isMobile ? 200 : 400}
        />
        <p className="text-xl font-semibold text-black">COMING SOON</p>
        <p className="text-kg font-bold text-primary">STAY TUNED</p>
      </div>
    </div>
  );
};

export default ComingSoon;
