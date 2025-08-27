// Auth utility functions untuk mengelola session user
export const authUtils = {
  // Set user data ke localStorage setelah login berhasil
  setCurrentUser: (userData) => {
    // Support new login response format
    const userToStore = {
      id: userData.user_id || userData.id,
      username: userData.username,
      nama: userData.nama,
      role: userData.role,
      santri_id: userData.santri_id,
      ustadz_id: userData.ustadz_id,
      token: userData.token || 'authenticated'
    };
    localStorage.setItem('currentUser', JSON.stringify(userToStore));
    localStorage.setItem('authToken', userToStore.token);
  },

  // Get current user data dari localStorage
  getCurrentUser: () => {
    try {
      const userData = localStorage.getItem('currentUser');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Get current user ID
  getCurrentUserId: () => {
    const user = authUtils.getCurrentUser();
    return user ? user.id : null;
  },

  // Get current user role
  getCurrentUserRole: () => {
    const user = authUtils.getCurrentUser();
    return user ? user.role : null;
  },

  // Check if user is logged in
  isLoggedIn: () => {
    const user = authUtils.getCurrentUser();
    const token = localStorage.getItem('authToken');
    return user && token;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user'); // Remove old format too
    window.location.href = '/';
  },

  // Check if user has specific role
  hasRole: (role) => {
    const userRole = authUtils.getCurrentUserRole();
    return userRole === role;
  },

  // Get santri ID for santri user
  getSantriId: () => {
    const user = authUtils.getCurrentUser();
    if (user && user.role === 'Santri') {
      return user.santri_id || user.id;
    }
    return null;
  },

  // Get ustadz ID for ustadz user  
  getUstadzId: () => {
    const user = authUtils.getCurrentUser();
    if (user && user.role === 'Ustadz') {
      return user.ustadz_id || user.id;
    }
    return null;
  }
};

// Hook untuk menggunakan auth dalam functional components
export const useAuth = () => {
  const currentUser = authUtils.getCurrentUser();
  const isLoggedIn = authUtils.isLoggedIn();
  
  return {
    currentUser,
    isLoggedIn,
    userId: authUtils.getCurrentUserId(),
    userRole: authUtils.getCurrentUserRole(),
    santriId: authUtils.getSantriId(),
    ustadzId: authUtils.getUstadzId(),
    hasRole: authUtils.hasRole,
    logout: authUtils.logout
  };
};

export default authUtils;
