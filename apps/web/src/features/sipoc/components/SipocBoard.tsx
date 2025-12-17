import React, { useMemo } from 'react';
import { SipocElement, SipocConnection, ElementType } from '../types/sipoc.types';
import { useSipocStore } from '../store/sipocStore';
import { SipocElementCard } from './SipocElementCard';
import { Plus } from 'lucide-react';
import { Button } from '@repo/ui';
import { Caption } from '@repo/ui';

interface SipocBoardProps {
  sipocId: string;
  elements: SipocElement[];
  connections: SipocConnection[];
}

const COLUMN_LABELS: Record<ElementType, string> = {
  [ElementType.supplier]: 'Fournisseurs',
  [ElementType.input]: 'Entrées',
  [ElementType.process]: 'Processus',
  [ElementType.output]: 'Sorties',
  [ElementType.customer]: 'Clients',
};

interface SipocRow {
  process: SipocElement;
  suppliers: SipocElement[];
  inputs: SipocElement[];
  outputs: SipocElement[];
  customers: SipocElement[];
}

export const SipocBoard: React.FC<SipocBoardProps> = ({
  sipocId,
  elements,
  connections,
}) => {
  const { createElement } = useSipocStore();

  // Group elements by flow_id (process-based rows)
  const rows = useMemo(() => {
    const processes = elements
      .filter((el) => el.type === ElementType.process)
      .sort((a, b) => a.position - b.position);

    return processes.map((process): SipocRow => {
      // Get connected elements for this process
      const processConnections = connections.filter(
        (conn) => conn.source_element_id === process.id || conn.target_element_id === process.id
      );

      const connectedIds = new Set(
        processConnections.map((conn) =>
          conn.source_element_id === process.id ? conn.target_element_id : conn.source_element_id
        )
      );

      const connectedElements = elements.filter((el) => connectedIds.has(el.id));

      return {
        process,
        suppliers: connectedElements.filter((el) => el.type === ElementType.supplier),
        inputs: connectedElements.filter((el) => el.type === ElementType.input),
        outputs: connectedElements.filter((el) => el.type === ElementType.output),
        customers: connectedElements.filter((el) => el.type === ElementType.customer),
      };
    });
  }, [elements, connections]);

  // Get orphan elements (not connected to any process)
  const orphanElements = useMemo(() => {
    const connectedIds = new Set(
      connections.flatMap((conn) => [conn.source_element_id, conn.target_element_id])
    );

    return {
      suppliers: elements.filter(
        (el) => el.type === ElementType.supplier && !connectedIds.has(el.id)
      ),
      inputs: elements.filter(
        (el) => el.type === ElementType.input && !connectedIds.has(el.id)
      ),
      outputs: elements.filter(
        (el) => el.type === ElementType.output && !connectedIds.has(el.id)
      ),
      customers: elements.filter(
        (el) => el.type === ElementType.customer && !connectedIds.has(el.id)
      ),
    };
  }, [elements, connections]);

  const handleAddElement = async (type: ElementType) => {
    const elementsOfType = elements.filter((el) => el.type === type);
    const position = elementsOfType.length;

    await createElement({
      sipoc_id: sipocId,
      type,
      title: `Nouveau ${COLUMN_LABELS[type]}`,
      description: '',
      position,
    });
  };

  return (
    <div className="h-full bg-gray-50 overflow-auto">
      {/* Header with column labels and add buttons */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="grid grid-cols-5 gap-4 p-4">
          {[
            ElementType.supplier,
            ElementType.input,
            ElementType.process,
            ElementType.output,
            ElementType.customer,
          ].map((type) => (
            <div key={type} className="flex items-center justify-between">
              <Caption className="font-semibold text-gray-700">
                {COLUMN_LABELS[type]}
              </Caption>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAddElement(type)}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* SIPOC Rows - Each row represents a complete flow */}
      <div className="p-4 space-y-4">
        {rows.map((row) => (
          <div
            key={row.process.id}
            className="grid grid-cols-5 gap-4 bg-white rounded-lg border shadow-sm p-4 min-h-[120px]"
          >
            {/* Suppliers Column */}
            <div className="space-y-2">
              {row.suppliers.map((element) => (
                <SipocElementCard
                  key={element.id}
                  element={element}
                  sipocId={sipocId}
                />
              ))}
            </div>

            {/* Inputs Column */}
            <div className="space-y-2">
              {row.inputs.map((element) => (
                <SipocElementCard
                  key={element.id}
                  element={element}
                  sipocId={sipocId}
                />
              ))}
            </div>

            {/* Process Column - FULL HEIGHT & CENTERED */}
            <div className="flex items-center justify-center">
              <SipocElementCard
                element={row.process}
                sipocId={sipocId}
                className="w-full"
              />
            </div>

            {/* Outputs Column */}
            <div className="space-y-2">
              {row.outputs.map((element) => (
                <SipocElementCard
                  key={element.id}
                  element={element}
                  sipocId={sipocId}
                />
              ))}
            </div>

            {/* Customers Column */}
            <div className="space-y-2">
              {row.customers.map((element) => (
                <SipocElementCard
                  key={element.id}
                  element={element}
                  sipocId={sipocId}
                />
              ))}
            </div>
          </div>
        ))}

        {rows.length === 0 && (
          <div className="text-center py-12">
            <Caption className="text-gray-500">
              Aucun processus créé. Cliquez sur + dans la colonne Processus pour commencer.
            </Caption>
          </div>
        )}

        {/* Orphan Elements Section */}
        {(orphanElements.suppliers.length > 0 ||
          orphanElements.inputs.length > 0 ||
          orphanElements.outputs.length > 0 ||
          orphanElements.customers.length > 0) && (
          <div className="mt-8 pt-8 border-t">
            <Caption className="text-gray-600 font-semibold mb-4">
              Éléments non connectés
            </Caption>
            <div className="grid grid-cols-5 gap-4">
              <div className="space-y-2">
                {orphanElements.suppliers.map((element) => (
                  <SipocElementCard
                    key={element.id}
                    element={element}
                    sipocId={sipocId}
                  />
                ))}
              </div>
              <div className="space-y-2">
                {orphanElements.inputs.map((element) => (
                  <SipocElementCard
                    key={element.id}
                    element={element}
                    sipocId={sipocId}
                  />
                ))}
              </div>
              <div /> {/* Empty process column */}
              <div className="space-y-2">
                {orphanElements.outputs.map((element) => (
                  <SipocElementCard
                    key={element.id}
                    element={element}
                    sipocId={sipocId}
                  />
                ))}
              </div>
              <div className="space-y-2">
                {orphanElements.customers.map((element) => (
                  <SipocElementCard
                    key={element.id}
                    element={element}
                    sipocId={sipocId}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
