import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  Font,
} from "@react-pdf/renderer";
import { pdfStyles, PDF_COLORS } from "./PremiumPdfTheme";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ContractPdfProps {
  contract: any; // Using any for now to handle backend data structure
}

const ContractPdf: React.FC<ContractPdfProps> = ({ contract }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: fr });
    } catch (e) {
      return dateString;
    }
  };

  const formatPrice = (amount: number) => {
    return amount.toLocaleString() + " MAD";
  };

  return (
    <Document title={`Contrat_Location_${contract.id}`}>
      <Page size="A4" style={pdfStyles.page}>
        {/* Premium Header with Background Color */}
        <View style={pdfStyles.header}>
          <View style={pdfStyles.logoContainer}>
            <Image src="/rentalcar-logo.png" />
          </View>
          <View style={pdfStyles.companyInfo}>
            <Text style={pdfStyles.companyName}>ORIENT DRIVE</Text>
            <Text style={pdfStyles.companyDetails}>Avenue de France, Casablanca, Maroc</Text>
            <Text style={pdfStyles.companyDetails}>Tél: +212 522 00 00 00 | contact@orientdrive.ma</Text>
            <Text style={pdfStyles.companyDetails}>RC: 12345 | ICE: 00987654321</Text>
          </View>
        </View>

        {/* Content Wrapper */}
        <View style={pdfStyles.content}>
          {/* Title */}
          <View style={pdfStyles.titleSection}>
            <Text style={pdfStyles.mainTitle}>CONTRAT DE LOCATION</Text>
            <Text style={pdfStyles.subtitle}>RÉFÉRENCE : #{contract.id}</Text>
          </View>

        {/* Client Section */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>INFORMATIONS DU LOCATAIRE</Text>
          <View style={pdfStyles.grid}>
            <View style={pdfStyles.gridCol}>
              <Text style={pdfStyles.label}>Nom complet</Text>
              <Text style={pdfStyles.value}>{contract.driver_first_name} {contract.driver_last_name}</Text>
            </View>
            <View style={pdfStyles.gridCol}>
              <Text style={pdfStyles.label}>Contact</Text>
              <Text style={pdfStyles.value}>{contract.driver_email} / {contract.driver_phone}</Text>
            </View>
            <View style={pdfStyles.gridCol}>
              <Text style={pdfStyles.label}>Numéro de permis</Text>
              <Text style={pdfStyles.value}>{contract.driver_license_number || "Non renseigné"}</Text>
            </View>
            <View style={pdfStyles.gridCol}>
              <Text style={pdfStyles.label}>N° CIN / Passeport</Text>
              <Text style={pdfStyles.value}>{contract.driver_cin_number || "Non renseigné"}</Text>
            </View>
          </View>
        </View>

        {/* Vehicle Section */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>DÉTAILS DU VÉHICULE</Text>
          <View style={pdfStyles.grid}>
            <View style={pdfStyles.gridCol}>
              <Text style={pdfStyles.label}>Marque & Modèle</Text>
              <Text style={pdfStyles.value}>{contract.car?.brand} {contract.car?.model}</Text>
            </View>
            <View style={pdfStyles.gridCol}>
              <Text style={pdfStyles.label}>Immatriculation</Text>
              <Text style={pdfStyles.value}>
                {contract.car?.plate_number} | {contract.car?.plate_letter} | {contract.car?.plate_city_code}
              </Text>
            </View>
            <View style={pdfStyles.gridCol}>
              <Text style={pdfStyles.label}>Kilométrage au départ</Text>
              <Text style={pdfStyles.value}>{contract.start_mileage || "—"} KM</Text>
            </View>
            <View style={pdfStyles.gridCol}>
              <Text style={pdfStyles.label}>Niveau de carburant</Text>
              <Text style={pdfStyles.value}>{contract.start_fuel_level || "—"} / 8</Text>
            </View>
          </View>
        </View>

        {/* Rental Terms Section */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>CONDITIONS DE LOCATION</Text>
          <View style={pdfStyles.grid}>
            <View style={pdfStyles.gridCol}>
              <Text style={pdfStyles.label}>Date de départ</Text>
              <Text style={pdfStyles.value}>{formatDate(contract.start_date)}</Text>
            </View>
            <View style={pdfStyles.gridCol}>
              <Text style={pdfStyles.label}>Date de retour prévue</Text>
              <Text style={pdfStyles.value}>{formatDate(contract.end_date)}</Text>
            </View>
            <View style={pdfStyles.gridCol}>
              <Text style={pdfStyles.label}>Lieu de départ</Text>
              <Text style={pdfStyles.value}>{contract.pickup_location || "Agence Casablanca"}</Text>
            </View>
            <View style={pdfStyles.gridCol}>
              <Text style={pdfStyles.label}>Lieu de retour</Text>
              <Text style={pdfStyles.value}>{contract.return_location || "Agence Casablanca"}</Text>
            </View>
          </View>
        </View>

          {/* Financial Section - Premium Box */}
          <View style={pdfStyles.financialBox}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
              <View>
                <Text style={pdfStyles.financialLabel}>MONTANT TOTAL DE LA LOCATION</Text>
                <Text style={pdfStyles.financialAmount}>
                  {formatPrice(contract.total_price)}
                </Text>
              </View>
              <View style={{ textAlign: "right" }}>
                <Text style={pdfStyles.financialDetails}>
                  Tarif journalier : {formatPrice(contract.daily_rate || (contract.total_price / 1))} / JOUR
                </Text>
                <Text style={pdfStyles.financialDetails}>
                  Caution : {formatPrice(contract.deposit_amount || 0)}
                </Text>
              </View>
            </View>
          </View>

          {/* Signature Section */}
          <View style={pdfStyles.signatureSection}>
            <View style={pdfStyles.signatureBox}>
              <Text style={pdfStyles.signatureLabel}>Signature du Locataire</Text>
              <Text style={{ fontSize: 9, textAlign: "center", marginTop: 50, color: PDF_COLORS.textMuted, fontStyle: "italic" }}>
                (Précédé de la mention "Lu et approuvé")
              </Text>
            </View>
            <View style={pdfStyles.signatureBox}>
              <Text style={pdfStyles.signatureLabel}>Cachet & Signature Agence</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={pdfStyles.footer} fixed>
          <Text>ORIENT DRIVE - Location de Voitures Premium | Casablanca, Maroc</Text>
          <Text>Généré le {format(new Date(), "dd/MM/yyyy HH:mm")} | Document officiel</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ContractPdf;
