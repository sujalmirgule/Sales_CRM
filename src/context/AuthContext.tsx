import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole, Permission, ALL_PERMISSIONS } from '../types/crm';
import { StorageService } from '../services/storageService';

export interface AuthResponse {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  currentUser: User;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => AuthResponse;
  logout: () => void;
  switchUser: (userId: string) => AuthResponse;
  allUsers: User[];
  isMaster: boolean;
  refreshUsers: () => void;
  permissions: Permission[];
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<User>(() => StorageService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [allUsers, setAllUsers] = useState<User[]>(() => StorageService.getUsers());

  const refreshUsers = useCallback(() => {
    const freshUsers = StorageService.getUsers();
    setAllUsers(freshUsers);
    // Also keep currentUser state synchronized if its details were updated
    const current = StorageService.getCurrentUser();
    setCurrentUserState(current);
  }, []);

  const switchUser = (userId: string): AuthResponse => {
    const users = StorageService.getUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) {
      return { success: false, error: 'User account not found.' };
    }

    if (user.status === 'inactive') {
      return {
        success: false,
        error: `Cannot switch to ${user.name}: This account has been deactivated. Please reactivate the account first in Team Management.`,
      };
    }

    StorageService.setCurrentUser(user.id);
    setCurrentUserState(user);
    setIsAuthenticated(true);
    setAllUsers(users);

    StorageService.addActivityLog({
      activity: 'User Role Switched',
      entity: `User ${user.id}`,
      entityId: user.id,
      description: `Logged in as ${user.name} (${user.role.toUpperCase()})`,
    });

    return { success: true };
  };

  const login = (email: string, password?: string): AuthResponse => {
    const users = StorageService.getUsers();
    const trimmedEmail = email.toLowerCase().trim();
    const user = users.find((u) => u.email.toLowerCase().trim() === trimmedEmail);

    if (!user) {
      return {
        success: false,
        error: 'No account registered with this email address. Please check your spelling.',
      };
    }

    if (user.status === 'inactive') {
      return {
        success: false,
        error: 'This staff account has been deactivated by the Master Administrator. Login access is disabled. Please contact your manager.',
      };
    }

    const expectedPassword = user.password || 'Demo@123';
    if (password && password !== expectedPassword) {
      return {
        success: false,
        error: 'Incorrect password entered. Please verify your credentials or reset your demo password.',
      };
    }

    StorageService.setCurrentUser(user.id);
    setCurrentUserState(user);
    setIsAuthenticated(true);
    setAllUsers(users);

    // If staff user logging in today, record active attendance session if not present
    if (user.role === 'staff') {
      const attendance = StorageService.getAttendance();
      const today = new Date().toISOString().slice(0, 10);
      const existingSession = attendance.find(
        (a) => a.staffId === user.id && a.date === today && a.status === 'active'
      );
      if (!existingSession) {
        attendance.unshift({
          id: `ATT-${Date.now().toString().slice(-4)}`,
          staffId: user.id,
          staffName: user.name,
          date: today,
          loginTime: new Date().toISOString(),
          logoutTime: null,
          totalSessionDurationMinutes: 0,
          totalCallingTimeMinutes: 0,
          totalTalkTimeMinutes: 0,
          idleTimeMinutes: 0,
          status: 'active',
        });
        StorageService.saveAttendance(attendance);
      }
    }

    StorageService.addActivityLog({
      activity: 'User Logged In',
      entity: `User ${user.id}`,
      entityId: user.id,
      description: `${user.name} logged in successfully via demo auth.`,
    });

    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    StorageService.addActivityLog({
      activity: 'User Logged Out',
      entity: `User ${currentUser.id}`,
      entityId: currentUser.id,
      description: `${currentUser.name} signed out.`,
    });
  };

  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (currentUser.role === 'master') return true;
      return currentUser.permissions?.includes(permission) ?? false;
    },
    [currentUser]
  );

  const hasAnyPermission = useCallback(
    (perms: Permission[]): boolean => {
      if (currentUser.role === 'master') return true;
      if (!currentUser.permissions) return false;
      return perms.some((p) => currentUser.permissions?.includes(p));
    },
    [currentUser]
  );

  const hasAllPermissions = useCallback(
    (perms: Permission[]): boolean => {
      if (currentUser.role === 'master') return true;
      if (!currentUser.permissions) return false;
      return perms.every((p) => currentUser.permissions?.includes(p));
    },
    [currentUser]
  );

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  const permissions = currentUser.role === 'master' ? ALL_PERMISSIONS : currentUser.permissions || [];

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser.role,
        isAuthenticated,
        login,
        logout,
        switchUser,
        allUsers,
        isMaster: currentUser.role === 'master',
        refreshUsers,
        permissions,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
