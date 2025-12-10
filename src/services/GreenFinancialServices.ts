import type { RegistroTable as BuildingOpportunity } from '~/components/dashboard/GreenFinancial/OpportunityRadar';
// import { apiFetch } from './api';
// import { data } from 'react-router-dom';

export const buildingData: BuildingOpportunity[] = [
  {
    id: "1",
    activo: "Plaza Shopping",
    direccion: "Carretera de Miraflores, Colmenar Viejo",
    tipo: "Comercial",
    estado_actual: "D",
    potencial: { letra: "A", variacion: "-50%" },
    tir: { valor: "18.5%", plazo: "5 años" },
    cash_on_cash: { valor: "11.5%", multiplicador: "2.4x" },
    capex: { total: "1.35M", descripcion: "Inversión Total" },
    subvencion: { valor: "270k", porcentaje: "20% CAPEX" },
    green_premium: { valor: "+2.43M", roi: "180% ROI" },
    plazo: "8m",
    taxonomia: { porcentaje: "90%" },
    estado: { etiqueta: "Bank-Ready", score: "92%" }
  },
  {
    id: "2",
    activo: "Torre Norte",
    direccion: "Avenida del Norte 145, Madrid",
    tipo: "Residencial",
    estado_actual: "B",
    potencial: { letra: "B", variacion: "-50%" },
    tir: { valor: "18.5%", plazo: "5 años" },
    cash_on_cash: { valor: "11.5%", multiplicador: "2.4x" },
    capex: { total: "1.13M", descripcion: "Inversión Total" },
    subvencion: { valor: "225k", porcentaje: "20% CAPEX" },
    green_premium: { valor: "+2.02M", roi: "180% ROI" },
    plazo: "8m",
    taxonomia: { porcentaje: "90%" },
    estado: { etiqueta: "Bank-Ready", score: "92%" }
  },
  {
    id: "3",
    activo: "Edificio Central",
    direccion: "Calle Central 89, Madrid",
    tipo: "Mixto",
    estado_actual: "C",
    potencial: { letra: "B", variacion: "-50%" },
    tir: { valor: "18.5%", plazo: "5 años" },
    cash_on_cash: { valor: "11.5%", multiplicador: "2.4x" },
    capex: { total: "0.80M", descripcion: "Inversión Total" },
    subvencion: { valor: "160k", porcentaje: "20% CAPEX" },
    green_premium: { valor: "+1.44M", roi: "180% ROI" },
    plazo: "8m",
    taxonomia: { porcentaje: "90%" },
    estado: { etiqueta: "Bank-Ready", score: "92%" }
  },
  {
    id: "4",
    activo: "Residencial Vista Alegre",
    direccion: "Calle Vista Alegre 42, Madrid",
    tipo: "Residencial",
    estado_actual: "A",
    potencial: { letra: "B", variacion: "-50%" },
    tir: { valor: "18.5%", plazo: "5 años" },
    cash_on_cash: { valor: "11.5%", multiplicador: "2.4x" },
    capex: { total: "1.30M", descripcion: "Inversión Total" },
    subvencion: { valor: "260k", porcentaje: "20% CAPEX" },
    green_premium: { valor: "+2.34M", roi: "180% ROI" },
    plazo: "8m",
    taxonomia: { porcentaje: "90%" },
    estado: { etiqueta: "Bank-Ready", score: "92%" }
  },
  {
    id: "5",
    activo: "Oficinas Parque Empresarial",
    direccion: "Parque Empresarial Las Rozas, Edificio A",
    tipo: "Comercial",
    estado_actual: "A",
    potencial: { letra: "B", variacion: "-50%" },
    tir: { valor: "18.5%", plazo: "5 años" },
    cash_on_cash: { valor: "11.5%", multiplicador: "2.4x" },
    capex: { total: "0.95M", descripcion: "Inversión Total" },
    subvencion: { valor: "190k", porcentaje: "20% CAPEX" },
    green_premium: { valor: "+1.71M", roi: "180% ROI" },
    plazo: "8m",
    taxonomia: { porcentaje: "90%" },
    estado: { etiqueta: "Bank-Ready", score: "92%" }
  },
  { id: "6", activo: "Oficinas Parque Empresarial", direccion: "Parque Empresarial Las Rozas, Edificio A", tipo: "Comercial", estado_actual: "A", potencial: { letra: "B", variacion: "-50%" }, tir: { valor: "18.5%", plazo: "5 anos" }, cash_on_cash: { valor: "11.5%", multiplicador: "2.4x" }, capex: { total: "0.95M", descripcion: "Inversion Total" }, subvencion: { valor: "190k", porcentaje: "20% CAPEX" }, green_premium: { valor: "+1.71M", roi: "180% ROI" }, plazo: "8m", taxonomia: { porcentaje: "90%" }, estado: { etiqueta: "Pendientes", score: "50%", pendientes: "docs 2" } }
];


export class FinancialGreenService {

  static async getAll(): Promise<BuildingOpportunity[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let data : BuildingOpportunity[]
    // const response =  await apiFetch('/financial-green');
    // data = response?.data
    data = buildingData;
    return data;
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
