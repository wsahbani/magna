/**
 * Excel Parser for SIPOC Import
 * Handles parsing and validation of Excel files
 */

import * as XLSX from 'xlsx';
import { ElementType } from '../types/sipoc.types';

export interface ParsedSipocRow {
  flowId: string;
  suppliers: string[];
  inputs: string[];
  processes: string[];
  outputs: string[];
  customers: string[];
  rowIndex: number;
}

export interface ParsedSipocData {
  rows: ParsedSipocRow[];
  errors: string[];
  warnings: string[];
}

interface ExcelRow {
  Fournisseurs?: string;
  Fournisseur?: string;
  Suppliers?: string;
  Entrées?: string;
  Entrees?: string;
  Entrée?: string;
  Entree?: string;
  Inputs?: string;
  Processus?: string;
  Process?: string;
  Sorties?: string;
  Sortie?: string;
  Outputs?: string;
  Clients?: string;
  Client?: string;
  Customers?: string;
  [key: string]: string | undefined;
}

/**
 * Parse Excel file and extract SIPOC data
 */
export const parseExcelFile = async (file: File): Promise<ParsedSipocData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject(new Error('Impossible de lire le fichier'));
          return;
        }

        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert to JSON
        const jsonData: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet, {
          defval: '',
          blankrows: false,
        });

        const result = parseSipocData(jsonData);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Erreur lors de la lecture du fichier'));
    };

    reader.readAsBinaryString(file);
  });
};

/**
 * Parse and validate SIPOC data from Excel rows
 * Logic: Process column is the pivot - accumulate SIPOC elements until a new process is found
 */
