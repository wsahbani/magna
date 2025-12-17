/**
 * Typography Components
 * Consistent text styling across the application
 */
import * as React from "react";
export interface Heading1Props extends React.HTMLAttributes<HTMLHeadingElement> {
    children: React.ReactNode;
}
export declare const Heading1: React.ForwardRefExoticComponent<Heading1Props & React.RefAttributes<HTMLHeadingElement>>;
export interface Heading2Props extends React.HTMLAttributes<HTMLHeadingElement> {
    children: React.ReactNode;
}
export declare const Heading2: React.ForwardRefExoticComponent<Heading2Props & React.RefAttributes<HTMLHeadingElement>>;
export interface Heading3Props extends React.HTMLAttributes<HTMLHeadingElement> {
    children: React.ReactNode;
}
export declare const Heading3: React.ForwardRefExoticComponent<Heading3Props & React.RefAttributes<HTMLHeadingElement>>;
export interface BodyLargeProps extends React.HTMLAttributes<HTMLParagraphElement> {
    children: React.ReactNode;
}
export declare const BodyLarge: React.ForwardRefExoticComponent<BodyLargeProps & React.RefAttributes<HTMLParagraphElement>>;
export interface BodyProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
    as?: 'p' | 'span' | 'div';
}
export declare const Body: React.ForwardRefExoticComponent<BodyProps & React.RefAttributes<HTMLElement>>;
export interface BodySmallProps extends React.HTMLAttributes<HTMLParagraphElement> {
    children: React.ReactNode;
}
export declare const BodySmall: React.ForwardRefExoticComponent<BodySmallProps & React.RefAttributes<HTMLParagraphElement>>;
export interface CaptionProps extends React.HTMLAttributes<HTMLSpanElement> {
    children: React.ReactNode;
}
export declare const Caption: React.ForwardRefExoticComponent<CaptionProps & React.RefAttributes<HTMLSpanElement>>;
export interface TextProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
    variant?: 'h1' | 'h2' | 'h3' | 'body-large' | 'body' | 'body-small' | 'caption';
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}
export declare const Text: React.ForwardRefExoticComponent<TextProps & React.RefAttributes<HTMLElement>>;
//# sourceMappingURL=typography.d.ts.map