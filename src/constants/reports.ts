import { 
  Building2, 
  Zap, 
  Euro, 
  FileText, 
  Wrench, 
  House
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ReportCategoryDefinition {
  id: string;
  label: string;
  icon: LucideIcon;
  colorClass: string;
  iconColorClass: string;
  badgeClass: string;
}

export const REPORT_CATEGORIES: Record<string, ReportCategoryDefinition> = {
  general: { 
    id: 'general',
    label: 'General', 
    icon: Building2, 
    colorClass: 'bg-gray-100', 
    iconColorClass: 'text-gray-600', 
    badgeClass: 'bg-gray-100 text-gray-700 border-gray-200' 
  },
  energy: { 
    id: 'energy',
    label: 'Energía', 
    icon: Zap, 
    colorClass: 'bg-green-100', 
    iconColorClass: 'text-green-600', 
    badgeClass: 'bg-green-100 text-green-700 border-green-200' 
  },
  financial: { 
    id: 'financial',
    label: 'Financiero', 
    icon: Euro, 
    colorClass: 'bg-blue-100', 
    iconColorClass: 'text-blue-600', 
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-200' 
  },
  compliance: { 
    id: 'compliance',
    label: 'Cumplimiento', 
    icon: FileText, 
    colorClass: 'bg-purple-100', 
    iconColorClass: 'text-purple-600', 
    badgeClass: 'bg-purple-100 text-purple-700 border-purple-200' 
  },
  maintenance: { 
    id: 'maintenance',
    label: 'Mantenimiento', 
    icon: Wrench, 
    colorClass: 'bg-orange-100', 
    iconColorClass: 'text-orange-600', 
    badgeClass: 'bg-orange-100 text-orange-700 border-orange-200' 
  },
  occupancy: { 
    id: 'occupancy',
    label: 'Ocupación', 
    icon: House, 
    colorClass: 'bg-yellow-100', 
    iconColorClass: 'text-yellow-600', 
    badgeClass: 'bg-yellow-100 text-yellow-700 border-yellow-200' 
  }
};

export const CATEGORY_LIST = Object.values(REPORT_CATEGORIES);
