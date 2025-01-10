"use client";

import Image from "next/image";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 w-full bg-white">
      <div className="max-w-[1200px] px-8 py-12">
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
              <Link href="#" className="text-gray-400 hover:text-mainColor">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-mainColor">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-mainColor">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-mainColor">
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-mainColor">
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <div className="flex flex-col gap-3">
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
            <div className="flex flex-col gap-3">
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
            <div className="flex flex-col gap-3">
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
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              Copyright © 2024 BRIX Templates | All Rights Reserved
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-sm text-gray-600 hover:text-mainColor">
                Terms and Conditions
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-mainColor">
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
