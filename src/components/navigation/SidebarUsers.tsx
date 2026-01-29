import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "~/contexts/LanguageContext";
import { useNavigation } from "~/contexts/NavigationContext";
import { getRoles, type Role } from "~/services/users";
import { Button } from "../ui/button";
import { UsersIcon } from "lucide-react";
import { SkeletonSidebarBuildings } from "../ui/LoadingSystem";

interface SidebarUsersParamas { }

const SidebarUsers: React.FC<SidebarUsersParamas> = () => {
  const { setActiveSection, setActiveTab, setViewMode, setSelectedBuildingId } =
    useNavigation();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [activeMenuItem, setActiveMenuItem] = useState<String | null>("todos");
  const params = new URLSearchParams(window.location.search);
  const role = params.get('role');

  useEffect(() => {
    if (role) setActiveMenuItem(role)
  }, [role]);

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
      <nav className="py-4">
        <div className="space-y-1.5 px-3">
          {roles && roles.length > 0 ? (
            <>
              <Button
                variant="ghost"
                onClick={() => (
                  handleAllUsersClick("users", "todos", "/users"),
                  setActiveMenuItem("todos")
                )}
                className={
                  activeMenuItem === "todos"
                    ? "w-full items-center gap-3 p-3 rounded-lg font-medium transition-all bg-blue-600 text-white border-l-4 border-blue-700"
                    : "w-full px-3 py-3 rounded-md flex items-center gap-3 text-sm transition-colors text-gray-700 hover:bg-gray-50"
                }
              >
                <UsersIcon className="w-4 h-4" />
                <span className="flex-1 text-left truncate leading-relaxed">
                  {t("allUsers")}
                </span>
              </Button>
              {
                roles.map((role: Role) => (
                  <div key={role.id} className="mb-1">
                    <Button
                      variant="ghost"
                      onClick={() => (
                        handleAllUsersClick("users", role.name, `/users`),
                        setActiveMenuItem(role.name)
                      )}
                      className={
                        activeMenuItem === role.name
                          ? " w-full px-3 py-3 rounded-md flex items-center gap-3 text-sm transition-colors bg-blue-600 text-white shadow-sm"
                          : "w-full px-3 py-3 rounded-md flex items-center gap-3 text-sm transition-colors text-gray-700 hover:bg-gray-50"
                      }
                    >
                      <UsersIcon className="w-4 h-4" />
                      <span className="flex-1 text-left truncate leading-relaxed">
                        {t(role.name)}
                      </span>
                    </Button>
                  </div>
                ))
              }
              <Button
                variant="ghost"
                onClick={() => (
                  handleAllUsersClick("users", "permisos", "/users"),
                  setActiveMenuItem("permisos")
                )}
                className={
                  activeMenuItem === "permisos"
                    ? " w-full px-3 py-3 rounded-md flex items-center gap-3 text-sm transition-colors bg-blue-600 text-white shadow-sm"
                    : "w-full text-gray-700 hover:bg-gray-100 hover:text-gray-900 border-l-4 border-transparent hover:border-blue-500"
                }
              >
                <UsersIcon className="w-4 h-4" />
                <span className="flex-1 text-left truncate leading-relaxed">
                  {t("managePermission")}
                </span>
              </Button>
            </>
          ) : (
            <div className="p-3 text-sm text-gray-500">
              <SkeletonSidebarBuildings />
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default SidebarUsers;
