/**
 * Settings Page
 * Page de configuration des paramètres système, IA, application et email
 */

import { useState } from 'react';
import { PageWrapper } from '../../../components/layout/PageWrapper';
import { Settings, Bot, AppWindow, Server, Mail } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@repo/ui';
import { AIConfigurationTab } from '../components/AIConfigurationTab';
import { ApplicationTab } from '../components/ApplicationTab';
import { SystemTab } from '../components/SystemTab';
import { EmailTab } from '../components/EmailTab';

type SettingsTab = 'ai' | 'app' | 'system' | 'email';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('ai');

  return (
    <PageWrapper
      title="Paramètres"
      description="Configurez les paramètres de l'application"
      breadcrumbs={[
        {
          label: 'Paramètres',
          icon: <Settings className="w-4 h-4" />,
        },
      ]}
    >
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as SettingsTab)}>
          <TabsList className="border-b border-gray-200">
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              Intelligence Artificielle
            </TabsTrigger>
            <TabsTrigger value="app" className="flex items-center gap-2">
              <AppWindow className="w-4 h-4" />
              Application
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Server className="w-4 h-4" />
              Système
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="ai">
              <AIConfigurationTab />
            </TabsContent>

            <TabsContent value="app">
              <ApplicationTab />
            </TabsContent>

            <TabsContent value="system">
              <SystemTab />
            </TabsContent>

            <TabsContent value="email">
              <EmailTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </PageWrapper>
  );
}
