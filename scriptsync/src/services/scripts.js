import api from './api';

// Helper function to handle API errors and provide fallbacks
const handleApiError = (error, fallbackMessage = 'Operation failed') => {
  if (error.response) {
    // Server responded with error status
    return {
      success: false,
      message: error.response.data?.message || fallbackMessage,
      status: error.response.status
    };
  } else if (error.request) {
    // Request was made but no response received (server down)
    return {
      success: false,
      message: 'Server is unavailable. Working in offline mode.',
      offline: true
    };
  } else {
    // Something else happened
    return {
      success: false,
      message: fallbackMessage
    };
  }
};

export const scriptsService = {
  async getScripts(params = {}) {
    try {
      const response = await api.get('/scripts', { params });
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to load scripts');
    }
  },

  async getScript(id) {
    try {
      const response = await api.get(`/scripts/${id}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to load script');
    }
  },

  async createScript(scriptData) {
    try {
      const response = await api.post('/scripts', scriptData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to create script');
    }
  },

  async updateScript(id, updates) {
    try {
      const response = await api.put(`/scripts/${id}`, updates);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to update script');
    }
  },

  async deleteScript(id) {
    try {
      const response = await api.delete(`/scripts/${id}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to delete script');
    }
  },

  async createVersion(id, commitData) {
    try {
      const response = await api.post(`/scripts/${id}/versions`, commitData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to create version');
    }
  },

  async getVersions(id) {
    try {
      const response = await api.get(`/scripts/${id}/versions`);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to load versions');
    }
  },

  async getUserScripts() {
    try {
      const response = await api.get('/scripts');
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to load user scripts');
    }
  },

  async getUserActivities() {
    try {
      const response = await api.get('/activities');
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to load activities');
    }
  },

  async createCommit(scriptId, commitData) {
    try {
      const response = await api.post(`/scripts/${scriptId}/commits`, commitData);
      return response.data;
    } catch (error) {
      return handleApiError(error, 'Failed to create commit');
    }
  }
};