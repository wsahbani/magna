import jsPDF from 'jspdf';
import { SipocDiagram, SipocElement, ElementType } from '../types/sipoc.types';
import { groupElementsByType } from './sipoc-helpers';

interface ExportPdfOptions {
  diagram: SipocDiagram;
  elements: SipocElement[];
  filename?: string;
}

interface FlowRow {
  flowId: string;
  elements: SipocElement[];
  position: number;
}

/**
 * Groups elements by flow_id and sorts them by globalOrder
 */
function groupElementsByFlow(elements: SipocElement[]): FlowRow[] {
  const flowMap = new Map<string, SipocElement[]>();
  
  elements.forEach((element) => {
    const flowId = element.flow_id || 'default';
    if (!flowMap.has(flowId)) {
      flowMap.set(flowId, []);
    }
    flowMap.get(flowId)!.push(element);
  });

  const flows = Array.from(flowMap.entries()).map(([flowId, flowElements]) => {
    const minGlobalOrder = Math.min(...flowElements.map(el => el.globalOrder || 0));
    return {
      flowId,
      elements: flowElements,
      position: minGlobalOrder,
    };
  });

  return flows.sort((a, b) => a.position - b.position);
}

/**
 * Gets the label for an element type in French
 */
function getElementTypeLabel(type: ElementType): string {
  const labels: Record<ElementType, string> = {
    [ElementType.supplier]: 'Fournisseur',
    [ElementType.input]: 'Entrée',
    [ElementType.process]: 'Processus',
    [ElementType.output]: 'Sortie',
    [ElementType.customer]: 'Client',
  };
  return labels[type];
}

/**
 * Formats element content for PDF cell
 */
function formatElementContent(element: SipocElement): string {
  let content = element.title;
  if (element.description) {
    content += `\n${element.description}`;
  }
  if (element.responsibleRole) {
    content += `\nResponsable: ${element.responsibleRole}`;
  }
  if (element.qualityCriteria) {
    content += `\nCritères: ${element.qualityCriteria}`;
  }
  return content;
}

/**
 * Converts SVG to base64 image data URL
 */
function svgToBase64(svgString: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        URL.revokeObjectURL(url);
        resolve(dataUrl);
      } else {
        URL.revokeObjectURL(url);
        reject(new Error('Could not get canvas context'));
      }
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG'));
    };
    
    img.src = url;
  });
}

/**
 * Gets the Orange logo SVG as base64
 */
