import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { Info } from 'lucide-react';

export interface RichTooltipProps {
    trigger?: React.ReactNode;
    title: string;
    description: string;
    goldenRule?: {
        label?: string;
        text: string;
    };
    examples?: {
        label?: string;
        items: React.ReactNode[];
    };
    footer?: string;
    className?: string;
}

export const RichTooltip: React.FC<RichTooltipProps> = ({
    trigger,
    title,
    description,
    goldenRule,
    examples,
    footer,
    className
}) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                    {trigger || <Info className="h-3 w-3 text-blue-300 cursor-pointer hover:text-white" />}
                </TooltipTrigger>
                <TooltipContent className={`max-w-[300px] text-xs p-3 bg-white shadow-xl border border-slate-200 select-none z-50 text-slate-700 ${className}`}>
                    <p className="font-bold mb-1 text-base text-slate-900">{title}</p>
                    <p className="mb-2 text-slate-600 leading-relaxed">{description}</p>

                    {goldenRule && (
                        <div className="bg-slate-100 p-2 rounded mb-2 text-slate-800 border border-slate-200/50">
                            <p className="font-bold text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">
                                {goldenRule.label || "REGLA DE ORO:"}
                            </p>
                            <p className="italic text-slate-700">{goldenRule.text}</p>
                        </div>
                    )}

                    {examples && examples.items.length > 0 && (
                        <div className="mb-2">
                            <p className="font-semibold text-[10px] text-slate-400 mb-1 uppercase tracking-wider">
                                {examples.label || "EJEMPLOS:"}
                            </p>
                            <ul className="list-disc pl-4 space-y-1 text-slate-600">
                                {examples.items.map((item, idx) => (
                                    <li key={idx} className="leading-tight">{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {footer && (
                        <div className="mt-2 pt-2 border-t border-slate-100">
                            <p className="text-[10px] text-slate-400 italic">
                                {footer}
                            </p>
                        </div>
                    )}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
