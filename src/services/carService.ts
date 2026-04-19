// DEMO MODE: Using mock data instead of Laravel backend
import { mockCars, MockCar } from "../data/mockCars";

// Interface pour correspondre à ce que le frontend attend
export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  currency: string;
  fuel: string;
  transmission: string;
  category: string;
  image: string;
  images: string[];
  description: string;
  features: string[];
  deposit: number;
  available: boolean;
  plateNumber?: string;
  plateLetter?: string;
  plateCityCode?: string;
  formattedPlate?: string;
  // Financial Parameters
  has_credit: boolean;
  monthly_credit?: number;
  credit_start_date?: string;
  credit_end_date?: string;
  credit_payment_day?: number;
  annual_insurance?: number;
  insurance_expiry_date?: string;
  annual_vignette?: number;
  vignette_expiry_date?: string;
}

// DEMO: Using mock data - no API calls needed
const API_URL = "";

// DEMO: Cache removed - using local data

// DEMO: fetchWithCache removed - using local data

/**
 * DEMO: Mappe un objet MockCar vers l'interface Car du frontend
 */
function mapMockCarToFrontend(mockCar: MockCar): Car {
  if (!mockCar) return {} as Car;
  
  return {
    id: mockCar.id || "",
    name: `${mockCar.brand || ""} ${mockCar.model || ""}`,
    brand: mockCar.brand || "",
    model: mockCar.model || "",
    year: mockCar.year || new Date().getFullYear(),
    pricePerDay: parseFloat(mockCar.price_per_day || "0"),
    currency: mockCar.currency || "MAD",
    fuel: mockCar.fuel || "",
    transmission: mockCar.transmission || "",
    category: mockCar.category || "",
    image: mockCar.image || "",
    images: Array.isArray(mockCar.images) ? mockCar.images : [],
    description: mockCar.description || "",
    features: Array.isArray(mockCar.features) ? mockCar.features : [],
    deposit: parseFloat(mockCar.deposit || "0"),
    available: Boolean(mockCar.available),
    plateNumber: mockCar.plate_number,
    plateLetter: mockCar.plate_letter,
    plateCityCode: mockCar.plate_city_code,
    formattedPlate: mockCar.formatted_plate,
    // Financial mapping
    has_credit: Boolean(mockCar.has_credit),
    monthly_credit: parseFloat(mockCar.monthly_credit || "0"),
    credit_start_date: mockCar.credit_start_date,
    credit_end_date: mockCar.credit_end_date,
    credit_payment_day: parseInt(mockCar.credit_payment_day || "1"),
    annual_insurance: parseFloat(mockCar.annual_insurance || "0"),
    insurance_expiry_date: mockCar.insurance_expiry_date,
    annual_vignette: parseFloat(mockCar.annual_vignette || "0"),
    vignette_expiry_date: mockCar.vignette_expiry_date,
  };
}

/**
 * DEMO: Récupère tous les véhicules depuis les données mock
 */
export async function getAllCars(): Promise<Car[]> {
  try {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockCars.map(mapMockCarToFrontend);
  } catch (error) {
    console.error("Erreur lors de la récupération des voitures:", error);
    return [];
  }
}

/**
 * DEMO: Récupère un véhicule spécifique par son ID depuis les données mock
 */
export async function getCarById(id: string): Promise<Car | null> {
  try {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    const mockCar = mockCars.find(car => car.id === id);
    return mockCar ? mapMockCarToFrontend(mockCar) : null;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la voiture ${id}:`, error);
    return null;
  }
}

/**
 * DEMO: Récupère les véhicules mis en avant depuis les données mock
 */
export async function getFeaturedCars(limit = 3): Promise<Car[]> {
  try {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    // Return last 'limit' cars as featured
    const featured = mockCars.slice(-limit);
    return featured.map(mapMockCarToFrontend);
  } catch (error) {
    console.error("Erreur lors de la récupération des voitures vedettes:", error);
    return [];
  }
}
