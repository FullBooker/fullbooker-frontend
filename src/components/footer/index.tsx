"use client";

import Image from "next/image";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bottom-0 w-full bg-white flex justify-center">
      <div className="max-w-[1200px] px-5 py-12 md:px-8">
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
              <Link href="#" className="text-primary hover:text-mainColor">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-primary hover:text-mainColor">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-primary hover:text-mainColor">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-primary hover:text-mainColor">
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-primary hover:text-mainColor">
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <div className="grid grid-cols-3 md:grid-cols-1 gap-3">
              <Link href="#" className="text-sm text-gray-600 hover:text-mainColor">
                Features
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-mainColor">
                Pricing
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-mainColor">
                Case studies
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-mainColor">
                Reviews
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-mainColor">
                Updates
              </Link>
            </div>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <div className="grid grid-cols-3 md:grid-cols-1 gap-3">
              <Link href="#" className="text-sm text-gray-600 hover:text-mainColor">
                About
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-mainColor">
                Contact us
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-mainColor">
                Careers
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-mainColor">
                Culture
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-mainColor">
                Blog
              </Link>
            </div>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <div className="grid grid-cols-3 md:grid-cols-1 gap-3">
              <Link href="#" className="text-sm text-gray-600 hover:text-mainColor">
                Getting started
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-mainColor">
                Help center
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-mainColor">
                Server status
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-mainColor">
                Report a bug
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-mainColor">
                Chat support
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-3 md:pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs md:tex-sm text-black">
              Copyright © {new Date().getFullYear()} Fullbooker
            </p>
            <div className="flex gap-1 ga-3">
              <p className="text-xs md:tex-sm text-black">All Rights Reserved |</p>
              <Link href="#" className="text-xs md:tex-sm text-mainColor hover:text-text-blue-500 decoration-transparent">
                Terms and Conditions
              </Link>
              <p className="text-xs md:tex-sm text-black">|</p>
              <Link href="#" className="text-xs md:tex-sm text-mainColor hover:text-text-blue-500 decoration-transparent">
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
