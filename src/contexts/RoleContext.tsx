
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'patient' | 'doctor' | 'family' | 'admin';

interface RoleContextType {
  userRole: UserRole | null;
  setUserRole: (role: UserRole | null) => void;
  permissions: {
    canViewAllPatients: boolean;
    canEditPatients: boolean;
    canViewMedicalRecords: boolean;
    canCreateAppointments: boolean;
    canManageEmergencyContacts: boolean;
    canAccessAdminDashboard: boolean;
  };
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const getPermissions = (role: UserRole | null) => {
    if (!role) {
      return {
        canViewAllPatients: false,
        canEditPatients: false,
        canViewMedicalRecords: false,
        canCreateAppointments: false,
        canManageEmergencyContacts: false,
        canAccessAdminDashboard: false,
      };
    }
    switch (role) {
      case 'admin':
        return {
          canViewAllPatients: true,
          canEditPatients: true,
          canViewMedicalRecords: true,
          canCreateAppointments: true,
          canManageEmergencyContacts: true,
          canAccessAdminDashboard: true,
        };
      case 'doctor':
        return {
          canViewAllPatients: true,
          canEditPatients: true,
          canViewMedicalRecords: true,
          canCreateAppointments: true,
          canManageEmergencyContacts: true,
          canAccessAdminDashboard: false,
        };
      case 'family':
        return {
          canViewAllPatients: false,
          canEditPatients: false,
          canViewMedicalRecords: true,
          canCreateAppointments: false,
          canManageEmergencyContacts: true,
          canAccessAdminDashboard: false,
        };
      case 'patient':
      default:
        return {
          canViewAllPatients: false,
          canEditPatients: false,
          canViewMedicalRecords: true,
          canCreateAppointments: true,
          canManageEmergencyContacts: false,
          canAccessAdminDashboard: false,
        };
    }
  };

  const permissions = getPermissions(userRole);

  return (
    <RoleContext.Provider value={{ userRole, setUserRole, permissions }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within RoleProvider');
  }
  return context;
};
