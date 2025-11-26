import { apiFetch } from "./api";


export interface TrazabilityFilters {
  buildingId?: string;
  userAuthId?: string;
  module?: string;
  action?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface UserEasy {
  fullName: string;
  id: string;
  email: string;
  roleId: string;
  userId: string
}

interface buildingEasy {
  id: string;
  name: string;
  address: string;
}

export interface trazabilityList {
  id?: string;
  description?: string;
  createdAt: string;
  user: UserEasy | null;
  building: buildingEasy | null;
   module?: string;
  action?: string;

}

export async function getTrazability(data?: any) {
  return apiFetch('/trazability/list', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
