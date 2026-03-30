import React from 'react';
import { FinancialCalculatorV2 } from './FinancialCalculatorV2';

export const FinancialCalculatorPage: React.FC = () => {
    // Wrapper component to provide any necessary context or layout specifics for the page
    // For now, it simply renders the Calculator. 
    // We can add a distinct header or breadcrumbs here if needed later.
    return (
        <div className="flex-1 w-full flex flex-col min-h-screen bg-[#f4f7f9]">
            <FinancialCalculatorV2 key="v2-reset-defaults" />
        </div>
    );
};
