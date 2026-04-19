// Mock data for hero images

export interface MockHeroImage {
  id: string;
  url: string;
  title?: string;
  subtitle?: string;
  order: number;
  active: boolean;
  created_at: string;
}

export const mockHeroImages: MockHeroImage[] = [
  {
    id: "1",
    url: "/uploads/1775315350591-Renault-Clio-5-restylee.jpg",
    title: "Renault Clio 5",
    subtitle: "Élégante et moderne - À partir de 350 DH/jour",
    order: 1,
    active: true,
    created_at: "2025-01-01T00:00:00Z"
  },
  {
    id: "2",
    url: "/uploads/1775138469762-Voiture_Dacia_Logan_Diamonds_Blue_Auto.webp",
    title: "Dacia Logan",
    subtitle: "Fiable et économique - À partir de 250 DH/jour",
    order: 2,
    active: true,
    created_at: "2025-01-01T00:00:00Z"
  },
  {
    id: "3",
    url: "/uploads/1775315354943-renault-clio-5-esprit-alpine-avant-scaled.jpg",
    title: "Clio 5 Esprit Alpine",
    subtitle: "Version sportive premium - À partir de 450 DH/jour",
    order: 3,
    active: true,
    created_at: "2025-01-01T00:00:00Z"
  }
];
