import React from "react";
import { SendIcon } from "lucide-react";

const FooterAction: React.FC<{ onOpen: () => void; isMobile?: boolean }> = ({ onOpen }) => {
  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <button
        onClick={onOpen}
        className="pointer-events-auto px-8 py-4 rounded-xl shadow-2xl text-lg flex items-center gap-3 transition-all bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white hover:shadow-xl hover:scale-105"
      >
        <SendIcon className="w-6 h-6" />
        Solicitar Financiación a Partners
      </button>
    </div>
  );
};

export default FooterAction;
