// Mock data for demonstration purposes (no backend required)

export interface MockCar {
  id: string;
  brand: string;
  model: string;
  year: number;
  price_per_day: string;
  currency: string;
  fuel: string;
  transmission: string;
  category: string;
  image: string;
  images: string[];
  description: string;
  features: string[];
  deposit: string;
  available: boolean;
  plate_number?: string;
  plate_letter?: string;
  plate_city_code?: string;
  formatted_plate?: string;
  has_credit: boolean;
  monthly_credit?: string;
  credit_start_date?: string;
  credit_end_date?: string;
  credit_payment_day?: string;
  annual_insurance?: string;
  insurance_expiry_date?: string;
  annual_vignette?: string;
  vignette_expiry_date?: string;
}

export const mockCars: MockCar[] = [
  {
    id: "1",
    brand: "Dacia",
    model: "Logan",
    year: 2023,
    price_per_day: "250",
    currency: "MAD",
    fuel: "Essence",
    transmission: "Manuelle",
    category: "Économique",
    image: "/uploads/1775138469762-Voiture_Dacia_Logan_Diamonds_Blue_Auto.webp",
    images: [
      "/uploads/1775138469762-Voiture_Dacia_Logan_Diamonds_Blue_Auto.webp",
      "/uploads/1775138472128-3-7.webp",
      "/uploads/1775138475010-dacia-2-1674844432.webp"
    ],
    description: "Voiture économique et fiable, parfaite pour la ville et les longs trajets.",
    features: ["Climatisation", "Bluetooth", "GPS", "4 portes"],
    deposit: "2000",
    available: true,
    plate_number: "12345",
    plate_letter: "A",
    plate_city_code: "13",
    formatted_plate: "12345 - A - 13",
    has_credit: true,
    monthly_credit: "1500",
    credit_start_date: "2024-01-01",
    credit_end_date: "2026-12-31",
    credit_payment_day: "5",
    annual_insurance: "3500",
    insurance_expiry_date: "2025-12-31",
    annual_vignette: "500",
    vignette_expiry_date: "2025-12-31"
  },
  {
    id: "2",
    brand: "Renault",
    model: "Clio 5",
    year: 2023,
    price_per_day: "350",
    currency: "MAD",
    fuel: "Diesel",
    transmission: "Automatique",
    category: "Compacte",
    image: "/uploads/1775315350591-Renault-Clio-5-restylee.jpg",
    images: [
      "/uploads/1775315350591-Renault-Clio-5-restylee.jpg",
      "/uploads/1775315354858-photos-essai-renault-clio-5-2019-075.webp",
      "/uploads/1775315354943-renault-clio-5-esprit-alpine-avant-scaled.jpg"
    ],
    description: "Citadine moderne et confortable avec toutes les options.",
    features: ["Climatisation automatique", "Caméra de recul", "Apple CarPlay", "Android Auto"],
    deposit: "3000",
    available: true,
    plate_number: "67890",
    plate_letter: "B",
    plate_city_code: "13",
    formatted_plate: "67890 - B - 13",
    has_credit: false,
    annual_insurance: "4500",
    insurance_expiry_date: "2025-11-30",
    annual_vignette: "700",
    vignette_expiry_date: "2025-12-31"
  },
  
];
