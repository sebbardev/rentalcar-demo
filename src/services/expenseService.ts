// DEMO MODE: Using mock data instead of Laravel backend
import { getAllCars, Car } from "./carService";
import { getAllBookings, Booking } from "./bookingService";
import { mockExpenses, MockExpense } from "../data/mockExpenses";

export interface Expense {
  id: string;
  car_id: string;
  type: string;
  amount: number;
  date: string;
  note?: string;
  car?: {
    brand: string;
    model: string;
  };
  createdAt: string;
}

export interface ExpenseDashboard {
  summary: {
    total_revenue: number;
    total_expenses: number;
    total_net_gain: number;
    credit_total?: number;
    break_even_ratio?: number;
  };
  per_car: Array<{
    car_id: string;
    brand: string;
    model: string;
    total_revenue: number;
    total_expenses: number;
    credit_amount?: number;
    maintenance_amount?: number;
    net_gain: number;
  }>;
  upcoming_expenses?: Array<{
    date: string;
    label: string;
    amount: number;
    type: string;
  }>;
  low_profit_cars?: Array<{
    car_id: string;
    brand: string;
    model: string;
    revenue: number;
    expenses: number;
    profit: number;
    reason: string;
  }>;
}

export async function getExpenses(params?: {
  car_id?: string;
  type?: string;
  from?: string;
  to?: string;
}) {
  try {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let data = [...mockExpenses];
    
    // Filter by car_id
    if (params?.car_id) {
      data = data.filter(e => e.car_id === params.car_id);
    }
    
    // Filter by type
    if (params?.type) {
      data = data.filter(e => e.type === params.type);
    }
    
    // Filter by date range
    if (params?.from) {
      const fromDate = new Date(params.from);
      data = data.filter(e => new Date(e.date) >= fromDate);
    }
    if (params?.to) {
      const toDate = new Date(params.to);
      data = data.filter(e => new Date(e.date) <= toDate);
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return [];
  }
}

export async function createExpense(data: any, accessToken: string) {
  try {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // In demo mode, just log and return success
    console.log('[DEMO] Expense created:', data);
    return { success: true, data: { ...data, id: String(mockExpenses.length + 1) } };
  } catch (error: any) {
    return { success: false, error: "Erreur lors de la création" };
  }
}

export async function updateExpense(id: string, data: any, accessToken: string) {
  try {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // In demo mode, just log and return success
    console.log('[DEMO] Expense updated:', id, data);
    return { success: true, data: { ...data, id } };
  } catch (error: any) {
    return { success: false, error: "Erreur lors de la mise à jour" };
  }
}

export async function deleteExpense(id: string, accessToken: string) {
  try {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // In demo mode, just log and return success
    console.log('[DEMO] Expense deleted:', id);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Erreur lors de la suppression" };
  }
}

export async function getExpenseDashboard(params?: { 
  car_id?: string; 
  period?: string; // 'month', 'quarter', 'year', 'all'
  from?: string;
  to?: string;
}): Promise<ExpenseDashboard | null> {
  try {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const [cars, bookings, expenses] = await Promise.all([
      getAllCars(),
      getAllBookings(),
      getExpenses(params),
    ]);

    const now = new Date();
    let startDate: Date;
    let endDate = now;

    // Déterminer la période de calcul
    if (params?.from && params?.to) {
      startDate = new Date(params.from);
      endDate = new Date(params.to);
    } else {
      switch (params?.period) {
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'quarter':
          const quarter = Math.floor(now.getMonth() / 3);
          startDate = new Date(now.getFullYear(), quarter * 3, 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        case 'all':
        default:
          startDate = new Date(0);
          break;
      }
    }

    // Calculer les statistiques par véhicule
    const perCarStats = cars.map(car => {
      const carBookings = bookings.data.filter(b => {
        const bookingDate = new Date(b.startDate);
        return b.carId === car.id && 
               b.status !== "CANCELLED" &&
               bookingDate >= startDate && 
               bookingDate <= endDate;
      });
      const totalRevenue = carBookings.reduce((sum, b) => sum + b.totalPrice, 0);

      const carExpenses = expenses.filter((e: any) => {
        const expenseDate = new Date(e.date);
        return e.car_id === car.id &&
               expenseDate >= startDate && 
               expenseDate <= endDate;
      });
      
      const totalExpenses = carExpenses.reduce((sum: number, e: any) => sum + e.amount, 0);
      
      const manualExpenses = carExpenses.filter((e: any) => !e.is_automatic);
      const automaticExpenses = carExpenses.filter((e: any) => e.is_automatic);
      
      const creditAmount = automaticExpenses
        .filter((e: any) => e.type === 'crédit')
        .reduce((sum: number, e: any) => sum + e.amount, 0);
      
      const maintenanceAmount = manualExpenses.reduce((sum: number, e: any) => sum + e.amount, 0) +
        automaticExpenses
          .filter((e: any) => ['assurance', 'vignette'].includes(e.type))
          .reduce((sum: number, e: any) => sum + e.amount, 0);

      const netGain = Math.round((totalRevenue - totalExpenses) * 100) / 100;

      return {
        car_id: car.id,
        brand: car.brand,
        model: car.model,
        total_revenue: totalRevenue,
        total_expenses: totalExpenses,
        credit_amount: creditAmount,
        maintenance_amount: maintenanceAmount,
        net_gain: netGain,
        alerts: []
      };
    });

    const totalRevenue = perCarStats.reduce((sum, s) => sum + s.total_revenue, 0);
    const totalExpenses = perCarStats.reduce((sum, s) => sum + s.total_expenses, 0);
    const creditTotal = perCarStats.reduce((sum, s) => sum + (s.credit_amount || 0), 0);
    const totalNetGain = totalRevenue - totalExpenses;
    const breakEvenRatio = totalExpenses > 0 ? (totalRevenue / totalExpenses) * 100 : (totalRevenue > 0 ? 100 : 0);

    return {
      summary: {
        total_revenue: totalRevenue,
        total_expenses: totalExpenses,
        total_net_gain: totalNetGain,
        credit_total: creditTotal,
        break_even_ratio: breakEvenRatio,
      },
      per_car: perCarStats,
      low_profit_cars: [],
      upcoming_expenses: [],
    };
  } catch (error) {
    console.error("Error calculating expense dashboard:", error);
    return null;
  }
}
