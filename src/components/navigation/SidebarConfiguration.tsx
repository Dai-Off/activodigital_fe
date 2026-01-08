import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "~/contexts/LanguageContext";
import { useNavigation } from "~/contexts/NavigationContext";
import { Button } from "../ui/button";
import { Settings } from "lucide-react";
import { SkeletonSidebarBuildings } from "../ui/LoadingSystem";

interface SidebarConfigurationParamas { }

const SidebarConfiguration: React.FC<SidebarConfigurationParamas> = () => {
    const { setActiveSection, setActiveTab, setViewMode, setSelectedBuildingId } =
        useNavigation();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [view, setView] = useState<string[]>([]);
    const [activeMenuItem, setActiveMenuItem] = useState<String | null>("generalConfig");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const viewParam = params.get('view');
        if (viewParam) {
            setActiveMenuItem(viewParam);
        }
    }, []);

    useEffect(() => {
        setView([]);
    }, []);

    const handleClick = (
        action: string,
        view: string,
        navigateTo: string
    ) => {
        setActiveSection && setActiveSection(action);
        setActiveTab && setActiveTab(action);
        setViewMode && setViewMode("list");
        setSelectedBuildingId && setSelectedBuildingId(null);
        navigate(`${navigateTo}${view ? `?view=${encodeURIComponent(view)}` : ""}`);
    };

    return (
        <>
            <nav className="py-4">
                <div className="space-y-1.5 px-3">
                    {view ? (
                        <>
                            <Button
                                variant="ghost"
                                onClick={() => (
                                    handleClick("users", "generalConfig", "/configuration"),
                                    setActiveMenuItem("generalConfig")
                                )}
                                className={
                                    activeMenuItem === "generalConfig"
                                        ? "w-full items-center gap-3 p-3 rounded-lg font-medium transition-all bg-blue-600 text-white border-l-4 border-blue-700"
                                        : "w-full px-3 py-3 rounded-md flex items-center gap-3 text-sm transition-colors text-gray-700 hover:bg-gray-50"
                                }
                            >
                                <Settings className="w-4 h-4" />
                                <span className="flex-1 text-left truncate leading-relaxed">
                                    {t("General Config", "Configuración General")}
                                </span>
                            </Button>
                            <Button variant="ghost"
                                onClick={() => (
                                    handleClick("users", "notification", "/configuration"),
                                    setActiveMenuItem("notification")
                                )}
                                className={
                                    activeMenuItem === "notification"
                                        ? "w-full items-center gap-3 p-3 rounded-lg font-medium transition-all bg-blue-600 text-white border-l-4 border-blue-700"
                                        : "w-full px-3 py-3 rounded-md flex items-center gap-3 text-sm transition-colors text-gray-700 hover:bg-gray-50"
                                }
                            >
                                <Settings className="w-4 h-4" />
                                <span className="flex-1 text-left truncate leading-relaxed">
                                    {t("Notification", "Notificación")}
                                </span>
                            </Button>
                            <Button variant="ghost"
                                onClick={() => (
                                    handleClick("users", "intregration", "/configuration"),
                                    setActiveMenuItem("intregration")
                                )}
                                className={
                                    activeMenuItem === "intregration"
                                        ? "w-full items-center gap-3 p-3 rounded-lg font-medium transition-all bg-blue-600 text-white border-l-4 border-blue-700"
                                        : "w-full px-3 py-3 rounded-md flex items-center gap-3 text-sm transition-colors text-gray-700 hover:bg-gray-50"
                                }
                            >
                                <Settings className="w-4 h-4" />
                                <span className="flex-1 text-left truncate leading-relaxed">
                                    {t("Integration", "Integración")}
                                </span>
                            </Button>
                            <Button variant="ghost"
                                onClick={() => (
                                    handleClick("users", "security", "/configuration"),
                                    setActiveMenuItem("security")
                                )}
                                className={
                                    activeMenuItem === "security"
                                        ? "w-full items-center gap-3 p-3 rounded-lg font-medium transition-all bg-blue-600 text-white border-l-4 border-blue-700"
                                        : "w-full px-3 py-3 rounded-md flex items-center gap-3 text-sm transition-colors text-gray-700 hover:bg-gray-50"
                                }
                            >
                                <Settings className="w-4 h-4" />
                                <span className="flex-1 text-left truncate leading-relaxed">
                                    {t("Security", "Seguridad")}
                                </span>
                            </Button>
                            <Button variant="ghost"
                                onClick={() => (
                                    handleClick("users", "BackUpAndRestauration", "/configuration"),
                                    setActiveMenuItem("BackUpAndRestauration")
                                )}
                                className={
                                    activeMenuItem === "BackUpAndRestauration"
                                        ? "w-full items-center gap-3 p-3 rounded-lg font-medium transition-all bg-blue-600 text-white border-l-4 border-blue-700"
                                        : "w-full px-3 py-3 rounded-md flex items-center gap-3 text-sm transition-colors text-gray-700 hover:bg-gray-50"
                                }
                            >
                                <Settings className="w-4 h-4" />
                                <span className="flex-1 text-left truncate leading-relaxed">
                                    {t("Back up and Restauration", "Backup y Restauración")}
                                </span>
                            </Button>
                        </>
                    ) : (
                        <div className="p-3 text-sm text-gray-500">
                            <SkeletonSidebarBuildings />
                        </div>
                    )}
                </div>
            </nav >
        </>
    );
};

export default SidebarConfiguration;
