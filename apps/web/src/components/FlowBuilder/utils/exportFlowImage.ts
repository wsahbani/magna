/**
 * Export Flow Image Utility
 * Functions to export ReactFlow diagrams to image formats (PNG/SVG)
 */

import html2canvas from 'html2canvas';
import { toast } from 'sonner';

export type ExportFormat = 'png' | 'svg';

export interface ExportOptions {
  filename?: string;
  backgroundColor?: string;
  pixelRatio?: number;
}

/**
 * Export ReactFlow diagram to image
 * 
 * @param reactFlowElement - ReactFlow container element (ref.current)
 * @param format - Export format ('png' | 'svg')
 * @param options - Export options (filename, backgroundColor, pixelRatio)
 */
export async function exportFlowToImage(
  reactFlowElement: HTMLElement | null,
  format: ExportFormat,
  options: ExportOptions = {}
): Promise<void> {
  if (!reactFlowElement) {
    toast.error('Impossible d\'exporter : le diagramme n\'est pas encore chargé');
    return;
  }

  try {
    const {
      filename,
      backgroundColor = '#ffffff',
      pixelRatio = 2, // Higher quality for high-DPI screens
    } = options;

    // Find the ReactFlow viewport that contains only nodes and edges
    // This excludes Controls, MiniMap, Panel (Toolbar), etc.
    let viewportElement: HTMLElement | null = null;
    
    // Try to find .react-flow__viewport first (contains nodes and edges)
    viewportElement = reactFlowElement.querySelector('.react-flow__viewport') as HTMLElement;
    
    // If not found, try .react-flow__renderer (SVG/canvas renderer)
    if (!viewportElement) {
      viewportElement = reactFlowElement.querySelector('.react-flow__renderer') as HTMLElement;
    }
    
    // If still not found, use the ReactFlow container but exclude UI elements
    const targetElement = viewportElement || reactFlowElement;

    // Generate default filename if not provided
    const defaultFilename = filename || `flow-diagram-${Date.now()}`;
    const extension = format === 'png' ? 'png' : 'svg';
    const fullFilename = `${defaultFilename}.${extension}`;

    let dataUrl: string;

    // Options for html2canvas to exclude UI elements if using the full container
    const html2canvasOptions = {
      backgroundColor,
      scale: pixelRatio,
      useCORS: true,
      logging: false,
      width: targetElement.scrollWidth,
      height: targetElement.scrollHeight,
      // Exclude UI elements if we're using the full container
      ...(viewportElement ? {} : {
        ignoreElements: (element: Element) => {
          const classList = element.classList;
          return (
            classList.contains('react-flow__controls') ||
            classList.contains('react-flow__minimap') ||
            classList.contains('react-flow__panel') ||
            classList.contains('react-flow__attribution')
          );
        },
      }),
    };

    if (format === 'png') {
      // Export to PNG using html2canvas
      const canvas = await html2canvas(targetElement, html2canvasOptions);
      dataUrl = canvas.toDataURL('image/png');
    } else {
      // Export to SVG
      // For SVG, we'll convert the PNG to SVG or use a different approach
      // For now, we'll use html2canvas and then convert to SVG format
      const canvas = await html2canvas(targetElement, html2canvasOptions);
      
      // Convert canvas to SVG
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', canvas.width.toString());
      svg.setAttribute('height', canvas.height.toString());
      
      const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', canvas.toDataURL('image/png'));
      image.setAttribute('width', canvas.width.toString());
      image.setAttribute('height', canvas.height.toString());
      
      svg.appendChild(image);
      
      const svgBlob = new Blob([new XMLSerializer().serializeToString(svg)], {
        type: 'image/svg+xml;charset=utf-8',
      });
      dataUrl = URL.createObjectURL(svgBlob);
    }

    // Create download link
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fullFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up object URL if it was created for SVG
    if (format === 'svg' && dataUrl.startsWith('blob:')) {
      URL.revokeObjectURL(dataUrl);
    }

    // Show success message
    toast.success(`Diagramme exporté en ${format.toUpperCase()} : ${fullFilename}`);
  } catch (error) {
    console.error('Export error:', error);
    toast.error(`Erreur lors de l'export : ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

