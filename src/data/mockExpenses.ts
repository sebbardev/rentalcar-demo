// Mock data for expenses

export interface MockExpense {
  id: string;
  car_id: string;
  type: string;
  amount: number;
  date: string;
  note?: string;
  is_automatic?: boolean;
  created_at: string;
  car?: {
    id: string;
    brand: string;
    model: string;
  };
}

export const mockExpenses: MockExpense[] = [
  {
    id: "1",
    car_id: "1",
    type: "assurance",
    amount: 3500,
    date: "2025-01-01",
    note: "Assurance annuelle",
    is_automatic: true,
    created_at: "2025-01-01T00:00:00Z",
    car: {
      id: "1",
      brand: "Dacia",
      model: "Logan"
    }
  },
  {
    id: "2",
    car_id: "1",
    type: "vignette",
    amount: 500,
    date: "2025-01-01",
    note: "Vignette 2025",
    is_automatic: true,
    created_at: "2025-01-01T00:00:00Z",
    car: {
      id: "1",
      brand: "Dacia",
      model: "Logan"
    }
  },
  {
    id: "3",
    car_id: "1",
    type: "maintenance",
    amount: 1200,
    date: "2025-01-15",
    note: "Vidange et filtre à huile",
    is_automatic: false,
    created_at: "2025-01-15T10:00:00Z",
    car: {
      id: "1",
      brand: "Dacia",
      model: "Logan"
    }
  },
  {
    id: "4",
    car_id: "2",
    type: "assurance",
    amount: 4500,
    date: "2025-01-01",
    note: "Assurance annuelle",
    is_automatic: true,
    created_at: "2025-01-01T00:00:00Z",
    car: {
      id: "2",
      brand: "Renault",
      model: "Clio 5"
    }
  },
  {
    id: "5",
    car_id: "2",
    type: "vignette",
    amount: 700,
    date: "2025-01-01",
    note: "Vignette 2025",
    is_automatic: true,
    created_at: "2025-01-01T00:00:00Z",
    car: {
      id: "2",
      brand: "Renault",
      model: "Clio 5"
    }
  },
  {
    id: "6",
    car_id: "3",
    type: "crédit",
    amount: 3500,
    date: "2025-01-10",
    note: "Mensualité crédit",
    is_automatic: true,
    created_at: "2025-01-10T00:00:00Z",
    car: {
      id: "3",
      brand: "Peugeot",
      model: "3008"
    }
  },
  {
    id: "7",
    car_id: "3",
    type: "assurance",
    amount: 6000,
    date: "2025-01-01",
    note: "Assurance annuelle",
    is_automatic: true,
    created_at: "2025-01-01T00:00:00Z",
    car: {
      id: "3",
      brand: "Peugeot",
      model: "3008"
    }
  },
  {
    id: "8",
    car_id: "3",
    type: "maintenance",
    amount: 2500,
    date: "2025-01-20",
    note: "Remplacement pneus",
    is_automatic: false,
    created_at: "2025-01-20T14:30:00Z",
    car: {
      id: "3",
      brand: "Peugeot",
      model: "3008"
    }
  }
];
