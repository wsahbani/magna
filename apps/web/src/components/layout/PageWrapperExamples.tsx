/**
 * Exemples d'Utilisation de PageWrapper
 * Différents cas d'usage du composant PageWrapper
 */

import { PageWrapper } from './PageWrapper';
import { 
  Plus, 
  Building2, 
  Users, 
  FileText, 
  Settings,
  Download,
  Filter,
} from 'lucide-react';
import { Button } from '@repo/ui';

// ==========================================
// EXEMPLE 1: Page Simple
// ==========================================
export const SimplePage = () => {
  return (
    <PageWrapper
      title="Tableau de Bord"
      description="Vue d'ensemble de vos activités"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contenu du dashboard */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold">Statistiques</h3>
        </div>
      </div>
    </PageWrapper>
  );
};

// ==========================================
// EXEMPLE 2: Page avec Breadcrumbs
// ==========================================
export const PageWithBreadcrumbs = () => {
  return (
    <PageWrapper
      title="Équipe Marketing"
      description="Gérez les membres de l'équipe"
      breadcrumbs={[
        { label: 'Workspaces', href: '/workspaces', icon: <Building2 className="w-4 h-4" /> },
        { label: 'Direction Marketing', href: '/workspaces/123' },
        { label: 'Équipe Marketing', icon: <Users className="w-4 h-4" /> },
      ]}
    >
      <div className="bg-white rounded-lg shadow p-6">
        {/* Liste des membres */}
      </div>
    </PageWrapper>
  );
};

// ==========================================
// EXEMPLE 3: Page avec Actions Multiples
// ==========================================
export const PageWithMultipleActions = () => {
  return (
    <PageWrapper
      title="Processus"
      description="Liste de tous les processus de l'organisation"
      breadcrumbs={[
        { label: 'Processus', icon: <FileText className="w-4 h-4" /> },
      ]}
      actions={
        <>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtrer
          </Button>
          <Button className="bg-orange-600 hover:bg-orange-700">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Processus
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Filtres */}
        <div className="flex gap-4">
          {/* Search, filters, etc. */}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow">
          {/* Table content */}
        </div>
      </div>
    </PageWrapper>
  );
};

// ==========================================
// EXEMPLE 4: Page avec Largeur Limitée
// ==========================================
export const SettingsPage = () => {
  return (
    <PageWrapper
      title="Paramètres"
      description="Configurez les paramètres de votre compte"
      breadcrumbs={[
        { label: 'Paramètres', icon: <Settings className="w-4 h-4" /> },
      ]}
      maxWidth="2xl"
    >
      <div className="bg-white rounded-lg shadow p-6">
        <form className="space-y-6">
          {/* Form fields */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Nom complet</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border rounded-md" 
              placeholder="John Doe"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline">Annuler</Button>
            <Button className="bg-orange-600">Enregistrer</Button>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
};

// ==========================================
// EXEMPLE 5: Page Sans Padding (Full Screen)
// ==========================================
export const DiagramEditorPage = () => {
  return (
    <PageWrapper
      title="Éditeur de Diagramme"
      description="Processus: Gestion des Commandes"
      breadcrumbs={[
        { label: 'Processus', href: '/processes' },
        { label: 'Gestion des Commandes' },
      ]}
      noPadding
      actions={
        <>
          <Button variant="outline">Annuler</Button>
          <Button className="bg-orange-600">Enregistrer</Button>
        </>
      }
    >
      <div className="h-screen bg-gray-100 p-4">
        {/* Full screen editor */}
        <div className="h-full bg-white rounded-lg shadow">
          {/* ReactFlow or diagram editor */}
        </div>
      </div>
    </PageWrapper>
  );
};

// ==========================================
// EXEMPLE 6: Liste avec Filtres
// ==========================================
export const WorkspacesListPage = () => {
  return (
    <PageWrapper
      title="Workspaces"
      description="Gérez la structure organisationnelle de votre entreprise"
      breadcrumbs={[
        { label: 'Workspaces', icon: <Building2 className="w-4 h-4" /> },
      ]}
      actions={
        <Button className="bg-orange-600 hover:bg-orange-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Workspace
        </Button>
      }
    >
      {/* Filtres */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <input 
            type="search"
            placeholder="Rechercher..."
            className="w-full px-4 py-2 pl-10 border rounded-md"
          />
        </div>
        <select className="px-4 py-2 border rounded-md">
          <option>Tous les types</option>
          <option>Groupe</option>
          <option>Direction</option>
        </select>
      </div>

      {/* Grille de cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Cards */}
      </div>
    </PageWrapper>
  );
};

// ==========================================
// EXEMPLE 7: Page de Détails
// ==========================================
export const ProcessDetailsPage = () => {
  const process = {
    name: 'Gestion des Commandes',
    code: 'PROC-001',
    version: '2.1',
  };

  return (
    <PageWrapper
      title={process.name}
      description={`Code: ${process.code} | Version: ${process.version}`}
      breadcrumbs={[
        { label: 'Processus', href: '/processes' },
        { label: 'Commerce', href: '/processes?category=commerce' },
        { label: process.name, icon: <FileText className="w-4 h-4" /> },
      ]}
      actions={
        <>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter PDF
          </Button>
          <Button className="bg-orange-600">
            Modifier
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Tabs */}
        <div className="border-b">
          <nav className="flex gap-4">
            <button className="px-4 py-2 border-b-2 border-orange-600 font-medium">
              Vue d'ensemble
            </button>
            <button className="px-4 py-2 text-gray-600">
              Diagramme
            </button>
            <button className="px-4 py-2 text-gray-600">
              SIPOC
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {/* Process details */}
        </div>
      </div>
    </PageWrapper>
  );
};

// ==========================================
// EXEMPLE 8: Page Vide (Empty State)
// ==========================================
export const EmptyStatePage = () => {
  return (
    <PageWrapper
      title="Mes Projets"
      description="Gérez vos projets et collaborations"
      breadcrumbs={[
        { label: 'Projets', icon: <FileText className="w-4 h-4" /> },
      ]}
      actions={
        <Button className="bg-orange-600 hover:bg-orange-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Projet
        </Button>
      }
    >
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="max-w-sm mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucun projet
          </h3>
          <p className="text-gray-600 mb-6">
            Commencez par créer votre premier projet pour organiser votre travail.
          </p>
          <Button className="bg-orange-600 hover:bg-orange-700">
            <Plus className="w-4 h-4 mr-2" />
            Créer un projet
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
};
