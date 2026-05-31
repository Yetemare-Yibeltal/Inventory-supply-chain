import { useAuth } from "../context/AuthContext";

export const usePermissions = () => {
  const { user } = useAuth();

  // Clean fallback sanitization to ensure role comparisons are safe and uppercase/lowercase invariant
  const role = user?.role ? user.role.toLowerCase() : "guest";

  // Enterprise Role-Based Access Control (RBAC) Permission Resolution Matrix Map
  const permissionsMatrix = {
    admin: {
      canCreate: true,
      canUpdate: true,
      canDelete: true,
      isAdmin: true,
    },
    manager: {
      canCreate: true,
      canUpdate: true,
      canDelete: false,
      isAdmin: false,
    },
    staff: {
      canCreate: false,
      canUpdate: false,
      canDelete: false,
      isAdmin: false,
    },
    guest: {
      canCreate: false,
      canUpdate: false,
      canDelete: false,
      isAdmin: false,
    },
  };

  // Resolve active permissions list with an all-false structural fallback state block
  const activePermissions = permissionsMatrix[role] || permissionsMatrix.guest;

  return {
    ...activePermissions,
    role,
  };
};

export default usePermissions;

