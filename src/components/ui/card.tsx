import React from "react";

export const Card: React.FC<{ className?: string; onClick?: () => void; role?: string; tabIndex?: number; onKeyDown?: (e: React.KeyboardEvent) => void; children: React.ReactNode }> = ({ className = "", onClick, role, tabIndex, onKeyDown, children }) => (
  <div className={`rounded-2xl shadow-lg ${className}`} onClick={onClick} role={role} tabIndex={tabIndex} onKeyDown={onKeyDown}>
    {children}
  </div>
);
