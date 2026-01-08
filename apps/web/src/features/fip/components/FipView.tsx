import React, { useMemo } from 'react';
import { Heading2, Heading3, BodySmall, Caption, Card, CardHeader, CardContent, Badge } from '@repo/ui';
import { ProcessIdentityCard } from '../types/fip.types';
import { FipAccordionSection } from './FipAccordionSection';
import { Target, MapPin, BarChart3, Users, AlertTriangle, Lightbulb, Briefcase, TrendingUp, Info } from 'lucide-react';
import { calculateFipSectionCompletions } from '../utils/fipHelpers';
import { SipocElement, ElementType } from '../../sipoc/types/sipoc.types';

interface FipViewProps {
  fip: ProcessIdentityCard;
  sipocElements?: SipocElement[];
  sipocLoading?: boolean;
  processId?: string;
}

export const FipView: React.FC<FipViewProps> = ({ fip, sipocElements = [], sipocLoading = false, processId }) => {
  // Calculer les pourcentages de complétude pour l'affichage
  const completions = useMemo(() => {
    const formData = {
      objectives: fip.objectives || '',
      scope: fip.scope || '',
      indicators: fip.indicators || [],
      stakeholders: fip.stakeholders || [],
      risks: fip.risks || [],
      opportunities: fip.opportunities || [],
      resources: fip.resources || [],
      performanceTargets: fip.performanceTargets || [],
    };
    return calculateFipSectionCompletions(formData);
  }, [fip]);

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-200">
      <div className="space-y-6 p-8">
      {/* SIPOC Data Section - Read Only */}
      {sipocElements && sipocElements.length > 0 && (
        <Card className="border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50/30 to-transparent shadow-md">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <Heading3 className="text-lg font-bold text-gray-900">Données SIPOC</Heading3>
                <Caption className="text-gray-600">Éléments du diagramme SIPOC</Caption>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">{sipocLoading ? (
              <div className="py-8 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600 mb-2"></div>
                <BodySmall className="text-gray-600">Chargement...</BodySmall>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Suppliers */}
                {sipocElements.filter(el => el.type === ElementType.supplier).length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-purple-100 text-purple-700 border-purple-200">Fournisseurs</Badge>
                      <Caption className="text-gray-600">{sipocElements.filter(el => el.type === ElementType.supplier).length}</Caption>
                    </div>
                    <div className="space-y-2">
                      {sipocElements.filter(el => el.type === ElementType.supplier).map(element => (
                        <div key={element.id} className="bg-white border border-gray-200 rounded-md p-3">
                          <BodySmall className="font-semibold text-gray-900">{element.title}</BodySmall>
                          {element.description && <Caption className="text-gray-600 mt-1">{element.description}</Caption>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Inputs */}
                {sipocElements.filter(el => el.type === ElementType.input).length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">Entrées</Badge>
                      <Caption className="text-gray-600">{sipocElements.filter(el => el.type === ElementType.input).length}</Caption>
                    </div>
                    <div className="space-y-2">
                      {sipocElements.filter(el => el.type === ElementType.input).map(element => (
                        <div key={element.id} className="bg-white border border-gray-200 rounded-md p-3">
                          <BodySmall className="font-semibold text-gray-900">{element.title}</BodySmall>
                          {element.description && <Caption className="text-gray-600 mt-1">{element.description}</Caption>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Outputs */}
                {sipocElements.filter(el => el.type === ElementType.output).length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-green-100 text-green-700 border-green-200">Sorties</Badge>
                      <Caption className="text-gray-600">{sipocElements.filter(el => el.type === ElementType.output).length}</Caption>
                    </div>
                    <div className="space-y-2">
                      {sipocElements.filter(el => el.type === ElementType.output).map(element => (
                        <div key={element.id} className="bg-white border border-gray-200 rounded-md p-3">
                          <BodySmall className="font-semibold text-gray-900">{element.title}</BodySmall>
                          {element.description && <Caption className="text-gray-600 mt-1">{element.description}</Caption>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Customers */}
                {sipocElements.filter(el => el.type === ElementType.customer).length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-pink-100 text-pink-700 border-pink-200">Clients</Badge>
                      <Caption className="text-gray-600">{sipocElements.filter(el => el.type === ElementType.customer).length}</Caption>
                    </div>
                    <div className="space-y-2">
                      {sipocElements.filter(el => el.type === ElementType.customer).map(element => (
                        <div key={element.id} className="bg-white border border-gray-200 rounded-md p-3">
                          <BodySmall className="font-semibold text-gray-900">{element.title}</BodySmall>
                          {element.description && <Caption className="text-gray-600 mt-1">{element.description}</Caption>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Objectifs */}
      <FipAccordionSection
        id="objectives-view"
        title="Objectifs"
        icon={<Target className="w-5 h-5" />}
        completionPercentage={completions.objectives}
        defaultExpanded={true}
      >
        {fip.objectives ? (
          <BodySmall className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {fip.objectives}
          </BodySmall>
        ) : (
          <BodySmall className="text-gray-500 italic">
            Aucun objectif défini
          </BodySmall>
        )}
      </FipAccordionSection>

      {/* Périmètre */}
      <FipAccordionSection
        id="scope-view"
        title="Périmètre"
        icon={<MapPin className="w-5 h-5" />}
        completionPercentage={completions.scope}
      >
        {fip.scope ? (
          <BodySmall className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {fip.scope}
          </BodySmall>
        ) : (
          <BodySmall className="text-gray-500 italic">
            Aucun périmètre défini
          </BodySmall>
        )}
      </FipAccordionSection>

      {/* Indicateurs */}
      <FipAccordionSection
        id="indicators-view"
        title="Indicateurs de Performance"
        icon={<BarChart3 className="w-5 h-5" />}
        count={fip.indicators?.length}
        completionPercentage={completions.indicators}
      >
        {fip.indicators && fip.indicators.length > 0 ? (
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
        ) : (
          <BodySmall className="text-gray-500 italic">
            Aucun indicateur défini
          </BodySmall>
        )}
      </FipAccordionSection>

      {/* Acteurs */}
      <FipAccordionSection
        id="stakeholders-view"
        title="Acteurs et Responsabilités"
        icon={<Users className="w-5 h-5" />}
        count={fip.stakeholders?.length}
        completionPercentage={completions.stakeholders}
      >
        {fip.stakeholders && fip.stakeholders.length > 0 ? (
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
        ) : (
          <BodySmall className="text-gray-500 italic">
            Aucun acteur défini
          </BodySmall>
        )}
      </FipAccordionSection>

      {/* Risques */}
      <FipAccordionSection
        id="risks-view"
        title="Risques"
        icon={<AlertTriangle className="w-5 h-5" />}
        count={fip.risks?.length}
        completionPercentage={completions.risks}
      >
        {fip.risks && fip.risks.length > 0 ? (
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
        ) : (
          <BodySmall className="text-gray-500 italic">
            Aucun risque identifié
          </BodySmall>
        )}
      </FipAccordionSection>

      {/* Opportunités */}
      <FipAccordionSection
        id="opportunities-view"
        title="Opportunités"
        icon={<Lightbulb className="w-5 h-5" />}
        count={fip.opportunities?.length}
        completionPercentage={completions.opportunities}
      >
        {fip.opportunities && fip.opportunities.length > 0 ? (
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
        ) : (
          <BodySmall className="text-gray-500 italic">
            Aucune opportunité identifiée
          </BodySmall>
        )}
      </FipAccordionSection>

      {/* Ressources */}
      <FipAccordionSection
        id="resources-view"
        title="Ressources"
        icon={<Briefcase className="w-5 h-5" />}
        count={fip.resources?.length}
        completionPercentage={completions.resources}
      >
        {fip.resources && fip.resources.length > 0 ? (
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
        ) : (
          <BodySmall className="text-gray-500 italic">
            Aucune ressource définie
          </BodySmall>
        )}
      </FipAccordionSection>

      {/* Cibles de Performance */}
      <FipAccordionSection
        id="performance-targets-view"
        title="Cibles de Performance"
        icon={<TrendingUp className="w-5 h-5" />}
        count={fip.performanceTargets?.length}
        completionPercentage={completions.performanceTargets}
      >
        {fip.performanceTargets && fip.performanceTargets.length > 0 ? (
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
        ) : (
          <BodySmall className="text-gray-500 italic">
            Aucune cible de performance définie
          </BodySmall>
        )}
      </FipAccordionSection>
      </div>
    </div>
  );
};

