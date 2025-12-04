/**
 * Select avec validation visuelle (checkmark vert)
 * Wrapper pour Select avec icône de validation
 */

import * as React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent } from './ui/select';
import { Check } from 'lucide-react';
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

export const ValidatedSelect = ({
  value,
  onValueChange,
  placeholder,
  children,
  showCheckmark,
  id,
  className = '',
}: ValidatedSelectProps) => {
  const hasValue = showCheckmark !== undefined ? showCheckmark : !!value;

  return (
    <div className="relative">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id} className={`h-11 border-gray-300 ${className}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
      {hasValue && (
        <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none z-10">
          <Check className="w-5 h-5 text-green-600" />
        </div>
      )}
    </div>
  );
};
