import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { measurePerformance } from "@/lib/performance";

const inter = Inter({ subsets: ["latin"], display: 'swap' });

export const metadata: Metadata = {
  title: "Location de Voitures Maroc - Agence Premium",
  description: "Louez votre voiture au Maroc au meilleur prix. Large choix de véhicules, réservation simple et rapide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
        <div id="modal-root"></div>
        
        {/* Performance monitoring in development */}
        {process.env.NODE_ENV === 'development' && (
          <script dangerouslySetInnerHTML={{
            __html: `(${measurePerformance.toString()})()`
          }} />
        )}
      </body>
    </html>
  );
}
