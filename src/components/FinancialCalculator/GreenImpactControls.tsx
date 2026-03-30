import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
// import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Checkbox } from "~/components/ui/checkbox";
import { Leaf } from 'lucide-react';
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";

interface GreenImpactControlsProps {
    energyRating: string | null; // "A", "B", ... "G" or null
    onModifiersChange: (modifiers: { discountRateDelta: number; exitYieldDelta: number }) => void;
    disabled?: boolean;
}

export const GreenImpactControls: React.FC<GreenImpactControlsProps> = ({ energyRating, onModifiersChange, disabled = false }) => {
    const [isActive, setIsActive] = useState(false);
    const [applyGreenLoan, setApplyGreenLoan] = useState(true);
    const [applyGreenPremium, setApplyGreenPremium] = useState(true);

    // Analyze Energy Rating
    const validRating = energyRating ? energyRating.toUpperCase() : "ND";
    const isGreen = ["A", "B"].includes(validRating);
    // const isModerate = ["C", "D"].includes(validRating); // Unused

    // Determinar badge color
    let badgeColor = "bg-slate-200 text-slate-600";
    if (isGreen) badgeColor = "bg-emerald-100 text-emerald-700 border-emerald-200 border";
    if (["E", "F", "G"].includes(validRating)) badgeColor = "bg-red-100 text-red-700 border-red-200 border";

    // Effect to bubble up changes
    React.useEffect(() => {
        let discountDelta = 0;
        let yieldDelta = 0;

        if (isActive && !disabled) {
            // Logic: Only apply if user checked AND asset qualifies (or we allow simulation regardless?)
            // Let's allow simulation BUT warn if not qualified, or just allow it as "What if" scenario.
            // The prompt said: "If Class A or B... should suggest".
            // Let's allow toggling to see impact, but visualize qualification.

            if (applyGreenLoan) discountDelta = -0.5;
            if (applyGreenPremium) yieldDelta = -0.25;
        } else if (disabled && isActive) {
            setIsActive(false); // Auto-turn off if disabled
        }

        onModifiersChange({
            discountRateDelta: discountDelta,
            exitYieldDelta: yieldDelta
        });
    }, [isActive, applyGreenLoan, applyGreenPremium, onModifiersChange, disabled]);

    if (!energyRating) return null;

    return (
        <Card className={`border-none shadow-sm transition-colors duration-300 ${isActive ? 'bg-emerald-50/50' : 'bg-white'}`}>
            <CardHeader className="py-2 px-3 flex flex-row items-center justify-between space-y-0 pb-0">
                <CardTitle className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                    <div className={`p-1 rounded-full ${isActive ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        <Leaf className="h-3 w-3" />
                    </div>
                    Impacto Sostenibilidad
                </CardTitle>
                <div className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${badgeColor}`}>
                    Clase {validRating}
                </div>
            </CardHeader>
            <CardContent className="px-3 pb-3 pt-0 space-y-2">

                <div
                    onClick={() => !disabled && setIsActive(!isActive)}
                    className={`flex items-center justify-between p-2 rounded-md border transition-all ${disabled
                        ? 'bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed'
                        : isActive
                            ? 'bg-emerald-100 border-emerald-200 text-emerald-800 cursor-pointer'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer'
                        }`}
                >
                    <span className="text-xs font-semibold select-none flex items-center gap-2">
                        {isActive ? "Simulación Activa" : "Simular Impacto Verde"}
                    </span>
                    <Switch
                        checked={isActive}
                        onCheckedChange={!disabled ? setIsActive : undefined}
                        disabled={disabled}
                        className="scale-75 data-[state=checked]:bg-emerald-600"
                    />
                </div>

                {isActive && (
                    <div className="space-y-2 pt-2 border-t border-emerald-100 animate-in fade-in slide-in-from-top-1">

                        {/* Green Loan Option */}
                        <div className="flex items-start space-x-2">
                            <Checkbox
                                id="green-loan"
                                checked={applyGreenLoan}
                                onCheckedChange={(c) => setApplyGreenLoan(!!c)}
                                className="mt-0.5 h-3.5 w-3.5 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                            />
                            <div className="grid gap-0.5 leading-none">
                                <label
                                    htmlFor="green-loan"
                                    className="text-[11px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700 cursor-pointer"
                                >
                                    Green Loan (-0.5% Tasa)
                                </label>
                                <p className="text-[9px] text-slate-500 leading-tight">
                                    Reducción coste capital.
                                    {!isGreen && <span className="text-amber-600 ml-1">(Req. Clase A/B)</span>}
                                </p>
                            </div>
                        </div>

                        {/* Green Premium Option */}
                        <div className="flex items-start space-x-2">
                            <Checkbox
                                id="green-exit"
                                checked={applyGreenPremium}
                                onCheckedChange={(c) => setApplyGreenPremium(!!c)}
                                className="mt-0.5 h-3.5 w-3.5 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                            />
                            <div className="grid gap-0.5 leading-none">
                                <label
                                    htmlFor="green-exit"
                                    className="text-[11px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700 cursor-pointer"
                                >
                                    Prima Salida (-0.25% Yield)
                                </label>
                                <p className="text-[9px] text-slate-500 leading-tight">
                                    Mayor valor venta por eficiencia.
                                </p>
                            </div>
                        </div>

                    </div>
                )}
            </CardContent>
        </Card>
    );
};
