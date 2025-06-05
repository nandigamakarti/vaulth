"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const gradientButtonVariants = cva(
  [
    "gradient-button",
    "inline-flex items-center justify-center whitespace-nowrap", // Added whitespace-nowrap
    "text-base font-medium ring-offset-background transition-colors", // Adjusted base text style, added ring-offset and transition
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", // Enhanced focus style
    "disabled:pointer-events-none disabled:opacity-50",
    "font-sans font-bold text-white", // Kept original font and text color specifics
  ],
  {
    variants: {
      variant: {
        default: "", // Base gradient-button class handles default look
        variant: "gradient-button-variant", // For the alternative gradient style
      },
      size: {
        default: "h-10 px-4 py-2 min-w-[132px] rounded-[11px]", // Adjusted to match original px-9, py-4 and rounded-[11px]
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8 min-w-[132px]", // Added min-w for consistency if needed
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof gradientButtonVariants> {
  asChild?: boolean
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => { // Added 'size' to destructuring
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(gradientButtonVariants({ variant, size, className }))} // Added 'size' to cva call
        ref={ref}
        {...props}
      />
    )
  }
)
GradientButton.displayName = "GradientButton"

export { GradientButton, gradientButtonVariants }