const parseSipocData = (jsonData: ExcelRow[]): ParsedSipocData => {
  const rows: ParsedSipocRow[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  if (jsonData.length === 0) {
    errors.push('Le fichier Excel est vide');
    return { rows, errors, warnings };
  }

  // Detect column names
  const columnMapping = detectColumns(jsonData[0]);
  
  if (!columnMapping) {
    errors.push(
      'Format de colonnes non reconnu. Colonnes attendues : Fournisseurs, Entrées, Processus, Sorties, Clients'
    );
    return { rows, errors, warnings };
  }

  let currentFlow: ParsedSipocRow | null = null;
  let firstProcessFound = false;

  // Parse each row - process is the pivot
  jsonData.forEach((row, index) => {
    const suppliers = parseCell(row[columnMapping.suppliers]);
    const inputs = parseCell(row[columnMapping.inputs]);
    const processes = parseCell(row[columnMapping.processes]);
    const outputs = parseCell(row[columnMapping.outputs]);
    const customers = parseCell(row[columnMapping.customers]);

    // Skip completely empty rows
    const hasAnyData =
      suppliers.length > 0 ||
      inputs.length > 0 ||
      processes.length > 0 ||
      outputs.length > 0 ||
      customers.length > 0;

    if (!hasAnyData) {
      return;
    }

    // Check if this row has a process (starts new flow)
    if (processes.length > 0) {
      // If we have a previous flow, save it
      if (currentFlow) {
        rows.push(currentFlow);
      }

      // Start a new flow with this process
      currentFlow = {
        flowId: crypto.randomUUID(),
        suppliers: [...suppliers],
        inputs: [...inputs],
        processes: [...processes],
        outputs: [...outputs],
        customers: [...customers],
        rowIndex: index + 2, // +2 for 1-based index and header row
      };

      firstProcessFound = true;
    } else {
      // No process in this row - accumulate to current flow
      if (!currentFlow) {
        if (!firstProcessFound) {
          warnings.push(
            `Ligne ${index + 2}: Éléments SIPOC trouvés avant le premier processus - ignorés`
          );
        }
        return;
      }

      // Accumulate elements to the current flow
      currentFlow.suppliers.push(...suppliers);
      currentFlow.inputs.push(...inputs);
      currentFlow.outputs.push(...outputs);
      currentFlow.customers.push(...customers);

      // Note: We don't accumulate processes as we're in continuation of the same flow
    }
  });

  // Don't forget to add the last flow
  if (currentFlow) {
    rows.push(currentFlow);
  }

  if (rows.length === 0) {
    errors.push('Aucun processus trouvé dans le fichier. La colonne Processus est requise.');
  }

  // Add informational warnings
  rows.forEach((row, index) => {
    if (row.processes.length === 0) {
      warnings.push(`Flow ${index + 1}: Aucun processus défini`);
    }
    if (row.processes.length > 1) {
      warnings.push(
        `Flow ${index + 1}: ${row.processes.length} processus trouvés - seul le premier sera utilisé comme pivot`
      );
    }
  });

  return { rows, errors, warnings };
};

/**
 * Detect column names with support for French and English
 */
const detectColumns = (
  firstRow: ExcelRow
): {
  suppliers: string;
  inputs: string;
  processes: string;
  outputs: string;
  customers: string;
} | null => {
  const keys = Object.keys(firstRow);

  const findColumn = (patterns: string[]): string | null => {
    for (const pattern of patterns) {
      const found = keys.find(
        (key) => key.toLowerCase().trim() === pattern.toLowerCase()
      );
      if (found) return found;
    }
    return null;
  };

  const suppliers =
    findColumn(['Fournisseurs', 'Fournisseur', 'Suppliers', 'Supplier']) ||
    keys[0];
  const inputs =
    findColumn(['Entrées', 'Entrees', 'Entrée', 'Entree', 'Inputs', 'Input']) ||
    keys[1];
  const processes =
    findColumn(['Processus', 'Process', 'Processes']) || keys[2];
  const outputs =
    findColumn(['Sorties', 'Sortie', 'Outputs', 'Output']) || keys[3];
  const customers =
    findColumn(['Clients', 'Client', 'Customers', 'Customer']) || keys[4];

  // Validate we have at least 5 columns
  if (!suppliers || !inputs || !processes || !outputs || !customers) {
    return null;
  }

  return { suppliers, inputs, processes, outputs, customers };
};

/**
 * Parse cell content - split by line breaks or semicolons
 */
const parseCell = (cellValue: string | undefined): string[] => {
  if (!cellValue || cellValue.trim() === '') {
    return [];
  }

  // Split by line breaks or semicolons
  const items = cellValue
    .split(/[\n;]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  return items;
};

/**
 * SIPOC Element for import
 */
export interface SipocElementImport {
  type: ElementType;
  title: string;
  description: string;
  flowId: string;
  position: number;
  globalOrder: number;
}

/**
 * Convert parsed data to SIPOC elements structure
 * Each flow has ONE main process (first one if multiple) with connected elements
 */
export const convertToSipocElements = (
  parsedData: ParsedSipocRow[]
): SipocElementImport[] => {
  const elements: SipocElementImport[] = [];

  parsedData.forEach((row, globalOrder) => {
    // Add main process (only the first one as pivot)
    if (row.processes.length > 0) {
      elements.push({
        type: ElementType.process,
        title: row.processes[0], // Use only the first process as main pivot
        description: '',
        flowId: row.flowId,
        position: 0,
        globalOrder,
      });
    }

    // Add suppliers
    row.suppliers.forEach((supplier, index) => {
      elements.push({
        type: ElementType.supplier,
        title: supplier,
        description: '',
        flowId: row.flowId,
        position: index,
        globalOrder,
      });
    });

    // Add inputs
    row.inputs.forEach((input, index) => {
      elements.push({
        type: ElementType.input,
        title: input,
        description: '',
        flowId: row.flowId,
        position: index,
        globalOrder,
      });
    });

    // Add outputs
    row.outputs.forEach((output, index) => {
      elements.push({
        type: ElementType.output,
        title: output,
        description: '',
        flowId: row.flowId,
        position: index,
        globalOrder,
      });
    });

    // Add customers
    row.customers.forEach((customer, index) => {
      elements.push({
        type: ElementType.customer,
        title: customer,
        description: '',
        flowId: row.flowId,
        position: index,
        globalOrder,
      });
    });
  });

  return elements;
};

/**
 * Validate file type
 */
export const isValidExcelFile = (file: File): boolean => {
  const validTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.oasis.opendocument.spreadsheet',
  ];

  const validExtensions = ['.xls', '.xlsx', '.ods'];

  return (
    validTypes.includes(file.type) ||
    validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
  );
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
