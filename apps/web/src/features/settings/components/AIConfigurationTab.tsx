import { useState, useEffect } from 'react';
import { useSettingsByCategory } from '../hooks/useSettings';
import { useUpdateSetting } from '../hooks/useUpdateSetting';
import { SettingItem } from './SettingItem';
import { Button, Heading2, Body } from '@repo/ui';
import { Loader2, Save } from 'lucide-react';

export function AIConfigurationTab() {
  const { data: settings, isLoading } = useSettingsByCategory('ai');
  const updateSetting = useUpdateSetting();
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (settings) {
      const values: Record<string, string> = {};
      settings.forEach((setting) => {
        values[setting.key] = setting.value || '';
      });
      setFormValues(values);
    }
  }, [settings]);

  const handleChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!settings) return;

    for (const setting of settings) {
      const newValue = formValues[setting.key];
      if (newValue !== setting.value) {
        await updateSetting.mutateAsync({ key: setting.key, value: newValue });
      }
    }
    setHasChanges(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-[#FF7900]" />
      </div>
    );
  }

  if (!settings || settings.length === 0) {
    return (
      <div className="text-center py-12">
        <Body className="text-gray-500">Aucun paramètre IA configuré</Body>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading2>Configuration IA</Heading2>
        <Button
          onClick={handleSave}
          disabled={!hasChanges || updateSetting.isPending}
          className="bg-[#FF7900] hover:bg-[#E66F00]"
        >
          {updateSetting.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Enregistrer
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        {settings.map((setting) => (
          <SettingItem
            key={setting.key}
            setting={setting}
            value={formValues[setting.key] || ''}
            onChange={(value) => handleChange(setting.key, value)}
            disabled={updateSetting.isPending}
          />
        ))}
      </div>
    </div>
  );
}
