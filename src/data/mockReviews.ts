// Mock data for reviews

export interface MockReview {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  car_id?: string;
  created_at: string;
}

export const mockReviews: MockReview[] = [
  {
    id: "1",
    customer_name: "Ahmed B.",
    rating: 5,
    comment: "Excellent service! Voiture propre et en parfait état. Je recommande vivement.",
    car_id: "1",
    created_at: "2025-01-16T10:00:00Z"
  },
  {
    id: "2",
    customer_name: "Fatima E.",
    rating: 4,
    comment: "Très bon rapport qualité-prix. Service client réactif et professionnel.",
    car_id: "2",
    created_at: "2025-01-26T14:30:00Z"
  },
  {
    id: "3",
    customer_name: "Mohammed T.",
    rating: 5,
    comment: "Parfait pour notre voyage en famille. Voiture spacieuse et confortable.",
    car_id: "3",
    created_at: "2025-02-06T09:15:00Z"
  },
  {
    id: "4",
    customer_name: "Sara I.",
    rating: 4,
    comment: "Bonne expérience globale. Processus de location simple et rapide.",
    car_id: "1",
    created_at: "2025-01-13T16:45:00Z"
  }
];
