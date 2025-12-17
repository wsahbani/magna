/**
 * Page de Démonstration des Styles de Formulaire
 * Showcase des nouveaux composants avec validation visuelle
 */

import { useState } from 'react';
import { Button, Body } from '@repo/ui';
import { Sparkles } from 'lucide-react';
import { PageWrapper } from '../components/layout';
import { ModernModalExample } from '../features/sipoc/components/ModernModalExample';

export const StyleShowcasePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <PageWrapper
      title="Guide de Style des Formulaires"
      description="Nouveau design system avec validation visuelle et layout moderne"
      breadcrumbs={[
        { label: 'Accueil', href: '/' },
        { label: 'Style Guide', icon: <Sparkles /> },
      ]}
      maxWidth="6xl"
    >
      <div className="space-y-8">

        {/* Demo Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Démonstration
          </h2>
          
          <Body className="text-gray-600 mb-6">
            Cliquez sur le bouton ci-dessous pour voir le modal avec le nouveau style :
          </Body>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-600 text-white hover:bg-orange-700"
          >
            Ouvrir le Modal Exemple
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              ✅ Validation Visuelle
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Checkmarks verts pour les champs remplis</li>
              <li>• Astérisques rouges pour les champs requis</li>
              <li>• Bouton désactivé si formulaire invalide</li>
              <li>• Placeholders explicites en français</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              🎨 Design System
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Layout en grille responsive</li>
              <li>• Couleurs cohérentes (orange/noir)</li>
              <li>• Espacements standardisés</li>
              <li>• Composants réutilisables</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              📱 Responsive
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Grille 3 colonnes → 1 colonne mobile</li>
              <li>• Grille 2 colonnes → 1 colonne mobile</li>
              <li>• Modal adapté aux petits écrans</li>
              <li>• Touch-friendly sur tablette</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              ♿ Accessibilité
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Labels associés aux inputs</li>
              <li>• Contraste WCAG AA</li>
              <li>• Focus rings automatiques</li>
              <li>• États disabled clairs</li>
            </ul>
          </div>
        </div>

        {/* Code Examples */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Composants Disponibles
          </h3>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded p-4">
              <code className="text-sm text-gray-800">
                {'<ValidatedInput value={value} placeholder="..." />'}
              </code>
              <p className="text-xs text-gray-600 mt-2">
                Input avec checkmark vert automatique
              </p>
            </div>

            <div className="bg-gray-50 rounded p-4">
              <code className="text-sm text-gray-800">
                {'<ValidatedSelect value={value} placeholder="...">...</ValidatedSelect>'}
              </code>
              <p className="text-xs text-gray-600 mt-2">
                Select avec checkmark vert automatique
              </p>
            </div>

            <div className="bg-gray-50 rounded p-4">
              <code className="text-sm text-gray-800">
                {'<Label>Champ <span className="text-red-500">*</span></Label>'}
              </code>
              <p className="text-xs text-gray-600 mt-2">
                Label avec astérisque pour champ requis
              </p>
            </div>
          </div>
        </div>

        {/* Documentation Link */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <h3 className="font-semibold text-orange-900 mb-2">
            📚 Documentation Complète
          </h3>
          <Body className="text-orange-800 mb-3">
            Consultez le guide complet pour plus de détails et d'exemples
          </Body>
          <code className="text-sm text-orange-900 bg-orange-100 px-3 py-1 rounded">
            docs/form-styling-guide.md
          </code>
        </div>
      </div>

      {/* Modal */}
      <ModernModalExample
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </PageWrapper>
  );
};
