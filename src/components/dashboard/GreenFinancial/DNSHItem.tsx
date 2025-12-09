import React from "react";
import { Button } from "~/components/ui/button";
import { InfoIcon } from "lucide-react";

interface Props {
  icon: React.ReactNode;
  title: string;
  short: string;
  expandedText: string;
  isOpen: boolean;
  onToggle: () => void;
}

const DNSHItem: React.FC<Props> = ({ icon, title, short, expandedText, isOpen, onToggle }) => {
  return (
    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3">
      <div className="flex items-start gap-3">
        <div className="bg-green-100 p-2 rounded-lg text-green-600">{icon}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-900">{title}</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-green-600">100%</span>
              <Button className="focus:outline-none p-0" onClick={onToggle}>
                <InfoIcon className={`w-3 h-3 text-gray-${isOpen ? "900" : "400"}`} />
              </Button>
            </div>
          </div>

          <p className="text-xs text-gray-700">{short}</p>

          {isOpen && (
            <div className="mt-3 pt-3 border-t border-gray-300 bg-white rounded-lg p-3">
              <p className="text-xs text-gray-700 leading-relaxed">{expandedText}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DNSHItem;
