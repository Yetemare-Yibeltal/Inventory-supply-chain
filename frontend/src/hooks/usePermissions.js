import { useAuth } from "../context/AuthContext";

export const usePermissions = () => {
  const { user } = useAuth();
const role = user?.role;

  return {
    canCreate: ["admin", "manager"].includes(role),
    canUpdate: ["admin", "manager"].includes(role),
    canDelete: role === "admin",
    isAdmin: role === "admin",
    role,
  };
};
