"use client";

import Image from "next/image";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bottom-0 w-full bg-white flex justify-center">
      <div className="max-w-[1200px] px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description Column */}
          <div className="col-span-1">
            <Link href="/">
              <Image
                src="/assets/logo.svg"
                alt="Logo"
                width={150}
                height={40}
                className="mb-4"
              />
            </Link>
            <p className="text-sm text-gray-600">
              Ticket booking made easier and simpler
            </p>
            <div className="flex gap-4 mt-4">
              <div className="flex gap-4 mt-4"></div>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="font-light mb-3 md:mb-4 text-primary">Product</h3>
            <div className="grid grid-cols-3 md:grid-cols-1 gap-3">
              <Link
                href="#"
                className="text-sm text-gray-600 hover:text-mainColor"
              >
                Email Marketing
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-600 hover:text-mainColor"
              >
                Campaigns
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-600 hover:text-mainColor"
              >
                Branding
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-600 hover:text-mainColor"
              >
                Offline
              </Link>
            </div>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-light mb-3 md:mb-4 text-primary">About</h3>
            <div className="grid grid-cols-3 md:grid-cols-1 gap-3">
              <Link
                href="#"
                className="text-sm text-gray-600 hover:text-mainColor"
              >
                Our Story
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-600 hover:text-mainColor"
              >
                Benefits
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-600 hover:text-mainColor"
              >
                Team
              </Link>
              <Link
                href="#"
                className="text-sm text-gray-600 hover:text-mainColor"
              >
                Careers
              </Link>
            </div>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="font-light mb-3 md:mb-4 text-primary">Follow Us</h3>
            <div className="grid grid-cols-3 md:grid-cols-1 gap-3">
              <Link
                href="https://www.facebook.com/share/17bq7mDhL9/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-mainColor flex items-center"
              >
                <Facebook className="w-5 h-5 me-2" />  <span className="text-black text-sm">Facebook</span>
              </Link>
              <Link
                href="https://x.com/fullbooker_?t=vJnHyxhz5eH8Yx0uKlo6aQ&s=08"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-mainColor flex items-center"
              >
                <Twitter className="w-5 h-5 me-2" /> <span className="text-black text-sm">Twitter</span>
              </Link>
              <Link
                href="https://www.linkedin.com/company/fullbooker/about/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-mainColor flex items-center"
              >
                <Linkedin className="w-5 h-5 me-1 me-2" />{" "}
                <span className="text-black text-sm ">Linkedin</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-3 md:pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4">
            <div className="">
              <p className="text-xs md:tex-sm text-black">
                Copyright © {new Date().getFullYear()} Fullbooker | All Rights Reserved 
              </p>
            </div>
            <div className="flex gap-1 md:gap-3 mb-10 md:mb-0">
              <Link
                href="/terms-of-service"
                className="text-xs md:tex-sm text-mainColor hover:text-text-blue-500 decoration-transparent"
              >
                Terms of Service
              </Link>
              <p className="text-xs md:tex-sm text-black">|</p>
              <Link
                href="/cookie-policy"
                className="text-xs md:tex-sm text-mainColor hover:text-text-blue-500 decoration-transparent"
              >
                Cookie Policy
              </Link>
              <p className="text-xs md:tex-sm text-black">|</p>
              <Link
                href="/privacy-policy"
                className="text-xs md:tex-sm text-mainColor hover:text-text-blue-500 decoration-transparent"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
