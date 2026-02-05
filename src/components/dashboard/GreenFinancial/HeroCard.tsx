import { CircleCheckIcon } from "lucide-react";
import type { Building } from "~/services/buildingsApi";

const HeroCard = ({ buildingData, alignmentScore }: { buildingData: Building | null, alignmentScore: number }) => {
  return (
    <div className="relative h-48 rounded-xl overflow-hidden shadow-lg">
      <img
        src={buildingData?.images?.find((v) => v?.isMain)?.url || buildingData?.images[0]?.url || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"}
        alt="Plaza Shopping"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h2 className="text-2xl mb-1">{buildingData?.name}</h2>
        <p className="text-sm text-gray-200">{buildingData?.address}</p>
      </div>
      <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg text-sm shadow-lg">
        <span className="flex items-center gap-2">
          <CircleCheckIcon className="w-4 h-4" />
          TAXONOMÍA ALINEADA ({alignmentScore}%)
        </span>
      </div>
    </div>
  );
};

export default HeroCard;
