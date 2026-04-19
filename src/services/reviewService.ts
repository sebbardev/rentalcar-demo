// DEMO MODE: Using mock data instead of Laravel backend
import { mockReviews, MockReview } from "../data/mockReviews";

export interface Review {
  id: number;
  name: string;
  role: string | null;
  rating: number;
  content: string;
  created_at: string;
}

export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
}

export interface ReviewsResponse {
  data: Review[];
  average_rating: number;
  total_reviews: number;
}

/**
 * DEMO: Get all approved reviews from mock data
 */
export async function getReviews(): Promise<ReviewsResponse> {
  try {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const data: Review[] = mockReviews.map(r => ({
      id: parseInt(r.id),
      name: r.customer_name,
      role: null,
      rating: r.rating,
      content: r.comment,
      created_at: r.created_at
    }));
    
    const average_rating = data.length > 0 
      ? data.reduce((sum, r) => sum + r.rating, 0) / data.length 
      : 0;
    
    return { 
      data, 
      average_rating: Math.round(average_rating * 10) / 10,
      total_reviews: data.length 
    };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return { data: [], average_rating: 0, total_reviews: 0 };
  }
}

/**
 * DEMO: Submit a new review (simulated)
 */
export async function submitReview(reviewData: {
  name: string;
  email: string;
  role?: string;
  rating: number;
  content: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log('[DEMO] Review submitted:', reviewData);
    return { success: true, message: "Avis soumis avec succès" };
  } catch (error: any) {
    console.error("Error submitting review:", error);
    return { success: false, message: error.message || "Erreur de connexion" };
  }
}

/**
 * DEMO: Get all reviews for admin (from mock data)
 */
export async function getAdminReviews(token: string): Promise<Review[]> {
  try {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return mockReviews.map(r => ({
      id: parseInt(r.id),
      name: r.customer_name,
      role: null,
      rating: r.rating,
      content: r.comment,
      created_at: r.created_at
    }));
  } catch (error) {
    console.error("Error fetching admin reviews:", error);
    return [];
  }
}

/**
 * DEMO: Approve or reject a review (simulated)
 */
export async function updateReviewStatus(
  token: string,
  reviewId: number,
  isApproved: boolean
): Promise<{ success: boolean; message: string }> {
  try {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log(`[DEMO] Review ${reviewId} ${isApproved ? 'approved' : 'rejected'}`);
    return { success: true, message: "Statut mis à jour" };
  } catch (error: any) {
    return { success: false, message: error.message || "Erreur de connexion" };
  }
}

/**
 * DEMO: Delete a review (simulated)
 */
export async function deleteReview(
  token: string,
  reviewId: number
): Promise<{ success: boolean; message: string }> {
  try {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log(`[DEMO] Review ${reviewId} deleted`);
    return { success: true, message: "Avis supprimé" };
  } catch (error: any) {
    return { success: false, message: error.message || "Erreur de connexion" };
  }
}
