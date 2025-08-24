import api from './api';

export const authService = {
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.success) {
        localStorage.setItem('accessToken', response.data.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        localStorage.setItem('isAuthenticated', 'true');
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.success) {
        const serverUser = response.data.data.user;
        
        // Check for existing local profile data
        const existingUser = localStorage.getItem('user');
        const existingPreferences = localStorage.getItem('userPreferences');
        const existingSecurity = localStorage.getItem('userSecurity');
        
        let mergedUser = serverUser;
        
        // If we have local data for the same user, merge it
        if (existingUser) {
          try {
            const localUser = JSON.parse(existingUser);
            if (localUser.email === serverUser.email) {
              // Merge local profile changes with server data, prioritizing local changes
              mergedUser = {
                ...serverUser,
                // Preserve ALL local profile changes
                avatarUrl: localUser.avatarUrl || serverUser.avatarUrl,
                bio: localUser.bio !== undefined ? localUser.bio : serverUser.bio,
                phone: localUser.phone !== undefined ? localUser.phone : serverUser.phone,
                dateOfBirth: localUser.dateOfBirth !== undefined ? localUser.dateOfBirth : serverUser.dateOfBirth,
                name: localUser.name !== undefined ? localUser.name : serverUser.name,
                // Keep server data for critical fields
                id: serverUser.id,
                email: serverUser.email,
                role: serverUser.role,
                // Preserve timestamp if user updated locally
                lastProfileUpdate: localUser.lastProfileUpdate || new Date().toISOString()
              };
            }
          } catch (error) {
            console.error('Error parsing existing user data:', error);
          }
        }
        
        localStorage.setItem('accessToken', response.data.data.accessToken);
        localStorage.setItem('user', JSON.stringify(mergedUser));
        localStorage.setItem('isAuthenticated', 'true');
        
        // Preserve preferences and security settings if they exist and belong to same user
        if (existingPreferences) {
          try {
            const prefs = JSON.parse(existingPreferences);
            // Keep existing preferences as they're user-specific
            localStorage.setItem('userPreferences', existingPreferences);
          } catch (error) {
            console.error('Error preserving preferences:', error);
          }
        }
        if (existingSecurity) {
          try {
            const security = JSON.parse(existingSecurity);
            // Keep existing security settings as they're user-specific
            localStorage.setItem('userSecurity', existingSecurity);
          } catch (error) {
            console.error('Error preserving security settings:', error);
          }
        }
        
        // Dispatch user update event
        window.dispatchEvent(new CustomEvent('userUpdated', { detail: mergedUser }));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    }
  },

  async getCurrentUser() {
    try {
      // First try to get from server
      const response = await api.get('/auth/me');
      
      if (response.data.success) {
        const serverUser = response.data.data.user;
        
        // Check for local profile changes
        const existingUser = localStorage.getItem('user');
        if (existingUser) {
          try {
            const localUser = JSON.parse(existingUser);
            if (localUser.email === serverUser.email) {
              // Merge local changes with server data, prioritizing local changes
              const mergedUser = {
                ...serverUser,
                // Preserve ALL local profile changes that have been made
                avatarUrl: localUser.avatarUrl || serverUser.avatarUrl,
                bio: localUser.bio !== undefined ? localUser.bio : serverUser.bio,
                phone: localUser.phone !== undefined ? localUser.phone : serverUser.phone,
                dateOfBirth: localUser.dateOfBirth !== undefined ? localUser.dateOfBirth : serverUser.dateOfBirth,
                name: localUser.name !== undefined ? localUser.name : serverUser.name,
                // Keep critical server data
                id: serverUser.id,
                email: serverUser.email,
                role: serverUser.role,
                // Keep track of when profile was last updated locally
                lastProfileUpdate: localUser.lastProfileUpdate || serverUser.lastProfileUpdate
              };
              
              // Update localStorage with merged data
              localStorage.setItem('user', JSON.stringify(mergedUser));
              
              // Dispatch update event to notify components
              window.dispatchEvent(new CustomEvent('userUpdated', { detail: mergedUser }));
              
              return {
                ...response.data,
                data: { user: mergedUser }
              };
            }
          } catch (error) {
            console.error('Error parsing local user data:', error);
          }
        }
        
        // Update localStorage with server data
        localStorage.setItem('user', JSON.stringify(serverUser));
        
        // Dispatch update event
        window.dispatchEvent(new CustomEvent('userUpdated', { detail: serverUser }));
      }
      
      return response.data;
    } catch (error) {
      // Fallback to local data if server is unavailable
      const localUser = this.getStoredUser();
      if (localUser) {
        return {
          success: true,
          data: { user: localUser },
          message: 'Using cached user data'
        };
      }
      throw error;
    }
  },

  getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  async updateUserProfile(updates) {
    try {
      // Get current user from localStorage
      const currentUser = this.getStoredUser();
      if (!currentUser) {
        throw new Error('No user found');
      }

      // Merge updates with current user data
      const updatedUser = {
        ...currentUser,
        ...updates,
        lastProfileUpdate: new Date().toISOString()
      };

      // Save to localStorage immediately
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Try to sync with server (optional - can fail gracefully)
      try {
        const response = await api.put('/auth/profile', updates);
        if (response.data.success) {
          // Server sync successful - merge any server-specific data
          const serverUser = response.data.data.user;
          const finalUser = {
            ...updatedUser, // Keep our local updates
            id: serverUser.id, // Ensure server ID is preserved
            email: serverUser.email, // Server email is authoritative
            role: serverUser.role // Server role is authoritative
          };
          localStorage.setItem('user', JSON.stringify(finalUser));
          window.dispatchEvent(new CustomEvent('userUpdated', { detail: finalUser }));
          return { success: true, data: { user: finalUser } };
        }
      } catch (syncError) {
        console.warn('Failed to sync profile with server, keeping local changes:', syncError);
      }

      // Dispatch update event even if server sync failed
      window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));
      return { success: true, data: { user: updatedUser }, offline: true };
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  isAuthenticated() {
    return localStorage.getItem('isAuthenticated') === 'true' && !!localStorage.getItem('accessToken');
  }
};