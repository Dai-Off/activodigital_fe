import { create } from "zustand";

interface HeaderStore {
  selectedBuildingId: string | null
  setSelectedBuildingId: (id: string | null) => void
}

const useHeaderContext = create<HeaderStore>((set) => ({
  selectedBuildingId: null,

  setSelectedBuildingId: (id) =>
    set({ selectedBuildingId: id }),
}))

export default useHeaderContext
