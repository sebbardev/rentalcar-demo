// Mock data for bookings

export interface MockBooking {
  id: string;
  car_id: string;
  customer_id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  start_date: string;
  end_date: string;
  location: string;
  return_location?: string;
  daily_price: string;
  total_price: string;
  status: string;
  created_at: string;
  updated_at: string;
  car?: {
    id: string;
    brand: string;
    model: string;
    category: string;
    image?: string;
  };
}

export const mockBookings: MockBooking[] = [
  {
    id: "1",
    car_id: "1",
    first_name: "Ahmed",
    last_name: "Benali",
    email: "ahmed.benali@email.com",
    phone: "+212 6 12 34 56 78",
    start_date: "2025-01-10",
    end_date: "2025-01-15",
    location: "Aéroport Mohammed V",
    return_location: "Aéroport Mohammed V",
    daily_price: "250",
    total_price: "1250",
    status: "completed",
    created_at: "2025-01-08T10:30:00Z",
    updated_at: "2025-01-15T18:00:00Z",
    car: {
      id: "1",
      brand: "Dacia",
      model: "Logan",
      category: "Économique",
      image: "/uploads/1775138469762-Voiture_Dacia_Logan_Diamonds_Blue_Auto.webp"
    }
  },
  {
    id: "2",
    car_id: "2",
    first_name: "Fatima",
    last_name: "El Mansouri",
    email: "fatima.mansouri@email.com",
    phone: "+212 6 98 76 54 32",
    start_date: "2025-01-20",
    end_date: "2025-01-25",
    location: "Casablanca Centre",
    return_location: "Rabat",
    daily_price: "350",
    total_price: "1750",
    status: "confirmed",
    created_at: "2025-01-18T14:20:00Z",
    updated_at: "2025-01-18T15:00:00Z",
    car: {
      id: "2",
      brand: "Renault",
      model: "Clio 5",
      category: "Compacte",
      image: "/uploads/1775315350591-Renault-Clio-5-restylee.jpg"
    }
  },
  {
    id: "3",
    car_id: "3",
    first_name: "Mohammed",
    last_name: "Tazi",
    email: "m.tazi@email.com",
    phone: "+212 6 55 44 33 22",
    start_date: "2025-02-01",
    end_date: "2025-02-05",
    location: "Marrakech",
    daily_price: "550",
    total_price: "2200",
    status: "pending",
    created_at: "2025-01-28T09:15:00Z",
    updated_at: "2025-01-28T09:15:00Z",
    car: {
      id: "3",
      brand: "Peugeot",
      model: "3008",
      category: "SUV",
      image: "/uploads/1775138460630-61.jpg"
    }
  },
  {
    id: "4",
    car_id: "1",
    first_name: "Sara",
    last_name: "Idrissi",
    email: "sara.idrissi@email.com",
    phone: "+212 6 11 22 33 44",
    start_date: "2025-02-10",
    end_date: "2025-02-12",
    location: "Fès",
    daily_price: "250",
    total_price: "500",
    status: "cancelled",
    created_at: "2025-02-05T16:45:00Z",
    updated_at: "2025-02-06T10:00:00Z",
    car: {
      id: "1",
      brand: "Dacia",
      model: "Logan",
      category: "Économique",
      image: "/uploads/1775138469762-Voiture_Dacia_Logan_Diamonds_Blue_Auto.webp"
    }
  }
];
