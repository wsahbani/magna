/**
 * Typography Components
 * Consistent text styling across the application
 */

import * as React from "react"
import { cn } from "../../lib/utils"

// Heading 1 - Main page titles
export interface Heading1Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
}

export const Heading1 = React.forwardRef<HTMLHeadingElement, Heading1Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <h1
        ref={ref}
        className={cn(
          "text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight",
          className
        )}
        {...props}
      >
        {children}
      </h1>
    )
  }
)
Heading1.displayName = "Heading1"

// Heading 2 - Section titles
export interface Heading2Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
}

export const Heading2 = React.forwardRef<HTMLHeadingElement, Heading2Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <h2
        ref={ref}
        className={cn(
          "text-xl sm:text-2xl lg:text-3xl font-semibold leading-snug tracking-tight",
          className
        )}
        {...props}
      >
        {children}
      </h2>
    )
  }
)
Heading2.displayName = "Heading2"

// Heading 3 - Subsection titles
export interface Heading3Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
}

export const Heading3 = React.forwardRef<HTMLHeadingElement, Heading3Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn(
          "text-base sm:text-lg lg:text-xl font-semibold leading-normal",
          className
        )}
        {...props}
      >
        {children}
      </h3>
    )
  }
)
Heading3.displayName = "Heading3"

// Body Large - Important body text
export interface BodyLargeProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
}

export const BodyLarge = React.forwardRef<HTMLParagraphElement, BodyLargeProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          "text-sm sm:text-base lg:text-lg font-normal leading-relaxed",
          className
        )}
        {...props}
      >
        {children}
      </p>
    )
  }
)
BodyLarge.displayName = "BodyLarge"

// Body - Default body text
export interface BodyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  as?: 'p' | 'span' | 'div'
}

export const Body = React.forwardRef<HTMLElement, BodyProps>(
  ({ className, children, as = 'p', ...props }, ref) => {
    const Component = as
    return React.createElement(
      Component,
      {
        ref,
        className: cn(
          "text-xs sm:text-sm lg:text-base font-normal leading-normal",
          className
        ),
        ...props,
      },
      children
    )
  }
)
Body.displayName = "Body"

// Body Small - Secondary body text
export interface BodySmallProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
}

export const BodySmall = React.forwardRef<HTMLParagraphElement, BodySmallProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          "text-[10px] sm:text-xs lg:text-sm font-normal leading-normal text-gray-600",
          className
        )}
        {...props}
      >
        {children}
      </p>
    )
  }
)
BodySmall.displayName = "BodySmall"

// Caption - Small labels and hints
export interface CaptionProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
}

export const Caption = React.forwardRef<HTMLSpanElement, CaptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "text-[10px] sm:text-xs font-normal leading-tight text-gray-500",
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)
Caption.displayName = "Caption"

// Text - Generic text component with variant support
export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  variant?: 'h1' | 'h2' | 'h3' | 'body-large' | 'body' | 'body-small' | 'caption'
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'
}

export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ className, children, variant = 'body', as, ...props }, ref) => {
    const Component = as || (variant && (variant === 'h1' || variant === 'h2' || variant === 'h3') ? variant : 'p')
    
    const variantClasses = {
      'h1': 'text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight',
      'h2': 'text-xl sm:text-2xl lg:text-3xl font-semibold leading-snug tracking-tight',
      'h3': 'text-base sm:text-lg lg:text-xl font-semibold leading-normal',
      'body-large': 'text-sm sm:text-base lg:text-lg font-normal leading-relaxed',
      'body': 'text-xs sm:text-sm lg:text-base font-normal leading-normal',
      'body-small': 'text-[10px] sm:text-xs lg:text-sm font-normal leading-normal text-gray-600',
      'caption': 'text-[10px] sm:text-xs font-normal leading-tight text-gray-500',
    }

    return React.createElement(
      Component,
      {
        ref,
        className: cn(variantClasses[variant], className),
        ...props,
      },
      children
    )
  }
)
Text.displayName = "Text"
