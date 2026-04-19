// DEMO MODE: Using mock data instead of Laravel backend
import { getAllCars } from "./carService";
import { getAllBookings } from "./bookingService";
import { getExpenses } from "./expenseService";

export interface CarProfitDetail {
  id: string;
  brand: string;
  model: string;
  image?: string;
  total_revenue: number;
  total_expenses: number;
  profit: number;
  revenue_details: Array<{
    id: string;
    customer: string;
    amount: number;
    date: string;
  }>;
  expense_details: Array<{
    id: string;
    type: string;
    amount: number;
    date: string;
  }>;
}

export interface Stats {
  totalCars: number;
  activeBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalRevenue: number;
  totalExpenses: number;
  netGain: number;
  monthlyData: Array<{
    name: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
  expenseTypeStats: Array<{
    type: string;
    amount: number;
  }>;
  carsProfit: CarProfitDetail[];
  recentBookings: any[];
  pendingReturns?: Array<{
    id: string;
    car_id: string;
    car: { brand?: string; model?: string; image?: string };
    first_name: string;
    last_name: string;
    start_date: string;
    end_date: string;
    status: string;
  }>;
  carAvailability: {
    available: number;
    unavailable: number;
  };
}

export interface CarDetailedStats {
  car: {
    id: string;
    brand: string;
    model: string;
    image: string;
  };
  totalRevenue: number;
  totalExpenses: number;
  netGain: number;
  bookingCount: number;
  totalDaysRented: number;
  occupancyRate: number;
  monthlyData: Array<{
    name: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
  expenseTypeStats: Array<{
    type: string;
    amount: number;
  }>;
  bookings: any[];
  expenses: any[];
}

export async function getStats(): Promise<Stats> {
  try {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const [cars, bookings, expenses] = await Promise.all([
      getAllCars(),
      getAllBookings(),
      getExpenses(),
    ]);

    const carsList = Array.isArray(cars) ? cars : [];
    const bookingsList = bookings.data || [];
    const expensesList = Array.isArray(expenses) ? expenses : [];

    // Calculate stats
    const totalCars = carsList.length;
    const activeBookings = bookingsList.filter(b => b.status === 'confirmed' || b.status === 'active').length;
    const pendingBookings = bookingsList.filter(b => b.status === 'pending').length;
    const completedBookings = bookingsList.filter(b => b.status === 'completed').length;
    const totalRevenue = bookingsList
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + b.totalPrice, 0);
    const totalExpenses = expensesList.reduce((sum: number, e: any) => sum + e.amount, 0);
    const netGain = totalRevenue - totalExpenses;

    // Cars profit details
    const carsProfit: CarProfitDetail[] = carsList.map(car => {
      const carBookings = bookingsList.filter(b => b.carId === car.id && b.status !== 'cancelled');
      const carExpenses = expensesList.filter((e: any) => e.car_id === car.id);
      
      const total_revenue = carBookings.reduce((sum, b) => sum + b.totalPrice, 0);
      const total_expenses = carExpenses.reduce((sum: number, e: any) => sum + e.amount, 0);
      
      return {
        id: car.id,
        brand: car.brand,
        model: car.model,
        image: car.image,
        total_revenue,
        total_expenses,
        profit: total_revenue - total_expenses,
        revenue_details: carBookings.map(b => ({
          id: b.id,
          customer: `${b.firstName} ${b.lastName}`,
          amount: b.totalPrice,
          date: b.startDate
        })),
        expense_details: carExpenses.map((e: any) => ({
          id: e.id,
          type: e.type,
          amount: e.amount,
          date: e.date
        }))
      };
    });

    return {
      totalCars,
      activeBookings,
      pendingBookings,
      completedBookings,
      totalRevenue,
      totalExpenses,
      netGain,
      monthlyData: [],
      expenseTypeStats: [],
      carsProfit,
      recentBookings: bookingsList.slice(0, 10),
      pendingReturns: [],
      carAvailability: {
        available: carsList.filter(c => c.available).length,
        unavailable: carsList.filter(c => !c.available).length,
      }
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return {
      totalCars: 0,
      activeBookings: 0,
      pendingBookings: 0,
      completedBookings: 0,
      totalRevenue: 0,
      totalExpenses: 0,
      netGain: 0,
      monthlyData: [],
      expenseTypeStats: [],
      carsProfit: [],
      recentBookings: [],
      pendingReturns: [],
      carAvailability: {
        available: 0,
        unavailable: 0,
      }
    };
  }
}

export async function getCarDetailedStats(id: string): Promise<CarDetailedStats | null> {
  try {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const [cars, bookings, expenses] = await Promise.all([
      getAllCars(),
      getAllBookings(),
      getExpenses(),
    ]);

    const car = (Array.isArray(cars) ? cars : []).find(c => c.id === id);
    if (!car) return null;

    const carBookings = (bookings.data || []).filter(b => b.carId === id);
    const carExpenses = (Array.isArray(expenses) ? expenses : []).filter((e: any) => e.car_id === id);

    const totalRevenue = carBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const totalExpenses = carExpenses.reduce((sum: number, e: any) => sum + e.amount, 0);
    
    const totalDaysRented = carBookings.reduce((days, b) => {
      const start = new Date(b.startDate);
      const end = new Date(b.endDate);
      return days + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    }, 0);

    return {
      car: {
        id: car.id,
        brand: car.brand,
        model: car.model,
        image: car.image
      },
      totalRevenue,
      totalExpenses,
      netGain: totalRevenue - totalExpenses,
      bookingCount: carBookings.length,
      totalDaysRented,
      occupancyRate: 0,
      monthlyData: [],
      expenseTypeStats: [],
      bookings: carBookings,
      expenses: carExpenses
    };
  } catch (error) {
    console.error(`Erreur lors de la récupération des statistiques pour la voiture ${id}:`, error);
    return null;
  }
}
