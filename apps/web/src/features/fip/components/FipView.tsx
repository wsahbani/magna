import React from 'react';
import { Heading2, BodySmall, Caption } from '@repo/ui';
import { ProcessIdentityCard } from '../types/fip.types';

interface FipViewProps {
  fip: ProcessIdentityCard;
}

export const FipView: React.FC<FipViewProps> = ({ fip }) => {
  return (
    <div className="space-y-6">
      {/* Objectifs */}
      {fip.objectives && (
        <div>
          <Heading2 className="mb-2">Objectifs</Heading2>
          <BodySmall className="text-gray-700 whitespace-pre-wrap">{fip.objectives}</BodySmall>
        </div>
      )}

      {/* Périmètre */}
      {fip.scope && (
        <div>
          <Heading2 className="mb-2">Périmètre</Heading2>
          <BodySmall className="text-gray-700 whitespace-pre-wrap">{fip.scope}</BodySmall>
        </div>
      )}

      {/* Indicateurs */}
      {fip.indicators && fip.indicators.length > 0 && (
        <div>
          <Heading2 className="mb-3">Indicateurs de Performance</Heading2>
          <div className="space-y-3">
            {fip.indicators.map((indicator, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <Caption className="font-semibold text-lg">{indicator.name}</Caption>
                  {indicator.unit && (
                    <Caption className="text-gray-500">({indicator.unit})</Caption>
                  )}
                </div>
                {indicator.description && (
                  <BodySmall className="text-gray-600 mb-2">{indicator.description}</BodySmall>
                )}
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {indicator.targetValue !== undefined && (
                    <div>
                      <Caption className="text-gray-500">Valeur cible</Caption>
                      <BodySmall className="font-medium">{indicator.targetValue}</BodySmall>
                    </div>
                  )}
                  {indicator.currentValue !== undefined && (
                    <div>
                      <Caption className="text-gray-500">Valeur actuelle</Caption>
                      <BodySmall className="font-medium">{indicator.currentValue}</BodySmall>
                    </div>
                  )}
                  {indicator.frequency && (
                    <div>
                      <Caption className="text-gray-500">Fréquence</Caption>
                      <BodySmall className="font-medium capitalize">{indicator.frequency}</BodySmall>
                    </div>
                  )}
                  {indicator.responsible && (
                    <div>
                      <Caption className="text-gray-500">Responsable</Caption>
                      <BodySmall className="font-medium">{indicator.responsible}</BodySmall>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Acteurs */}
      {fip.stakeholders && fip.stakeholders.length > 0 && (
        <div>
          <Heading2 className="mb-3">Acteurs et Responsabilités</Heading2>
          <div className="space-y-3">
            {fip.stakeholders.map((stakeholder, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <Caption className="font-semibold text-lg">{stakeholder.name}</Caption>
                  <Caption className="text-gray-500">{stakeholder.role}</Caption>
                </div>
                {stakeholder.responsibility && (
                  <BodySmall className="text-gray-700 mb-1">
                    {stakeholder.responsibility}
                  </BodySmall>
                )}
                {stakeholder.contact && (
                  <BodySmall className="text-gray-500">{stakeholder.contact}</BodySmall>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risques */}
      {fip.risks && fip.risks.length > 0 && (
        <div>
          <Heading2 className="mb-3">Risques</Heading2>
          <div className="space-y-3">
            {fip.risks.map((risk, index) => (
              <div key={index} className="p-4 border border-red-200 rounded-md bg-red-50">
                <BodySmall className="font-medium mb-2">{risk.description}</BodySmall>
                <div className="flex gap-4">
                  {risk.probability && (
                    <div>
                      <Caption className="text-gray-500">Probabilité</Caption>
                      <BodySmall className="capitalize">{risk.probability}</BodySmall>
                    </div>
                  )}
                  {risk.impact && (
                    <div>
                      <Caption className="text-gray-500">Impact</Caption>
                      <BodySmall className="capitalize">{risk.impact}</BodySmall>
                    </div>
                  )}
                </div>
                {risk.mitigation && (
                  <div className="mt-2">
                    <Caption className="text-gray-500">Mitigation</Caption>
                    <BodySmall className="text-gray-700">{risk.mitigation}</BodySmall>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Opportunités */}
      {fip.opportunities && fip.opportunities.length > 0 && (
        <div>
          <Heading2 className="mb-3">Opportunités</Heading2>
          <div className="space-y-3">
            {fip.opportunities.map((opportunity, index) => (
              <div key={index} className="p-4 border border-green-200 rounded-md bg-green-50">
                <BodySmall className="font-medium mb-2">{opportunity.description}</BodySmall>
                {opportunity.potential && (
                  <div className="mb-2">
                    <Caption className="text-gray-500">Potentiel</Caption>
                    <BodySmall className="text-gray-700">{opportunity.potential}</BodySmall>
                  </div>
                )}
                {opportunity.actionPlan && (
                  <div>
                    <Caption className="text-gray-500">Plan d'action</Caption>
                    <BodySmall className="text-gray-700">{opportunity.actionPlan}</BodySmall>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ressources */}
      {fip.resources && fip.resources.length > 0 && (
        <div>
          <Heading2 className="mb-3">Ressources</Heading2>
          <div className="space-y-3">
            {fip.resources.map((resource, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <Caption className="font-semibold text-lg capitalize">{resource.type}</Caption>
                  {resource.cost !== undefined && (
                    <Caption className="text-gray-500">{resource.cost} €</Caption>
                  )}
                </div>
                <BodySmall className="text-gray-700 mb-1">{resource.description}</BodySmall>
                {resource.quantity && (
                  <BodySmall className="text-gray-500">Quantité: {resource.quantity}</BodySmall>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cibles de Performance */}
      {fip.performanceTargets && fip.performanceTargets.length > 0 && (
        <div>
          <Heading2 className="mb-3">Cibles de Performance</Heading2>
          <div className="space-y-3">
            {fip.performanceTargets.map((target, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <Caption className="font-semibold text-lg">{target.indicator}</Caption>
                  <Caption className="text-orange-600 font-medium">Cible: {target.target}</Caption>
                </div>
                <div className="flex gap-4">
                  {target.deadline && (
                    <div>
                      <Caption className="text-gray-500">Échéance</Caption>
                      <BodySmall>{new Date(target.deadline).toLocaleDateString('fr-FR')}</BodySmall>
                    </div>
                  )}
                  {target.responsible && (
                    <div>
                      <Caption className="text-gray-500">Responsable</Caption>
                      <BodySmall>{target.responsible}</BodySmall>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

