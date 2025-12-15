import type { RegistroTable as BuildingOpportunity, FinancialSnapshotSummary } from '~/components/dashboard/GreenFinancial/OpportunityRadar';
// import data from './datasetstry.json'
import { apiFetch } from './api';
export let buildingData: BuildingOpportunity[]


export class FinancialGreenService {

  static async getAll(): Promise<BuildingOpportunity[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let response = await apiFetch("/financial-snapshots", { method: "GET" })
    return response?.data;
  }

  static async getsumary(): Promise<FinancialSnapshotSummary> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let response = await apiFetch("/financial-snapshots/summary")
    return response?.data;
  }


  static async getById(id: string): Promise<BuildingOpportunity | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const match = buildingData.find((item: any) => item.id === id);
    return match || null;
  }

  static async search(query: string): Promise<BuildingOpportunity[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const q = query.toLowerCase().trim();

    if (!q) return buildingData;

    return buildingData.filter((item: any) =>
      Object.values(item).some((value: any) =>
        String(value).toLowerCase().includes(q)
      )
    );
  }
}
