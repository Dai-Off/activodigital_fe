
import React, { useState, useEffect } from 'react';
import { Save, Trash2, RotateCcw, Loader2, Database } from 'lucide-react';
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import { toast } from "sonner";

import { calcuSupabaseService, type CalcuSnapshot } from '../../services/calcuSupabaseService';
import type { FinancialProjectState } from '../../services/mockFinancialData';

interface CalculationSessionManagerProps {
    currentProjectState: FinancialProjectState;
    onLoadSession: (state: FinancialProjectState) => void;
}

export const CalculationSessionManager: React.FC<CalculationSessionManagerProps> = ({
    currentProjectState,
    onLoadSession
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [sessions, setSessions] = useState<CalcuSnapshot[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newSessionName, setNewSessionName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const [fetchError, setFetchError] = useState<string | null>(null);

    // Fetch sessions when dialog opens
    useEffect(() => {
        if (isOpen) {
            loadSessions();
        }
    }, [isOpen]);

    const loadSessions = async () => {
        setIsLoading(true);
        setFetchError(null);
        const { data, error } = await calcuSupabaseService.calcuGetSessions();
        if (error) {
            setFetchError(error);
            setSessions([]);
        } else {
            setSessions(data);
        }
        setIsLoading(false);
    };

    // ... (handleSave and handleDelete remain mostly same, just checking types if needed) ...

    const handleSave = async () => {
        if (!newSessionName.trim()) {
            toast.error("Por favor ingresa un nombre para la sesión.");
            return;
        }

        setIsSaving(true);
        const result = await calcuSupabaseService.calcuSaveSession(newSessionName, currentProjectState);
        setIsSaving(false);

        if (result.success) {
            toast.success("Sesión guardada correctamente.");
            setNewSessionName('');
            loadSessions(); // Refresh list
        } else {
            toast.error("Error al guardar: " + result.error);
        }
    };

    // ...

    const handleLoad = (session: CalcuSnapshot) => {
        onLoadSession(session.project_state);
        setIsOpen(false);
        toast.success(`Sesión "${session.name}" cargada.`);
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('¿Estás seguro de que deseas eliminar esta sesión?')) {
            const success = await calcuSupabaseService.calcuDeleteSession(id);
            if (success) {
                toast.success("Sesión eliminada.");
                loadSessions();
            } else {
                toast.error("No se pudo eliminar la sesión.");
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {/* ... Trigger ... */}
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Database className="h-4 w-4" />
                    <span>Administrar Sesiones</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    {/* ... */}
                    <DialogTitle>Gestión de Sesiones de Cálculo</DialogTitle>
                    <DialogDescription>
                        Guarda tu progreso actual o recupera cálculos anteriores (Máx. 10).
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Save New Session */}
                    {/* ... */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700">Guardar Sesión Actual</label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Nombre de la sesión (ej. Escenario Optimista)"
                                value={newSessionName}
                                onChange={(e) => setNewSessionName(e.target.value)}
                            />
                            <Button onClick={handleSave} disabled={isSaving || !newSessionName.trim()}>
                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                <span className="sr-only sm:not-sr-only sm:ml-2">Guardar</span>
                            </Button>
                        </div>
                    </div>

                    <div className="h-[1px] bg-slate-100" />

                    {/* List Sessions */}
                    <div className="flex flex-col gap-2">
                        {/* Error Alert */}
                        {fetchError && (
                            <div className="p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-md mb-2">
                                <strong>Error de Conexión:</strong> {fetchError}
                                <br />
                                Verifica que la tabla <code>calcu_snapshots</code> exista en Supabase.
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-slate-700">Sesiones Guardadas</label>
                            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={loadSessions}>
                                Refrescar
                            </Button>
                        </div>

                        <ScrollArea className="h-[250px] rounded-md border p-4 bg-slate-50">
                            {isLoading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                                </div>
                            ) : sessions.length === 0 ? (
                                <div className="text-center py-8 text-slate-400 text-sm">
                                    {fetchError ? 'No se pudieron cargar las sesiones.' : 'No hay sesiones guardadas.'}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {sessions.map((session) => (
                                        <Card key={session.id} className="cursor-pointer hover:border-blue-200 transition-colors bg-white shadow-sm" onClick={() => handleLoad(session)}>
                                            <CardContent className="p-3 flex items-center justify-between">
                                                <div className="flex flex-col overflow-hidden">
                                                    <span className="font-medium text-sm text-slate-800 truncate" title={session.name}>
                                                        {session.name}
                                                    </span>
                                                    <span className="text-[10px] text-slate-500">
                                                        {new Date(session.created_at).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-600 hover:text-blue-800 hover:bg-blue-50" title="Cargar">
                                                        <RotateCcw className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50"
                                                        onClick={(e) => handleDelete(session.id, e)}
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
