import { StyleSheet, Font } from "@react-pdf/renderer";

// Registering standard fonts (using system fonts for PDF compatibility)
// Note: In a production environment, you might want to load custom .ttf files for full consistency.

export const PDF_COLORS = {
  primary: "#06668C", // Navy Blue - Main Brand Color (from globals.css)
  secondary: "#427AA1", // Medium Blue - Accents
  accent: "#679436", // Forest Green - Buttons/CTA
  highlight: "#A4BD01", // Lime Green - Highlights
  bg: "#EBF2FA", // Off-white - Main Background
  textMain: "#1C2942", // Dark text for contrast
  textMuted: "#4a5568", // Muted text
  white: "#ffffff",
  border: "#E2E8F0",
  lightGray: "#F8FAFC",
  darkBg: "#1C2942", // Marine Profond
};

export const pdfStyles = StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: PDF_COLORS.white,
    fontFamily: "Helvetica",
    color: PDF_COLORS.textMain,
    fontSize: 10,
    lineHeight: 1.5,
  },
  // Header with gradient background
  header: {
    backgroundColor: PDF_COLORS.primary,
    padding: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoContainer: {
    width: 140,
    height: 140,
    backgroundColor: PDF_COLORS.white,
    borderRadius: 20,
    padding: 10,
  },
  companyInfo: {
    textAlign: "right",
    color: PDF_COLORS.white,
  },
  companyName: {
    fontSize: 24,
    fontWeight: "bold",
    color: PDF_COLORS.white,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  companyDetails: {
    fontSize: 9,
    color: PDF_COLORS.white,
    opacity: 0.9,
    marginBottom: 3,
  },
  // Content wrapper
  content: {
    padding: 40,
  },
  titleSection: {
    marginBottom: 40,
    textAlign: "center",
    paddingBottom: 20,
    borderBottomWidth: 3,
    borderBottomColor: PDF_COLORS.primary,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: PDF_COLORS.primary,
    textTransform: "uppercase",
    marginBottom: 8,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 11,
    color: PDF_COLORS.textMuted,
    letterSpacing: 3,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: PDF_COLORS.bg,
    padding: 12,
    marginBottom: 15,
    borderLeftWidth: 6,
    borderLeftColor: PDF_COLORS.primary,
    color: PDF_COLORS.primary,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  gridCol: {
    flex: 1,
    minWidth: "45%",
    marginBottom: 15,
    padding: 12,
    backgroundColor: PDF_COLORS.lightGray,
    borderRadius: 8,
  },
  label: {
    fontSize: 9,
    color: PDF_COLORS.textMuted,
    textTransform: "uppercase",
    fontWeight: "bold",
    marginBottom: 4,
    letterSpacing: 1,
  },
  value: {
    fontSize: 12,
    color: PDF_COLORS.textMain,
    fontWeight: "bold",
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: PDF_COLORS.border,
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: PDF_COLORS.border,
    minHeight: 25,
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: PDF_COLORS.lightGray,
    fontWeight: "bold",
  },
  tableCell: {
    padding: 5,
    flex: 1,
  },
  // Financial summary box
  financialBox: {
    backgroundColor: PDF_COLORS.primary,
    borderRadius: 20,
    padding: 30,
    marginTop: 30,
    marginBottom: 30,
  },
  financialLabel: {
    fontSize: 11,
    color: PDF_COLORS.white,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 8,
    opacity: 0.8,
    fontWeight: "bold",
  },
  financialAmount: {
    fontSize: 36,
    color: PDF_COLORS.white,
    fontWeight: "bold",
    letterSpacing: -1,
  },
  financialCurrency: {
    fontSize: 16,
    color: PDF_COLORS.white,
    opacity: 0.7,
    marginLeft: 8,
  },
  financialDetails: {
    fontSize: 10,
    color: PDF_COLORS.white,
    opacity: 0.9,
    textAlign: "right",
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 2,
    borderTopColor: PDF_COLORS.primary,
    paddingTop: 15,
    textAlign: "center",
    fontSize: 9,
    color: PDF_COLORS.textMuted,
    letterSpacing: 0.5,
  },
  signatureSection: {
    marginTop: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 30,
  },
  signatureBox: {
    width: "45%",
    borderTopWidth: 2,
    borderTopColor: PDF_COLORS.primary,
    paddingTop: 15,
    marginTop: 80,
  },
  signatureLabel: {
    textAlign: "center",
    fontSize: 11,
    fontWeight: "bold",
    color: PDF_COLORS.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
