import { Setting } from '../types/setting.types';
import { Input, Select, Caption } from '@repo/ui';
import { SecretInput } from './SecretInput';

interface SettingItemProps {
  setting: Setting;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function SettingItem({ setting, value, onChange, disabled }: SettingItemProps) {
  const renderInput = () => {
    if (setting.type === 'SECRET') {
      return (
        <SecretInput
          value={value || ''}
          onChange={onChange}
          placeholder={setting.metadata?.placeholder}
          disabled={disabled}
        />
      );
    }

    if (setting.type === 'BOOLEAN') {
      return (
        <Select
          value={value || 'false'}
          onValueChange={onChange}
          disabled={disabled}
        >
          <option value="true">Oui</option>
          <option value="false">Non</option>
        </Select>
      );
    }

    if (setting.metadata?.options && setting.metadata.options.length > 0) {
      return (
        <Select
          value={value || ''}
          onValueChange={onChange}
          disabled={disabled}
        >
          <option value="">Sélectionner...</option>
          {setting.metadata.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      );
    }

    if (setting.type === 'NUMBER') {
      return (
        <Input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          min={setting.metadata?.min}
          max={setting.metadata?.max}
          step={setting.metadata?.step}
          placeholder={setting.metadata?.placeholder}
          disabled={disabled}
        />
      );
    }

    if (setting.metadata?.format === 'color') {
      return (
        <div className="flex gap-2">
          <Input
            type="color"
            value={value || '#FF7900'}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="w-16 h-10 p-1"
          />
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={setting.metadata?.placeholder}
            disabled={disabled}
            className="flex-1"
          />
        </div>
      );
    }

    return (
      <Input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={setting.metadata?.placeholder}
        disabled={disabled}
      />
    );
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-900">
        {setting.description || setting.key}
        {setting.type === 'SECRET' && !setting.isPublic && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>
      {renderInput()}
      {setting.type === 'SECRET' && (
        <Caption className="text-gray-500 flex items-center gap-1">
          🔒 Cette valeur est stockée de manière sécurisée
        </Caption>
      )}
      {setting.type === 'NUMBER' && setting.metadata && (
        <Caption className="text-gray-500">
          {setting.metadata.min !== undefined && setting.metadata.max !== undefined && (
            `Valeur entre ${setting.metadata.min} et ${setting.metadata.max}`
          )}
        </Caption>
      )}
    </div>
  );
}
