/**
 * Input avec validation visuelle (checkmark vert)
 * Composant réutilisable pour afficher un input avec icône de validation
 */

import * as React from "react";
import { Input } from './ui/input';
import { Check } from 'lucide-react';
import type { InputProps } from './ui/input';

interface ValidatedInputProps extends InputProps {
  showCheckmark?: boolean;
}

export const ValidatedInput = ({ showCheckmark, className = '', ...props }: ValidatedInputProps) => {
  const hasValue = showCheckmark !== undefined ? showCheckmark : !!props.value;

  return (
    <div className="relative">
      <Input
        {...props}
        className={`h-11 pr-10 border-gray-300 text-gray-900 placeholder:text-gray-500 ${className}`}
      />
      {hasValue && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Check className="w-5 h-5 text-green-600" />
        </div>
      )}
    </div>
  );
};
