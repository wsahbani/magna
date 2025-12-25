import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@repo/ui';

interface SecretInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function SecretInput({ value, onChange, placeholder, disabled }: SecretInputProps) {
  const [showSecret, setShowSecret] = useState(false);
  const isMasked = value === '••••••••';

  return (
    <div className="relative">
      <Input
        type={showSecret ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Entrez la clé...'}
        disabled={disabled}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setShowSecret(!showSecret)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        disabled={disabled || isMasked}
      >
        {showSecret ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
