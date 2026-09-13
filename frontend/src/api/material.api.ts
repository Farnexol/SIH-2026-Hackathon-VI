import { apiClient } from './client';

export const materialApi = {
  getMaterials: async (): Promise<any[]> => {
    const response = await apiClient.get('/materials');
    return response.data;
  },

  getMaterialById: async (materialId: string): Promise<any> => {
    const response = await apiClient.get(`/materials/${materialId}`);
    return response.data;
  },

  uploadMaterial: async (data: FormData | {
    title: string;
    description?: string;
    material_type?: string;
    file?: File | null;
  }): Promise<any> => {
    // Upload + text extraction + chunking + pgvector embedding can take a while
    const uploadTimeout = 120000; // 2 minutes

    if (data instanceof FormData) {
      const response = await apiClient.post('/materials', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: uploadTimeout,
      });
      return response.data;
    }

    const formData = new FormData();
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.material_type) formData.append('material_type', data.material_type);
    if (data.file) formData.append('file', data.file);

    const response = await apiClient.post('/materials', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: uploadTimeout,
    });
    return response.data;
  },

  deleteMaterial: async (materialId: string): Promise<any> => {
    const response = await apiClient.delete(`/materials/${materialId}`);
    return response.data;
  },

  processMaterial: async (materialId: string): Promise<any> => {
    const response = await apiClient.post(`/materials/${materialId}/process`);
    return response.data;
  },
};
