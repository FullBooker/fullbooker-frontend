"use client";

import { useState } from "react";
import { Check, Copy, Facebook, Linkedin, Mail, MailIcon, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/auth/input";
import UniversalModal from "@/components/layout/modal/UniversalModal";
import { FaXTwitter, FaFacebookMessenger } from "react-icons/fa6";

interface SocialShareDialogProps {
  title: string;
  url: string;
  trigger?: React.ReactNode;
}

export function SocialShareDialog({
  title,
  url,
  trigger,
}: SocialShareDialogProps) {
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
      name: "Email",
      icon: <MailIcon className="h-4 w-4" />,
      onClick: () => {
        window.open(
          `mailto:?subject=${encodeURIComponent(
            title
          )}&body=${encodeURIComponent(`Check out this event: ${url}`)}`,
          "_blank",
          "width=550,height=350"
        );
      },
    },
    {
      name: "Twitter",
      icon: <FaXTwitter className="h-4 w-4" />,
      onClick: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            title
          )}&url=${encodeURIComponent(url)}`,
          "_blank",
          "width=550,height=350"
        );
      },
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-4 w-4" />,
      onClick: () => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`,
          "_blank",
          "width=550,height=350"
        );
      },
    },
    {
      name: "Facebook",
      icon: <Facebook className="h-4 w-4" />,
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
  ];

  return (
    <UniversalModal
      open={true}
      content={
        <div className="p-1">
          <h3 className="text-lg mb-4">Share this event</h3>

          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <p className="bg-muted/30 focus-visible:ring-1 outline-none border border-gray-400 rounded px-2 py-1 h-9 overflow-x-auto">
                {url}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleCopyLink}
              className="px-3 transition-all duration-200"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="sr-only">Copy</span>
            </Button>
          </div>

          <div className="mt-6">
            <div className="text-sm font-medium mb-3">Share via</div>
            <div className="flex flex-wrap gap-2">
              {shareOptions.map((option) => (
                <Button
                  key={option.name}
                  variant="outline"
                  size="sm"
                  onClick={option.onClick}
                  className="flex items-center gap-2 hover:bg-muted/50"
                >
                  {option.icon}
                  <span>{option.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      }
      trigger={trigger}
    />
  );
}
