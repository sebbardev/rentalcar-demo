import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import ContractPdf from "@/components/admin/pdf/ContractPdf";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    // 1. Récupérer les données du contrat en JSON au lieu du blob PDF
    const response = await fetch(`${API_URL}/contracts/${params.id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({ message: "Contrat non trouvé" }, { status: 404 });
    }

    const contractData = await response.json();

    // 2. Générer le PDF avec le thème Premium
    const buffer = await renderToBuffer(React.createElement(ContractPdf, { contract: contractData }) as any);

    return new NextResponse(buffer as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Contrat_Premium_${params.id}.pdf"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return NextResponse.json({ message: "Erreur lors de la génération du PDF" }, { status: 500 });
  }
}