import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Location de Voitures Maroc",
  description: "Panneau d'administration Premium Car Rental",
};

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}
