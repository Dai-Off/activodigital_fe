import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "~/contexts/LanguageContext";
import { useNavigation } from "~/contexts/NavigationContext";
import { getRoles, type Role } from "~/services/users";
import { Button } from "../ui/button";
import { UsersIcon } from "lucide-react";

interface SidebarUsersParamas {}

const SidebarUsers: React.FC<SidebarUsersParamas> = () => {
  const { setActiveSection, setActiveTab, setViewMode, setSelectedBuildingId } =
    useNavigation();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [activeMenuItem, setActiveMenuItem] = useState<String | null>("todos");

  useEffect(() => {
    Promise.all([getRoles()])
      .then(([res1]) => {
        setRoles(res1);
      })
      .catch(() => {
        setRoles([]);
      });
  }, []);

  const handleAllUsersClick = (
    action: string,
    role: string,
    navigateTo: string
  ) => {
    setActiveSection && setActiveSection(action);
    setActiveTab && setActiveTab(action);
    setViewMode && setViewMode("list");
    setSelectedBuildingId && setSelectedBuildingId(null);
    navigate(`${navigateTo}${role ? `?role=${encodeURIComponent(role)}` : ""}`);
  };

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => (
          handleAllUsersClick("usuarios", "todos", "/usuarios"),
          setActiveMenuItem("todos")
        )}
        className={
          activeMenuItem === "todos"
            ? "w-full items-center gap-3 p-3 rounded-lg font-medium transition-all bg-blue-600 text-white border-l-4 border-blue-700"
            : "w-full items-center gap-3 p-3 rounded-lg font-medium transition-all text-gray-700 hover:bg-gray-100 hover:text-gray-900 border-l-4 border-transparent hover:border-blue-500"
        }
      >
        <UsersIcon className="w-4 h-4" />
        <span className="flex-1 text-left truncate leading-relaxed">
          {t("all Users", "Todos los usuarios")}
        </span>
      </Button>
      {roles && roles.length > 0 ? (
        roles.map((role: Role) => (
          <div key={role.id} className="mb-1">
            <Button
              variant="ghost"
              onClick={() => (
                handleAllUsersClick("usuarios", role.name, `/usuarios`),
                setActiveMenuItem(role.name)
              )}
              className={
                activeMenuItem === role.name
                  ? " w-full bg-blue-600 text-white border-l-4 border-blue-700"
                  : "w-full items-center gap-3 p-3 rounded-lg font-medium transition-all text-gray-700 hover:bg-gray-100 hover:text-gray-900 border-l-4 border-transparent hover:border-blue-500"
              }
            >
              <UsersIcon className="w-4 h-4" />
              <span className="flex-1 text-left truncate leading-relaxed">
                {role.name.charAt(0).toUpperCase() +
                  role.name.slice(1).toLowerCase()}
              </span>
            </Button>
          </div>
        ))
      ) : (
        <div className="p-3 text-sm text-gray-500">
          {t("noRoles", "No hay roles")}
        </div>
      )}
      <Button
        variant="ghost"
        onClick={() => (
          handleAllUsersClick("usuarios", "permisos", "/usuarios"),
          setActiveMenuItem("permisos")
        )}
        className={
          activeMenuItem === "permisos"
            ? " w-full bg-blue-600 text-white border-l-4 border-blue-700"
            : "w-full text-gray-700 hover:bg-gray-100 hover:text-gray-900 border-l-4 border-transparent hover:border-blue-500"
        }
      >
        <UsersIcon className="w-4 h-4" />
        <span className="flex-1 text-left truncate leading-relaxed">
          {t("Manage Permission", "Gestión de permisos")}
        </span>
      </Button>
    </>
  );
};

export default SidebarUsers;