async function getOrangeLogoBase64(): Promise<string> {
  const logoSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="Layer_1" x="0px" y="0px" width="283.5px" height="283.5px" viewBox="0 0 283.5 283.5" enable-background="new 0 0 283.5 283.5">
      <g>
        <rect x="0" y="0" fill="#FF7900" width="283.5" height="283.5" />
        <g>
          <path fill="#FFFFFF" d="M111.2,256c-4,2.6-8.4,3.9-13,3.9c-7.4,0-11.7-4.9-11.7-11.5c0-8.8,8.1-13.5,24.8-15.4v-2.2    c0-2.9-2.2-4.5-6.2-4.5c-4,0-7.3,1.6-9.6,4.5l-7-4c3.7-5.1,9.3-7.7,16.8-7.7c10.3,0,16.1,4.5,16.1,11.7c0,0,0,28.5,0,28.6h-9.2    L111.2,256z M96.6,247.7c0,2.6,1.7,5.1,4.7,5.1c3.3,0,6.4-1.4,9.6-4.2v-9.3C101.2,240.6,96.6,243,96.6,247.7z" />
          <path fill="#FFFFFF" d="M129.5,221.1l8.6-1.2l0.9,4.7c4.9-3.5,8.7-5.4,13.6-5.4c8.1,0,12.3,4.3,12.3,12.8v27.5h-10.4v-25.7    c0-4.8-1.3-7-5-7c-3.1,0-6.2,1.4-9.7,4.4v28.3h-10.3V221.1z" />
          <path fill="#FFFFFF" d="M233.7,260.2c-11.6,0-18.6-7.5-18.6-20.5c0-13.1,7-20.6,18.4-20.6c11.4,0,18.2,7.2,18.2,20.1    c0,0.7-0.1,1.4-0.1,2h-26.3c0.1,7.5,3.2,11.2,9.3,11.2c3.9,0,6.5-1.6,8.9-5.1l7.6,4.2C247.8,257.2,241.8,260.2,233.7,260.2z     M241.5,234.5c0-5.3-3-8.4-7.9-8.4c-4.7,0-7.6,3-8,8.4H241.5z" />
          <path fill="#FFFFFF" d="M34.9,260.6c-10.3,0-19.5-6.5-19.5-20.8c0-14.3,9.3-20.8,19.5-20.8c10.3,0,19.5,6.5,19.5,20.8    C54.4,254.1,45.2,260.6,34.9,260.6z M34.9,227.7c-7.7,0-9.2,7-9.2,12c0,5.1,1.4,12,9.2,12c7.8,0,9.2-7,9.2-12    C44.1,234.7,42.6,227.7,34.9,227.7z" />
          <path fill="#FFFFFF" d="M61.5,220h9.9v4.6c1.9-2.5,6.5-5.5,10.9-5.5c0.4,0,0.9,0,1.3,0.1v9.7c-0.2,0-0.3,0-0.5,0    c-4.5,0-9.5,0.7-11,4.2v26.2H61.5V220z" />
          <path fill="#FFFFFF" d="M190.3,251c7.9-0.1,8.5-8.1,8.5-13.3c0-6.2-3-11.2-8.6-11.2c-3.7,0-7.9,2.7-7.9,11.6    C182.4,243,182.7,251,190.3,251z M208.9,219.9v37.4c0,6.6-0.5,17.4-19.3,17.6c-7.8,0-14.9-3.1-16.4-9.8l10.2-1.6    c0.4,1.9,1.6,3.9,7.4,3.9c5.4,0,8-2.6,8-8.7v-4.6l-0.1-0.1c-1.6,2.9-4.2,5.7-10.2,5.7c-9.2,0-16.4-6.4-16.4-19.7    c0-13.2,7.5-20.6,15.9-20.6c7.9,0,10.8,3.6,11.5,5.5l-0.1,0l0.9-4.7H208.9z" />
          <path fill="#FFFFFF" d="M255.7,206.8h-4.1v11.3h-2.2v-11.3h-4.1v-1.7h10.3V206.8z M272.7,218.1h-2.2v-10.9h-0.1l-4.3,10.9h-1.4    l-4.3-10.9h-0.1v10.9h-2.2v-13h3.3l3.9,9.9l3.8-9.9h3.3V218.1z" />
        </g>
      </g>
    </svg>
  `;
  return svgToBase64(logoSvg);
}

/**
 * Exports SIPOC diagram to PDF format
 * Creates a custom table representation of the SIPOC diagram
 */
export async function exportSipocToPdf({
  diagram,
  elements,
  filename,
}: ExportPdfOptions): Promise<void> {
  try {
    // Group elements by flow_id
    const flowRows = groupElementsByFlow(elements);

    // Load logo once for all pages
    let logoBase64: string | null = null;
    try {
      logoBase64 = await getOrangeLogoBase64();
    } catch (error) {
      console.warn('Could not load logo:', error);
      // Continue without logo if it fails
    }

    // Create PDF document
    const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape orientation for better table fit
    const pageWidth = 297; // A4 landscape width in mm
    const pageHeight = 210; // A4 landscape height in mm
    const margin = 10;
    const tableStartY = 50;
    let currentY = tableStartY;

    // Add Orange logo on first page
    if (logoBase64) {
      const logoSize = 15; // Logo size in mm
      const logoX = pageWidth - margin - logoSize;
      const logoY = margin;
      pdf.addImage(logoBase64, 'PNG', logoX, logoY, logoSize, logoSize);
    }

    // Add header with diagram information
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text(diagram.title, margin, 15);

    if (diagram.description) {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const descriptionLines = pdf.splitTextToSize(diagram.description, pageWidth - 2 * margin);
      pdf.text(descriptionLines, margin, 22);
      currentY = 22 + descriptionLines.length * 5;
    }

    // Add metadata
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    const metadata: string[] = [];
    if (diagram.process_owner) {
      metadata.push(`Propriétaire: ${diagram.process_owner}`);
    }
    if (diagram.department) {
      metadata.push(`Département: ${diagram.department}`);
    }
    metadata.push(`Version: ${diagram.version}`);
    metadata.push(
      `Date: ${new Date(diagram.updatedAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}`
    );

    currentY += 5;
    pdf.text(metadata.join(' | '), margin, currentY);

    // Add horizontal line separator
    currentY += 5;
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 8;

    // Column configuration
    const columnOrder: ElementType[] = [
      ElementType.supplier,
      ElementType.input,
      ElementType.process,
      ElementType.output,
      ElementType.customer,
    ];

    const columnWidth = (pageWidth - 2 * margin) / columnOrder.length;
    const rowHeight = 20; // Base row height
    const headerHeight = 10;

    // Draw table header
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setFillColor(249, 250, 251); // gray-50
    pdf.rect(margin, currentY, pageWidth - 2 * margin, headerHeight, 'F');
    
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.5);
    
    // Draw header cells
    columnOrder.forEach((type, index) => {
      const x = margin + index * columnWidth;
      const label = getElementTypeLabel(type);
      
      // Highlight Process column
      if (type === ElementType.process) {
        pdf.setFillColor(255, 237, 213); // orange-100
        pdf.rect(x, currentY, columnWidth, headerHeight, 'F');
        pdf.setTextColor(194, 65, 12); // orange-700
      } else {
        pdf.setTextColor(17, 24, 39); // gray-900
      }
      
      pdf.text(label, x + columnWidth / 2, currentY + headerHeight / 2 + 2, {
        align: 'center',
      });
      
      // Draw vertical lines
      if (index > 0) {
        pdf.line(x, currentY, x, currentY + headerHeight);
      }
    });

    // Draw header border
    pdf.rect(margin, currentY, pageWidth - 2 * margin, headerHeight);
    currentY += headerHeight;

    // Draw table rows
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(17, 24, 39);

    for (const flowRow of flowRows) {
      // Check if we need a new page
      if (currentY + rowHeight > pageHeight - 20) {
        pdf.addPage();
        currentY = margin;
        
        // Redraw header on new page
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setFillColor(249, 250, 251);
        pdf.rect(margin, currentY, pageWidth - 2 * margin, headerHeight, 'F');
        
        columnOrder.forEach((type, index) => {
          const x = margin + index * columnWidth;
          const label = getElementTypeLabel(type);
          
          if (type === ElementType.process) {
            pdf.setFillColor(255, 237, 213);
            pdf.rect(x, currentY, columnWidth, headerHeight, 'F');
            pdf.setTextColor(194, 65, 12);
          } else {
            pdf.setTextColor(17, 24, 39);
          }
          
          pdf.text(label, x + columnWidth / 2, currentY + headerHeight / 2 + 2, {
            align: 'center',
          });
          
          if (index > 0) {
            pdf.line(x, currentY, x, currentY + headerHeight);
          }
        });
        
        pdf.rect(margin, currentY, pageWidth - 2 * margin, headerHeight);
        currentY += headerHeight;
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(17, 24, 39);
      }

      // Group elements by type for this flow
      const groupedElements = groupElementsByType(flowRow.elements);
      
      // Calculate max height needed for this row
      let maxCellHeight = rowHeight;
      columnOrder.forEach((type) => {
        const typeElements = groupedElements[type] || [];
        if (typeElements.length > 0) {
          const cellContent = typeElements
            .map(el => formatElementContent(el))
            .join('\n\n');
          const lines = pdf.splitTextToSize(cellContent, columnWidth - 4);
          const cellHeight = Math.max(rowHeight, lines.length * 3.5 + 4);
          maxCellHeight = Math.max(maxCellHeight, cellHeight);
        }
      });

      // Draw row cells
      columnOrder.forEach((type, index) => {
        const x = margin + index * columnWidth;
        const typeElements = groupedElements[type] || [];
        
        // Set background color for Process column
        if (type === ElementType.process) {
          pdf.setFillColor(255, 247, 237); // orange-50
          pdf.rect(x, currentY, columnWidth, maxCellHeight, 'F');
        } else {
          pdf.setFillColor(255, 255, 255);
          pdf.rect(x, currentY, columnWidth, maxCellHeight, 'F');
        }
        
        // Draw cell content
        if (typeElements.length > 0) {
          const cellContent = typeElements
            .map(el => formatElementContent(el))
            .join('\n\n');
          const lines = pdf.splitTextToSize(cellContent, columnWidth - 4);
          
          pdf.text(lines, x + 2, currentY + 4);
        }
        
        // Draw vertical lines
        if (index > 0) {
          pdf.line(x, currentY, x, currentY + maxCellHeight);
        }
      });

      // Draw row border
      pdf.rect(margin, currentY, pageWidth - 2 * margin, maxCellHeight);
      currentY += maxCellHeight;
    }

    // Add logo and footer on each page
    const totalPages = pdf.getNumberOfPages();
    const logoSize = 12; // Logo size in mm for subsequent pages
    const logoX = pageWidth - margin - logoSize;
    const logoY = margin;
    
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      
      // Add logo on each page (if loaded)
      if (logoBase64) {
        pdf.addImage(logoBase64, 'PNG', logoX, logoY, logoSize, logoSize);
      }
      
      // Add footer
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(
        `Page ${i} sur ${totalPages}`,
        pageWidth / 2,
        pageHeight - 5,
        { align: 'center' }
      );
      pdf.text(
        `Exporté le ${new Date().toLocaleDateString('fr-FR')}`,
        pageWidth / 2,
        pageHeight - 2,
        { align: 'center' }
      );
    }

    // Generate filename
    const pdfFilename = filename || `SIPOC_${diagram.title.replace(/[^a-z0-9]/gi, '_')}_v${diagram.version}.pdf`;

    // Save the PDF
    pdf.save(pdfFilename);
  } catch (error) {
    console.error('Erreur lors de l\'export PDF:', error);
    throw new Error('Échec de l\'export PDF. Veuillez réessayer.');
  }
}

