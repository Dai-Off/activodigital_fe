import { apiFetch } from "./api";

// Importamos los tipos exactos proporcionados por el usuario
import type {
  BuildingEvent,
  CreateEventRequest,
  UpdateEventRequest,
  EventFilters,
} from "../types/calendar";

export interface EventListResponse {
  data: BuildingEvent[];
  count: number;
}

export class CalendarApiService {
  /** 1. GET /calendar/events: Obtiene la lista de eventos de un edificio con filtros. */
  async getAllEvents(): Promise<EventListResponse> {
    const response = await apiFetch(`/calendar/all`, {
      method: "GET",
    });

    return response;
  }

  async getBuildingEvents(
    buildingId: string,
    filters: EventFilters = {}
  ): Promise<EventListResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append("buildingId", buildingId);

    // Adjuntar filtros de manera dinámica
    if (filters.category) {
      queryParams.append("category", filters.category);
    }
    if (filters.priority) {
      queryParams.append("priority", filters.priority);
    }
    if (filters.status) {
      queryParams.append("status", filters.status);
    }
    // Filtros de rango de fechas
    if (filters.startDate) {
      queryParams.append("startDate", filters.startDate);
    }
    if (filters.endDate) {
      queryParams.append("endDate", filters.endDate);
    }
    // Paginación
    if (filters.limit) {
      queryParams.append("limit", filters.limit.toString());
    }

    // Nota: Asumo que la ruta base para este módulo es /calendar/events
    const response = await apiFetch(`/calendar?${queryParams.toString()}`, {
      method: "GET",
    });

    return response;
  }

  /** 2. GET /calendar/events/:id: Obtiene el detalle de un evento específico. */
  async getEventById(eventId: string): Promise<BuildingEvent | null> {
    try {
      const response = await apiFetch(`/calendar/events/${eventId}`, {
        method: "GET",
      });
      // Devolvemos el evento o el detalle de la respuesta
      return response.data || response;
    } catch (error) {
      console.error("Error al obtener detalle del evento:", error);
      return null;
    }
  }

  /** 3. POST /calendar/events: Crea un nuevo evento. */
  async createEvent(payload: CreateEventRequest): Promise<boolean> {
    try {
      const response = await apiFetch(`/calendar/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      // Asumo que una respuesta exitosa, aunque vacía, es suficiente.
      return !!response;
    } catch (error) {
      console.error("Error al crear evento:", error);
      return false;
    }
  }

  /** 4. PUT /calendar/events/:id: Actualiza un evento existente. */
  async updateEvent(
    eventId: string,
    payload: UpdateEventRequest
  ): Promise<boolean> {
    try {
      const response = await apiFetch(`/calendar/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      return !!response;
    } catch (error) {
      console.error("Error al actualizar evento:", error);
      return false;
    }
  }

  /** 5. DELETE /calendar/events/:id: Elimina un evento. */
  async deleteEvent(eventId: string): Promise<boolean> {
    try {
      const response = await apiFetch(`/calendar/events/${eventId}`, {
        method: "DELETE",
      });
      return response.success || true; // Asumo que el backend retorna 'success'
    } catch (error) {
      console.error("Error al eliminar evento:", error);
      return false;
    }
  }
}

export const calendarApiService = new CalendarApiService();
