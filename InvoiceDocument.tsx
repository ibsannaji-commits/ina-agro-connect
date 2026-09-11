/**
 * INA Agro Connect — Invoice PDF with @react-pdf/renderer
 *
 * Install: npm install @react-pdf/renderer
 *
 * Usage (API route):
 *   import { renderToBuffer } from "@react-pdf/renderer";
 *   import { InvoiceDocument } from "@/lib/pdf/InvoiceDocument";
 *   const buffer = await renderToBuffer(<InvoiceDocument data={...} />);
 */

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

export type InvoiceData = {
  txRef: string;
  company: string;
  email: string;
  plan: string;
  billingCycle: string;
  amount: number;
  vat: number;
  total: number;
  paidAt: string;
  status: string;
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 3,
    borderBottomColor: "#1a7a4c",
    paddingBottom: 16,
    marginBottom: 28,
  },
  logo: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#1a7a4c",
  },
  logoSub: {
    fontSize: 9,
    color: "#5a6a5e",
    marginTop: 4,
  },
  invoiceTitle: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#1a7a4c",
    textAlign: "right",
  },
  invoiceRef: {
    fontSize: 9,
    color: "#5a6a5e",
    textAlign: "right",
    marginTop: 4,
  },
  meta: {
    flexDirection: "row",
    marginBottom: 28,
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 9,
    color: "#5a6a5e",
    textTransform: "uppercase",
    marginBottom: 6,
    letterSpacing: 1,
  },
  metaValue: {
    fontSize: 11,
    lineHeight: 1.5,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1.5,
    borderBottomColor: "#e2e8e4",
    paddingBottom: 8,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8e4",
    paddingVertical: 10,
  },
  colDesc: { flex: 3 },
  colAmount: { flex: 1, textAlign: "right" },
  th: {
    fontSize: 9,
    color: "#5a6a5e",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  totalRow: {
    flexDirection: "row",
    paddingTop: 14,
    marginTop: 4,
  },
  totalLabel: {
    flex: 3,
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
  },
  totalValue: {
    flex: 1,
    textAlign: "right",
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
    color: "#1a7a4c",
  },
  status: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: "#e2e8e4",
    paddingTop: 12,
    textAlign: "center",
    fontSize: 9,
    color: "#5a6a5e",
  },
});

export function InvoiceDocument({ data }: { data: InvoiceData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>INA Agro Connect</Text>
            <Text style={styles.logoSub}>
              Ethiopia&apos;s Agricultural Marketplace
            </Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceRef}>{data.txRef}</Text>
          </View>
        </View>

        {/* Meta */}
        <View style={styles.meta}>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Billed To</Text>
            <Text style={styles.metaValue}>{data.company}</Text>
            <Text style={styles.metaValue}>{data.email}</Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Payment Details</Text>
            <Text style={styles.metaValue}>Date: {data.paidAt}</Text>
            <Text style={styles.status}>{data.status}</Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.tableHeader}>
          <Text style={[styles.th, styles.colDesc]}>Description</Text>
          <Text style={[styles.th, styles.colAmount]}>Amount (ETB)</Text>
        </View>

        <View style={styles.tableRow}>
          <View style={styles.colDesc}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>{data.plan}</Text>
            <Text style={{ fontSize: 10, color: "#5a6a5e", marginTop: 2 }}>
              {data.billingCycle} subscription
            </Text>
          </View>
          <Text style={styles.colAmount}>{data.amount.toLocaleString()}</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.colDesc}>VAT (15%)</Text>
          <Text style={styles.colAmount}>{data.vat.toLocaleString()}</Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Paid</Text>
          <Text style={styles.totalValue}>
            {data.total.toLocaleString()} ETB
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>INA Agro Connect · Connecting Agriculture to Opportunity</Text>
          <Text>Ethiopia → Africa → Global · inaagroconnect.com</Text>
        </View>
      </Page>
    </Document>
  );
}
