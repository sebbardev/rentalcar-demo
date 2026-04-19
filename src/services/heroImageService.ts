// DEMO MODE: Using mock data instead of Laravel backend
import { mockHeroImages, MockHeroImage } from "../data/mockHeroImages";

export interface HeroImage {
  id: number;
  image_path: string;
  title: string | null;
  subtitle: string | null;
  order: number;
}

/**
 * DEMO: Get active hero images from mock data
 */
export async function getHeroImages(): Promise<HeroImage[]> {
  try {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return mockHeroImages
      .filter(img => img.active)
      .sort((a, b) => a.order - b.order)
      .map(img => ({
        id: parseInt(img.id),
        image_path: img.url,
        title: img.title || null,
        subtitle: img.subtitle || null,
        order: img.order
      }));
  } catch (error) {
    console.error("Error fetching hero images:", error);
    return [];
  }
}
