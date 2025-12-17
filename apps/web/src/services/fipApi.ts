
import {
  ProcessIdentityCard,
  CreateFipDto,
  UpdateFipDto,
} from '../features/fip/types/fip.types';
import apiClient from '../lib/base-api';

export const fipApi = {
  /**
   * Get FIP by ID
   */
  async getFipById(fipId: string): Promise<ProcessIdentityCard> {
    const response = await apiClient.get(`/fip/${fipId}`);
    return response.data;
  },

  /**
   * Get FIP by Process ID
   */
  async getFipByProcessId(processId: string): Promise<ProcessIdentityCard | null> {
    const response = await apiClient.get(`/fip/process/${processId}`);
    return response.data || null;
  },

  /**
   * Create a new FIP
   */
  async createFip(data: CreateFipDto): Promise<ProcessIdentityCard> {
    const response = await apiClient.post('/fip', data);
    return response.data;
  },

  /**
   * Update an existing FIP
   */
  async updateFip(fipId: string, data: UpdateFipDto): Promise<ProcessIdentityCard> {
    const response = await apiClient.put(`/fip/${fipId}`, data);
    return response.data;
  },

  /**
   * Delete a FIP
   */
  async deleteFip(fipId: string): Promise<void> {
    await apiClient.delete(`/fip/${fipId}`);
  },
};

