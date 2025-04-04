"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, CheckCircle2, Info, X, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const alertVariants = cva("relative w-full", {
  variants: {
    variant: {
      default: "bg-background text-foreground",
      destructive:
        "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      success:
        "border-green-500/50 text-green-700 dark:border-green-500 [&>svg]:text-green-600",
      warning:
        "border-yellow-500/50 text-yellow-700 dark:border-yellow-500 [&>svg]:text-yellow-600",
      info: "border-blue-500/50 text-blue-700 dark:border-blue-500 [&>svg]:text-blue-600",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const alertIconMap = {
  default: AlertCircle,
  destructive: XCircle,
  success: CheckCircle2,
  warning: AlertCircle,
  info: Info,
};

export interface CustomAlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
  description?: string;
  icon?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const CustomAlert = React.forwardRef<HTMLDivElement, CustomAlertProps>(
  (
    {
      className,
      variant = "default",
      title,
      description,
      icon = true,
      dismissible = false,
      onDismiss,
      children,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(true);
    const IconComponent = alertIconMap[variant as keyof typeof alertIconMap];

    const handleDismiss = () => {
      setIsVisible(false);
      onDismiss?.();
    };

    if (!isVisible) {
      return null;
    }

    return (
      <Alert
        ref={ref}
        variant={variant as any}
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {icon && <IconComponent className="h-4 w-4" />}
        <div className="flex-1">
          {title && <AlertTitle>{title}</AlertTitle>}
          {description && <AlertDescription>{description}</AlertDescription>}
          {children}
        </div>
        {dismissible && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-6 w-6 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        )}
      </Alert>
    );
  }
);
CustomAlert.displayName = "CustomAlert";

export { CustomAlert };
