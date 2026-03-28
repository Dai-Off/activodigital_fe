import React, { useEffect, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import { type Building, BuildingsApiService } from '../../services/buildingsApi';
import { Building as BuildingIcon, Loader2 } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';



interface BuildingSelectorProps {
    onSelect?: (building: Building) => void;
    selectedId?: string;
}

export const BuildingSelector: React.FC<BuildingSelectorProps> = ({ onSelect, selectedId }) => {
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [loading, setLoading] = useState(false);
    const { showError } = useToast();

    useEffect(() => {
        const fetchBuildings = async () => {
            setLoading(true);
            try {
                const data = await BuildingsApiService.getAllBuildings();
                console.log("Buildings fetched:", data);
                setBuildings(data || []);
            } catch (error: any) {
                console.error("Failed to fetch buildings:", error);
                showError("Error al cargar edificios", error.message || error);
            } finally {
                setLoading(false);
            }
        };

        fetchBuildings();
    }, [showError]);

    const handleValueChange = (buildingId: string) => {
        const selected = buildings.find(b => b.id === buildingId);
        if (selected && onSelect) {
            onSelect(selected);
        }
    };

    const getBuildingThumbnail = (building: Building) => {
        const mainImage = building.images?.find(img => img.isMain) || building.images?.[0];
        return mainImage?.url || "/image.png";
    };

    return (
        <Select onValueChange={handleValueChange} disabled={loading} value={selectedId}>
            <SelectTrigger className="w-full h-12 pl-4 pr-4 text-base text-slate-700 bg-white border-[1.5px] border-slate-300 rounded-xl transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/15">
                <div className="flex items-center gap-3 w-full overflow-hidden">
                    {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin shrink-0 text-slate-400" />
                    ) : (
                        <BuildingIcon className="h-5 w-5 shrink-0 text-slate-400" />
                    )}
                    <span className="truncate flex-1 text-left block">
                        <SelectValue placeholder="Seleccionar Edificio" />
                    </span>
                </div>
            </SelectTrigger>
            <SelectContent
                className="bg-white z-[9999] border border-slate-200 shadow-xl rounded-xl w-[var(--radix-select-trigger-width)] min-w-[320px] max-h-[400px]"
                position="popper"
                sideOffset={4}
            >
                {buildings.length === 0 && !loading ? (
                    <div className="p-4 text-sm text-slate-500 text-center">No hay edificios</div>
                ) : (
                    buildings.map((building) => (
                        <SelectItem key={building.id} value={building.id} className="cursor-pointer rounded-lg m-1 p-2 hover:bg-slate-50 focus:bg-slate-50 focus:text-slate-900 text-slate-700 [&_[data-radix-select-item-text]]:w-full [&_[data-radix-select-item-text]]:min-w-0 [&_[data-radix-select-item-text]]:overflow-hidden [&_[data-radix-select-item-text]]:block">
                            <div className="flex items-center gap-3 w-full min-w-0">
                                <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0 border border-slate-100 shadow-sm">
                                    <img
                                        src={getBuildingThumbnail(building)}
                                        alt={building.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/image.png"; }}
                                    />
                                </div>
                                <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                                    <span className="block font-semibold text-sm text-slate-800 truncate leading-tight" title={building.name}>
                                        {building.name}
                                    </span>
                                    {building.address && (
                                        <span className="block text-[11px] text-slate-500 truncate mt-0.5" title={building.address}>
                                            {building.address.length > 42 ? `${building.address.substring(0, 42)}...` : building.address}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </SelectItem>
                    ))
                )}
            </SelectContent>
        </Select>
    );
};
