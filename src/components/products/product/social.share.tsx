"use client";

import { useState } from "react";
import { Check, Copy, Link as LinkIcon } from "lucide-react";
import UniversalModal from "@/components/layout/modal/UniversalModal";
import { FaXTwitter, FaFacebookF, FaWhatsapp } from "react-icons/fa6";
import Button from "@/components/shared/button";

interface SocialShareDialogProps {
  title: string;
  url: string;
}

export function SocialShareDialog({ url, title }: SocialShareDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const shareOptions = [
    {
      name: "X",
      icon: <FaXTwitter className="h-5 w-5 text-white" />,
      bg: "bg-black",
      onClick: () => {
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
          "_blank",
          "width=550,height=350"
        );
      },
    },
    {
      name: "Facebook",
      icon: <FaFacebookF className="h-5 w-5 text-white" />,
      bg: "bg-blue-500",
      onClick: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank",
          "width=550,height=350"
        );
      },
    },
    {
      name: "WhatsApp",
      icon: <FaWhatsapp className="h-5 w-5 text-white" />,
      bg: "bg-green-500",
      onClick: () => {
        window.open(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`,
          "_blank"
        );
      },
    },
  ];

  return (
    <UniversalModal
      open={true}
      content={
        <div className="p-4 w-full relative">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-gray-600 mt-1">
            Invite your friends or audience to join this experience!
          </p>

          <div className="flex justify-start gap-4 mt-4">
            {shareOptions.map((option) => (
              <button
                key={option.name}
                onClick={option.onClick}
                className={`p-2 rounded-full ${option?.bg} hover:bg-primary transition`}
              >
                {option.icon}
              </button>
            ))}
          </div>

          <div className="flex items-center mt-4">
            <div className="flex items-centerborder border-gray-300 rounded-md overflow-hidden w-[70%] me-2">
              <input
                type="text"
                value={url}
                readOnly
                className="px-3 py-2 text-gray-700 bg-gray-100 outline-none w-full text-sm"
              />
            </div>

            <Button
              onClick={handleCopyLink}
              width="w-[30%]"
              bg="bg-green-600"
              borderRadius="rounded"
              padding="px-2 py-2"
              text="text-white text-sm"
              extraClasses="flex justify-center space-x-2"
            >
              <span className="flex items-center space-x-2">
                {copied ? (
                  <Check className="h-4 w-4 text-white" />
                ) : (
                  <LinkIcon className="h-4 w-4 text-white" />
                )}
                <span>Copy Link</span>
              </span>
            </Button>
          </div>
        </div>
      }
    />
  );
}
