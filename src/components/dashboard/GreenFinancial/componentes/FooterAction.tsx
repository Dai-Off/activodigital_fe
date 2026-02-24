import React from "react";
import { SendIcon } from "lucide-react";

const FooterAction: React.FC<{ onOpen: () => void}> = ({ onOpen }) => {
  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <button
        onClick={onOpen}
        className="pointer-events-auto px-5 py-2.5 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 transition-all bg-[#1e3a8a] text-white hover:shadow-xl hover:bg-blue-800"
      >
        <SendIcon className="w-4 h-4" />
        Solicitar Financiación a Partners
      </button>
    </div>
  );
};

export default FooterAction;
