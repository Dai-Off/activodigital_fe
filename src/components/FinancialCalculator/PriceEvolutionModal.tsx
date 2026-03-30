import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "~/components/ui/dialog";
import { PriceEvolutionChart } from './PriceEvolutionChart';
import { MarketDataService } from '../../services/MarketDataService';
import { Loader2 } from 'lucide-react';

interface PriceEvolutionModalProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
    municipality: string | null;
    province: string | null;
    buildingName?: string;
    address?: string;
    variant?: 'ine' | 'idealista' | 'registradores'; // [NEW] Variant
}

export const PriceEvolutionModal: React.FC<PriceEvolutionModalProps> = ({
    isOpen,
    onClose,
    municipality,
    province,
    buildingName,
    address,
    variant = 'ine' // Default to INE
}) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && (municipality || province)) {
            const fetchData = async () => {
                setLoading(true);
                setError(null);
                try {
                    let result: any[] = [];
                    if (variant === 'ine') {
                        result = await MarketDataService.getProjectedPriceEvolution(municipality || '', province || '');
                    } else if (variant === 'registradores') {
                        // [NEW] Registradores Data
                        result = await MarketDataService.getRegistradoresHistory(municipality || '', province || '');
                    } else {
                        // Idealista Data
                        result = await MarketDataService.getIdealistaHistory(municipality || '', province || '');
                    }

                    setData(result);

                } catch (err) {
                    console.error("Failed to fetch price evolution", err);
                    setError("No se pudieron cargar los datos históricos.");
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [isOpen, municipality, province, variant]);

    const titleLocation = municipality || province || "España";
    let titleSource = 'Desconocido';
    let description = '';

    switch (variant) {
        case 'ine':
            titleSource = 'Data Ayuntamientos';
            description = "Histórico de precios por metro cuadrado en los últimos 5 años para la zona (Fuente: INE/Ayuntamientos).";
            break;
        case 'registradores':
            titleSource = 'Datos Registradores (Vivienda Usada)';
            description = "Histórico de precios de compraventa reales (Fuente: Registradores). Muestra el valor de vivienda usada.";
            break;
        case 'idealista':
            titleSource = 'Expectativa Idealista';
            description = "Histórico de precios de oferta en Idealista (Fuente: Idealista).";
            break;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px] bg-white">
                <DialogHeader>
                    <div className="flex flex-col gap-1 items-start">
                        <DialogTitle className="flex items-center gap-2 text-2xl text-slate-900 font-bold">
                            Evolución <span className="font-normal text-slate-500 text-xl ml-1">{titleSource} en:</span> <span className="text-blue-600 font-bold">{titleLocation}</span>
                        </DialogTitle>

                        {(address || buildingName) && (
                            <div className="flex flex-col text-sm text-slate-500 mt-1">
                                {buildingName && <span className="font-semibold text-slate-700">{buildingName}</span>}
                                {address && <span>{address}</span>}
                            </div>
                        )}

                        <DialogDescription className="mt-2 text-xs text-slate-400">
                            {description}
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="py-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-[400px] gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            <p className="text-sm text-slate-500">Cargando datos históricos...</p>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-[400px] text-red-500 bg-red-50 rounded-lg">
                            {error}
                        </div>
                    ) : (
                        <PriceEvolutionChart data={data} variant={variant} />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
