import axios from 'axios';
import { CreateConnectionDto, CreateElementDto, CreateSipocDto, ReorderElementsDto, SipocConnection, SipocDiagram, SipocElement, UpdateElementDto, UpdateSipocDto } from '../features/sipoc';
// import {
//   SipocDiagram,
//   SipocElement,
//   SipocConnection,
//   CreateSipocDto,
//   UpdateSipocDto,
//   CreateElementDto,
//   UpdateElementDto,
//   ReorderElementsDto,
//   CreateConnectionDto,
// } from '../types/sipoc.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class SipocApiClient {
  private baseUrl = `${API_BASE_URL}/sipoc`;

  // Diagram operations
  async getDiagrams(
    userId: string,
    filters?: { status?: string; processId?: string }
  ): Promise<SipocDiagram[]> {
    const params = new URLSearchParams({ userId });
    if (filters?.status) params.append('status', filters.status);
    if (filters?.processId) params.append('processId', filters.processId);

    const response = await axios.get<SipocDiagram[]>(
      `${this.baseUrl}?${params.toString()}`
    );
    return response.data;
  }

  async getDiagram(sipocId: string): Promise<SipocDiagram> {
    const response = await axios.get<SipocDiagram>(
      `${this.baseUrl}/${sipocId}`
    );
    return response.data;
  }
  async findDiagramsByProcessId(processId: string): Promise<SipocDiagram[]> {
    const response = await axios.get<SipocDiagram[]>(
      `${this.baseUrl}/process/${processId}`
    );
    return response.data;
  }

  async getDiagramByProcess(processId: string): Promise<SipocDiagram> {
    const response = await axios.get<SipocDiagram>(
      `${this.baseUrl}/process/${processId}`
    );
    return response.data;
  }

  async createDiagram(
    data: CreateSipocDto,
    userId: string
  ): Promise<SipocDiagram> {
    const response = await axios.post<SipocDiagram>(
      `${this.baseUrl}?userId=${userId}`,
      data
    );
    return response.data;
  }

  async updateDiagram(
    sipocId: string,
    data: UpdateSipocDto
  ): Promise<SipocDiagram> {
    const response = await axios.put<SipocDiagram>(
      `${this.baseUrl}/${sipocId}`,
      data
    );
    return response.data;
  }

  async deleteDiagram(sipocId: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/${sipocId}`);
  }

  // Element operations
  async getElements(sipocId: string): Promise<SipocElement[]> {
    const response = await axios.get<SipocElement[]>(
      `${this.baseUrl}/${sipocId}/elements`
    );
    return response.data;
  }

  async createElement(data: CreateElementDto): Promise<SipocElement> {
    const response = await axios.post<SipocElement>(
      `${this.baseUrl}/${data.sipoc_id}/elements`,
      data
    );
    return response.data;
  }

  async updateElement(
    sipocId: string,
    elementId: string,
    data: UpdateElementDto
  ): Promise<SipocElement> {
    const response = await axios.put<SipocElement>(
      `${this.baseUrl}/${sipocId}/elements/${elementId}`,
      data
    );
    return response.data;
  }

  async deleteElement(sipocId: string, elementId: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/${sipocId}/elements/${elementId}`);
  }

  async reorderElements(
    sipocId: string,
    data: ReorderElementsDto
  ): Promise<SipocElement[]> {
    const response = await axios.put<SipocElement[]>(
      `${this.baseUrl}/${sipocId}/elements/reorder`,
      data
    );
    return response.data;
  }

  // Connection operations
  async getConnections(sipocId: string): Promise<SipocConnection[]> {
    const response = await axios.get<SipocConnection[]>(
      `${this.baseUrl}/${sipocId}/connections`
    );
    return response.data;
  }

  async createConnection(data: CreateConnectionDto): Promise<SipocConnection> {
    const response = await axios.post<SipocConnection>(
      `${this.baseUrl}/${data.source_sipoc_id}/connections`,
      data
    );
    return response.data;
  }

  async deleteConnection(
    sipocId: string,
    connectionId: string
  ): Promise<void> {
    await axios.delete(
      `${this.baseUrl}/${sipocId}/connections/${connectionId}`
    );
  }
}

export const sipocApi = new SipocApiClient();
