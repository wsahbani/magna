import React from 'react';
import { ProcessIdentityCard } from '../types/fip.types';
import { SipocElement, SipocDiagram } from '../../sipoc/types/sipoc.types';

interface FipDocumentViewProps {
  fip: ProcessIdentityCard;
  sipocElements?: SipocElement[];
  sipocDiagram?: SipocDiagram;
  sipocLoading?: boolean;
  processId?: string;
}

export const FipDocumentView: React.FC<FipDocumentViewProps> = ({ fip, sipocElements = [], sipocDiagram, sipocLoading = false }) => {
  // Helper to get SIPOC elements by type (lowercase as per ElementType enum)
  const getSipocByType = (type: string) => sipocElements.filter((el) => el.type === type);

  const suppliers = getSipocByType('supplier');
  const inputs = getSipocByType('input');
  const outputs = getSipocByType('output');
  const customers = getSipocByType('customer');
  const processes = getSipocByType('process');

  return (
    <div className="bg-white p-8 max-w-[1400px] mx-auto">
      {/* Document Header with F.I.P styling */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          <span className="text-orange-600">F</span>iche d'<span className="text-orange-600">I</span>dentité du{' '}
          <span className="text-orange-600">P</span>rocessus
        </h1>
      </div>

      {/* Grid Container */}
      <div className="space-y-4">
        {/* Row 1: Process Name, Leaders, Date */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4 border-4 border-orange-500 p-4 bg-orange-50">
            <div className="font-bold text-sm mb-1">Nom du processus :</div>
            <div className="text-base">{sipocDiagram?.title || fip.process?.name || 'Non défini'}</div>
          </div>
          <div className="col-span-3 border-4 border-orange-500 p-4">
            <div className="font-bold text-sm mb-1">Global Process Leader :</div>
            <div className="text-base">
              {fip.stakeholders?.find((s) => s.role === 'Global Process Leader')?.name || 'Non défini'}
            </div>
          </div>
          <div className="col-span-3 border-4 border-orange-500 p-4">
            <div className="font-bold text-sm mb-1">Sponsor de processus :</div>
            <div className="text-base">
              {fip.stakeholders?.find((s) => s.role === 'Sponsor')?.name || 'Non défini'}
            </div>
          </div>
          <div className="col-span-2 border-4 border-orange-500 p-4">
            <div className="font-bold text-sm mb-1">Mise à jour le :</div>
            <div className="text-base">{new Date(fip.updatedAt).toLocaleDateString('fr-FR')}</div>
          </div>
        </div>

        {/* Row 2: Finalité & Périmètre */}
        <div className="border-4 border-orange-500 p-4 bg-orange-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="font-bold text-sm mb-2">Finalité :</div>
              <div className="text-sm">{fip.objectives || 'Non défini'}</div>
            </div>
            <div>
              <div className="font-bold text-sm mb-2">Périmètre :</div>
              <div className="text-sm">{fip.scope || 'Non défini'}</div>
            </div>
          </div>
        </div>

        {/* Row 3: Input, Attentes client, Output */}
        <div className="grid grid-cols-3 gap-4">
          <div className="border-4 border-orange-500 p-4">
            <div className="font-bold text-sm mb-2">Input processus :</div>
            <ul className="text-sm space-y-1 list-disc list-inside">
              {inputs.length > 0 ? (
                inputs.map((input) => (
                  <li key={input.id}>
                    {input.title}
                    {input.description && <span className="text-gray-600"> - {input.description}</span>}
                  </li>
                ))
              ) : (
                <li className="text-gray-400">Aucune entrée définie</li>
              )}
            </ul>
          </div>
          <div className="border-4 border-orange-500 p-4 bg-orange-50">
            <div className="font-bold text-sm mb-2">Attentes client :</div>
            <ul className="text-sm space-y-1 list-disc list-inside">
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <li key={customer.id}>
                    {customer.title}
                    {customer.description && <div className="ml-6 text-xs text-gray-600 mt-1">→ {customer.description}</div>}
                  </li>
                ))
              ) : (
                <li className="text-gray-400">Aucune attente définie</li>
              )}
            </ul>
          </div>
          <div className="border-4 border-orange-500 p-4">
            <div className="font-bold text-sm mb-2">Output processus :</div>
            <ul className="text-sm space-y-1 list-disc list-inside">
              {outputs.length > 0 ? (
                outputs.map((output) => (
                  <li key={output.id}>
                    {output.title}
                    {output.description && <span className="text-gray-600"> - {output.description}</span>}
                  </li>
                ))
              ) : (
                <li className="text-gray-400">Aucune sortie définie</li>
              )}
            </ul>
          </div>
        </div>

        {/* Row 4: Fournisseurs, Activités principales (curved), Clients */}
        <div className="grid grid-cols-12 gap-4">
          {/* Fournisseurs */}
          <div className="col-span-3 border-4 border-orange-500 p-4">
            <div className="font-bold text-sm mb-2">Fournisseurs processus:</div>
            <ul className="text-sm space-y-1 list-disc list-inside">
              {suppliers.length > 0 ? (
                suppliers.map((supplier) => (
                  <li key={supplier.id}>
                    {supplier.title}
                    {supplier.description && <div className="ml-6 text-xs text-gray-600 mt-1">{supplier.description}</div>}
                  </li>
                ))
              ) : (
                <li className="text-gray-400">Aucun fournisseur</li>
              )}
            </ul>
          </div>

          {/* Activités principales (centre avec forme courbe) */}
          <div className="col-span-6 relative">
            <div className="border-4 border-orange-500 rounded-[80px] p-6 bg-orange-50 h-full flex flex-col justify-center">
              <div className="text-center">
                <div className="font-bold text-sm mb-3 border-b-2 border-orange-600 pb-2 inline-block">
                  Activités principales du processus
                </div>
                <ul className="text-sm space-y-1 mt-3">
                  {processes.length > 0 ? (
                    processes.map((process) => (
                      <li key={process.id} className="text-left">
                        • {process.title}
                        {process.description && (
                          <div className="ml-4 text-xs text-gray-600 mt-1">→ {process.description}</div>
                        )}
                      </li>
                    ))
                  ) : fip.objectives ? (
                    <li className="text-left">• {fip.objectives}</li>
                  ) : (
                    <li className="text-gray-400 text-center">Aucune activité définie</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Clients */}
          <div className="col-span-3 border-4 border-orange-500 p-4">
            <div className="font-bold text-sm mb-2">Clients processus :</div>
            <ul className="text-sm space-y-1 list-disc list-inside">
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <li key={customer.id}>
                    {customer.title}
                    {customer.description && <div className="ml-6 text-xs text-gray-600 mt-1">{customer.description}</div>}
                  </li>
                ))
              ) : (
                <li className="text-gray-400">Aucun client</li>
              )}
            </ul>
          </div>
        </div>

        {/* Row 5: Interactions, Contraintes/Risques/Ressources, Acteurs */}
        <div className="grid grid-cols-12 gap-4">
          {/* Interactions */}
          <div className="col-span-3 border-4 border-orange-500 p-4">
            <div className="font-bold text-sm mb-2">Interactions avec autres processus :</div>
            <div className="text-sm text-gray-600">Non défini dans le modèle actuel</div>
          </div>

          {/* Centre: Contraintes, Risques, Ressources */}
          <div className="col-span-6 space-y-3">
            {/* Contraintes */}
            <div className="border-4 border-orange-500 p-3 bg-orange-50">
              <div className="font-bold text-sm mb-1">Contraintes légales, réglementaires et environnementales :</div>
              <div className="text-sm">
                {fip.risks && fip.risks.filter((r) => r.description.toLowerCase().includes('légal')).length > 0
                  ? fip.risks
                      .filter((r) => r.description.toLowerCase().includes('légal'))
                      .map((r, i) => <div key={i}>• {r.description}</div>)
                  : 'Non défini'}
              </div>
            </div>

            {/* Risques majeurs */}
            <div className="border-4 border-orange-500 p-3">
              <div className="font-bold text-sm mb-1">Risques majeurs :</div>
              <ul className="text-sm space-y-1">
                {fip.risks && fip.risks.length > 0 ? (
                  fip.risks.map((risk, i) => (
                    <li key={i}>
                      • {risk.description}
                      {(risk.probability || risk.impact) && (
                        <span className="text-xs text-gray-600 ml-2">
                          ({risk.probability && `Prob: ${risk.probability}`}
                          {risk.probability && risk.impact && ', '}
                          {risk.impact && `Impact: ${risk.impact}`})
                        </span>
                      )}
                      {risk.mitigation && (
                        <div className="ml-4 text-xs text-gray-600 mt-1">→ Mitigation: {risk.mitigation}</div>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">Aucun risque identifié</li>
                )}
              </ul>
            </div>

            {/* Ressources */}
            <div className="border-4 border-orange-500 p-3">
              <div className="font-bold text-sm mb-1">Ressources :</div>
              <ul className="text-sm space-y-1">
                {fip.resources && fip.resources.length > 0 ? (
                  fip.resources.map((resource, i) => (
                    <li key={i}>
                      • <span className="font-medium capitalize">{resource.type}</span>: {resource.description}
                      {resource.quantity && <span className="text-gray-600 ml-1">({resource.quantity})</span>}
                      {resource.cost !== undefined && <span className="text-gray-600 ml-1">- {resource.cost}€</span>}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">Aucune ressource définie</li>
                )}
              </ul>
            </div>
          </div>

          {/* Acteurs */}
          <div className="col-span-3 border-4 border-orange-500 p-4">
            <div className="font-bold text-sm mb-2">Acteurs du processus :</div>
            <ul className="text-sm space-y-2">
              {fip.stakeholders && fip.stakeholders.length > 0 ? (
                fip.stakeholders.map((stakeholder, i) => (
                  <li key={i}>
                    <div className="font-semibold">{stakeholder.name}</div>
                    <div className="text-xs text-gray-600">{stakeholder.role}</div>
                    {stakeholder.responsibility && (
                      <div className="text-xs text-gray-500 mt-1">{stakeholder.responsibility}</div>
                    )}
                  </li>
                ))
              ) : (
                <li className="text-gray-400">Aucun acteur défini</li>
              )}
            </ul>
          </div>
        </div>

        {/* Row 6: Instances de pilotage */}
        <div className="border-4 border-orange-500 p-4">
          <div className="font-bold text-sm mb-2">Instances de pilotage :</div>
          <div className="text-sm">
            {fip.stakeholders && fip.stakeholders.filter((s) => s.role.toLowerCase().includes('pilotage')).length > 0
              ? fip.stakeholders
                  .filter((s) => s.role.toLowerCase().includes('pilotage'))
                  .map((s, i) => <div key={i}>• {s.name}</div>)
              : 'Non défini'}
          </div>
        </div>

        {/* Row 7: Indicateurs */}
        <div className="grid grid-cols-2 gap-4">
          {/* Indicateurs NME */}
          <div className="border-4 border-orange-500 p-4 bg-orange-50">
            <div className="font-bold text-sm mb-2">Indicateurs NME :</div>
            <div className="text-sm">
              {fip.indicators && fip.indicators.length > 0 ? (
                <ul className="space-y-1">
                  {fip.indicators
                    .filter((ind) => ind.name.toLowerCase().includes('nme') || ind.name.toLowerCase().includes('satisfaction'))
                    .map((ind, i) => (
                      <li key={i}>
                        <span className="font-medium">{ind.name}</span>
                        {ind.targetValue && <span className="text-gray-600 ml-2">({ind.targetValue} {ind.unit})</span>}
                      </li>
                    ))}
                </ul>
              ) : (
                'Non défini'
              )}
            </div>
          </div>

          {/* Indicateurs de performance */}
          <div className="border-4 border-orange-500 p-4">
            <div className="font-bold text-sm mb-2">Indicateurs de performance de processus :</div>
            <div className="text-sm">
              {fip.indicators && fip.indicators.length > 0 ? (
                <ul className="space-y-2">
                  {fip.indicators.map((ind, i) => (
                    <li key={i} className="pb-2 border-b border-gray-200 last:border-0">
                      <div className="flex justify-between items-start">
                        <span className="font-medium">{ind.name}</span>
                        {ind.targetValue && (
                          <span className="text-orange-600 font-semibold text-xs">
                            Cible: {ind.targetValue} {ind.unit}
                          </span>
                        )}
                      </div>
                      {ind.description && (
                        <div className="text-xs text-gray-600 mt-1">{ind.description}</div>
                      )}
                      <div className="flex gap-3 mt-1 text-xs text-gray-500">
                        {ind.currentValue !== undefined && <span>Actuel: {ind.currentValue}</span>}
                        {ind.frequency && <span>Fréquence: {ind.frequency}</span>}
                        {ind.responsible && <span>Resp: {ind.responsible}</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : fip.performanceTargets && fip.performanceTargets.length > 0 ? (
                <ul className="space-y-1">
                  {fip.performanceTargets.map((target, i) => (
                    <li key={i}>
                      • <span className="font-medium">{target.indicator}</span>
                      {target.target && <span className="text-orange-600 ml-2">({target.target})</span>}
                      {target.deadline && (
                        <span className="text-xs text-gray-600 ml-2">
                          - {new Date(target.deadline).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                'Non défini'
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
