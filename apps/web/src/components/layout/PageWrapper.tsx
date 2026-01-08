/**
 * Page Wrapper
 * Composant de mise en page réutilisable avec breadcrumbs et espacement cohérent
 */

import { ReactNode } from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Heading1, Body, Heading2, Heading3 } from '@repo/ui';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

export interface PageWrapperProps {
  /**
   * Titre principal de la page
   */
  title: string;

  /**
   * Description optionnelle de la page
   */
  description?: string;

  /**
   * Fil d'Ariane (breadcrumbs)
   */
  breadcrumbs?: BreadcrumbItem[];

  /**
   * Actions à afficher dans le header (boutons, etc.)
   */
  actions?: ReactNode;

  /**
   * Contenu principal de la page
   */
  children: ReactNode;

  /**
   * Classe CSS additionnelle pour le container
   */
  className?: string;

  /**
   * Désactiver le padding par défaut
   */
  noPadding?: boolean;

  /**
   * Largeur maximale (défaut: 'full')
   */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | 'full';
}

const maxWidthClasses = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  '4xl': 'max-w-[1600px]',
  '6xl': 'max-w-[1800px]',
  full: 'max-w-full',
};

export const PageWrapper = ({
  title,
  description,
  breadcrumbs,
  actions,
  children,
  className = '',
  noPadding = false,
  maxWidth = 'full',
}: PageWrapperProps) => {
  return (
    <div className={`min-h-screen bg-white ${noPadding ? '' : 'p-6'}`}>
      <div className={`mx-auto ${maxWidthClasses[maxWidth]} space-y-6`}>
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Fil d'Ariane" className="flex items-center space-x-2 text-sm">
            {/* Home */}
            <Link
              to="/"
              className="flex items-center text-gray-500 hover:text-orange-600 transition-colors"
            >
              <Home className="w-4 h-4" />
            </Link>

            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                {item.href && index < breadcrumbs.length - 1 ? (
                  <Link
                    to={item.href}
                    className="flex items-center gap-1 text-gray-500 hover:text-orange-600 transition-colors"
                  >
                    {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span className="flex items-center gap-1 text-gray-900 font-medium">
                    {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                    <span>{item.label}</span>
                  </span>
                )}
              </div>
            ))}
          </nav>
        )}

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Heading3 className="text-gray-900">{title}</Heading3>
            {description && (
              <Body className="text-gray-600 mt-1">{description}</Body>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>

        {/* Content */}
        <div className={className}>{children}</div>
      </div>
    </div>
  );
};
