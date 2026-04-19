// DEMO MODE: Using mock data instead of Laravel backend
import { mockBookings, MockBooking } from "../data/mockBookings";

export interface Booking {
  id: string;
  carId: string;
  car: {
    brand: string;
    model: string;
    category: string;
    image?: string;
  };
  startDate: string;
  endDate: string;
  totalPrice: number;
  dailyPrice?: number | null;
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  returnLocation?: string | null;
  createdAt: string;
}

function mapMockBookingToFrontend(mockBooking: MockBooking): Booking {
  return {
    id: mockBooking.id.toString(),
    carId: mockBooking.car_id?.toString(),
    car: {
      brand: mockBooking.car?.brand || "Inconnu",
      model: mockBooking.car?.model || "",
      category: mockBooking.car?.category || "Berline",
      image: mockBooking.car?.image,
    },
    startDate: mockBooking.start_date,
    endDate: mockBooking.end_date,
    totalPrice: parseFloat(mockBooking.total_price),
    dailyPrice: mockBooking.daily_price !== undefined && mockBooking.daily_price !== null
      ? parseFloat(mockBooking.daily_price)
      : null,
    status: mockBooking.status,
    firstName: mockBooking.first_name,
    lastName: mockBooking.last_name,
    email: mockBooking.email,
    phone: mockBooking.phone,
    location: mockBooking.location,
    returnLocation: mockBooking.return_location ?? null,
    createdAt: mockBooking.created_at,
  };
}

export interface BookingPagination {
  data: Booking[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  sort_by?: string;
  sort_order?: string;
}

export async function getAllBookings(
  page: number = 1, 
  perPage: number = 15,
  sortBy: string = 'created_at',
  sortOrder: string = 'desc'
): Promise<BookingPagination> {
  try {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let data = [...mockBookings];
    
    // Sort
    data.sort((a, b) => {
      const aVal = a[sortBy as keyof MockBooking] || '';
      const bVal = b[sortBy as keyof MockBooking] || '';
      return sortOrder === 'desc' 
        ? String(bVal).localeCompare(String(aVal))
        : String(aVal).localeCompare(String(bVal));
    });
    
    // Paginate
    const total = data.length;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginatedData = data.slice(start, end);
    
    return {
      data: paginatedData.map(mapMockBookingToFrontend),
      current_page: page,
      last_page: Math.ceil(total / perPage),
      per_page: perPage,
      total: total,
      from: start + 1,
      to: Math.min(end, total),
      sort_by: sortBy,
      sort_order: sortOrder,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations:", error);
    return {
      data: [],
      current_page: page,
      last_page: 1,
      per_page: perPage,
      total: 0,
      from: 0,
      to: 0,
      sort_by: sortBy,
      sort_order: sortOrder,
    };
  }
}

export async function getBookingsByRange(params: {
  from: string;
  to: string;
  carId?: string;
}): Promise<Booking[]> {
  try {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let data = mockBookings.filter(booking => {
      const bookingStart = new Date(booking.start_date);
      const bookingEnd = new Date(booking.end_date);
      const rangeStart = new Date(params.from);
      const rangeEnd = new Date(params.to);
      
      const inRange = bookingStart <= rangeEnd && bookingEnd >= rangeStart;
      const matchesCar = !params.carId || booking.car_id === params.carId;
      
      return inRange && matchesCar;
    });
    
    return data.map(mapMockBookingToFrontend);
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations (range):", error);
    return [];
  }
}

export async function updateBookingStatus(id: string, status: string, adminId?: string): Promise<boolean> {
  try {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // In demo mode, we just log the update
    console.log(`[DEMO] Réservation ${id} mise à jour vers ${status} par l'admin ${adminId || 'système'}`);
    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    return false;
  }
}

export async function createBooking(bookingData: any): Promise<Booking | null> {
  try {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // In demo mode, create a mock booking
    const newBooking: MockBooking = {
      id: String(mockBookings.length + 1),
      car_id: bookingData.car_id,
      first_name: bookingData.first_name,
      last_name: bookingData.last_name,
      email: bookingData.email,
      phone: bookingData.phone,
      start_date: bookingData.start_date,
      end_date: bookingData.end_date,
      location: bookingData.location,
      return_location: bookingData.return_location,
      daily_price: String(bookingData.daily_price || 0),
      total_price: String(bookingData.total_price || 0),
      status: bookingData.status || 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    return mapMockBookingToFrontend(newBooking);
  } catch (error) {
    console.error("Erreur lors de la création de la réservation:", error);
    throw error;
  }
}

export async function createBookingAdmin(params: {
  accessToken: string;
  carId: string;
  customerId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  returnLocation?: string;
  dailyPrice: number;
  status?: string;
}): Promise<{ success: true; booking: Booking } | { success: false; error: string }> {
  try {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // In demo mode, create a mock booking
    const newBooking: MockBooking = {
      id: String(mockBookings.length + 1),
      car_id: params.carId,
      first_name: params.firstName,
      last_name: params.lastName,
      email: params.email,
      phone: params.phone,
      start_date: params.startDate,
      end_date: params.endDate,
      location: params.pickupLocation,
      return_location: params.returnLocation,
      daily_price: String(params.dailyPrice),
      total_price: String(params.dailyPrice * Math.ceil(
        (new Date(params.endDate).getTime() - new Date(params.startDate).getTime()) / (1000 * 60 * 60 * 24)
      )),
      status: params.status || 'confirmed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    return { success: true, booking: mapMockBookingToFrontend(newBooking) };
  } catch (error) {
    return { success: false, error: "Erreur réseau" };
  }
}
