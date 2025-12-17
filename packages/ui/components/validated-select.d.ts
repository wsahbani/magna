/**
 * Select avec validation visuelle (checkmark vert)
 * Wrapper pour Select avec icône de validation
 */
import type { ReactNode } from 'react';
interface ValidatedSelectProps {
    value?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    children: ReactNode;
    showCheckmark?: boolean;
    id?: string;
    className?: string;
}
export declare const ValidatedSelect: ({ value, onValueChange, placeholder, children, showCheckmark, id, className, }: ValidatedSelectProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=validated-select.d.ts.map