// DEMO MODE: Using mock data instead of Laravel backend

export type UnavailabilityType = "MAINTENANCE" | "NETTOYAGE" | "PANNE" | "INDISPONIBLE";

export interface Unavailability {
  id: string;
  carId: string;
  startDate: string;
  endDate: string;
  type: UnavailabilityType | string;
  note: string | null;
}

// Mock unavailabilities for demo
const mockUnavailabilities: Unavailability[] = [
  {
    id: "1",
    carId: "1",
    startDate: "2025-02-15",
    endDate: "2025-02-17",
    type: "MAINTENANCE",
    note: "Vidange programmée"
  },
  {
    id: "2",
    carId: "2",
    startDate: "2025-02-20",
    endDate: "2025-02-20",
    type: "NETTOYAGE",
    note: "Nettoyage complet"
  }
];

export async function getUnavailabilities(params?: {
  from?: string;
  to?: string;
  carId?: string;
}): Promise<Unavailability[]> {
  try {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let data = [...mockUnavailabilities];
    
    // Filter by date range
    if (params?.from) {
      const fromDate = new Date(params.from);
      data = data.filter(u => new Date(u.endDate) >= fromDate);
    }
    if (params?.to) {
      const toDate = new Date(params.to);
      data = data.filter(u => new Date(u.startDate) <= toDate);
    }
    
    // Filter by carId
    if (params?.carId) {
      data = data.filter(u => u.carId === params.carId);
    }
    
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des indisponibilités:", error);
    return [];
  }
}

export async function createUnavailability(
  payload: {
    carId: string;
    startDate: string;
    endDate: string;
    type: UnavailabilityType | string;
    note?: string;
  },
  accessToken: string
): Promise<{ success: true; item: Unavailability } | { success: false; error: string }> {
  try {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // In demo mode, just log and return success
    const newItem: Unavailability = {
      id: String(mockUnavailabilities.length + 1),
      carId: payload.carId,
      startDate: payload.startDate,
      endDate: payload.endDate,
      type: payload.type,
      note: payload.note || null
    };
    
    console.log('[DEMO] Unavailability created:', newItem);
    return { success: true, item: newItem };
  } catch (error) {
    return { success: false, error: "Erreur réseau" };
  }
}

export async function deleteUnavailability(
  id: string,
  accessToken: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // In demo mode, just log and return success
    console.log('[DEMO] Unavailability deleted:', id);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erreur réseau" };
  }
}
