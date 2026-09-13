export type Product = {
  id: string;
  name: string;
  emoji: string;
  location: string;
  region: string;
  category: string;
  available: string;
  moq: string;
  rating: number;
  reviews: number;
  price: string;
  grade: string;
  harvest: string;
  moisture: string;
  packaging: string;
  description: string[];
  bullets: string[];
};

export const products: Product[] = [
  {
    id: "moringa-dried",
    name: "Premium Ethiopian Moringa — Dried Leaf Powder",
    emoji: "🌿",
    location: "Oromia, Ethiopia",
    region: "Oromia",
    category: "Herbs & Botanicals",
    available: "5 MT",
    moq: "500 kg",
    rating: 4.9,
    reviews: 24,
    price: "Negotiable",
    grade: "Grade A",
    harvest: "2026 Season",
    moisture: "< 8%",
    packaging: "25 kg kraft bags",
    description: [
      "Premium dried Moringa oleifera leaf powder sourced from carefully selected farms in the Oromia region of Ethiopia. Leaves are harvested at optimal maturity, shade-dried, and milled under hygienic conditions to preserve nutrients and color.",
      "Ideal for food, beverage, nutraceutical and cosmetic applications. Available in bulk quantities with flexible packaging options. Full traceability from farm to shipment.",
    ],
    bullets: [
      "100% pure Moringa leaf powder",
      "No additives or preservatives",
      "Low moisture for long shelf life",
      "Suitable for export markets",
    ],
  },
  {
    id: "coffee-grade1",
    name: "Grade 1 Ethiopian Coffee",
    emoji: "☕",
    location: "Sidama, Ethiopia",
    region: "Sidama",
    category: "Coffee",
    available: "20 MT",
    moq: "1 MT",
    rating: 4.8,
    reviews: 56,
    price: "Negotiable",
    grade: "Grade 1",
    harvest: "2026 Season",
    moisture: "< 11%",
    packaging: "60 kg jute bags",
    description: [
      "Fully washed Grade 1 Arabica coffee from the Sidama zone, grown at high altitude and processed at a certified washing station. Bright acidity with notes of citrus and berry.",
      "Sourced directly from smallholder cooperatives with full lot traceability. Available for immediate shipment and forward contracts.",
    ],
    bullets: [
      "Fully washed, sun-dried process",
      "Screen size 15+",
      "Cupping score 85+",
      "Traceable to washing station",
    ],
  },
  {
    id: "rosemary-organic",
    name: "Organic Rosemary Leaves",
    emoji: "🌿",
    location: "Amhara, Ethiopia",
    region: "Amhara",
    category: "Herbs & Botanicals",
    available: "3 MT",
    moq: "300 kg",
    rating: 4.7,
    reviews: 18,
    price: "Negotiable",
    grade: "Organic Certified",
    harvest: "2026 Season",
    moisture: "< 10%",
    packaging: "20 kg cartons",
    description: [
      "Organic-certified dried rosemary leaves grown in the highlands of Amhara. Hand-harvested and shade-dried to retain essential oil content and aroma.",
      "Suited for spice, essential oil extraction and herbal tea applications. Certificates of analysis available on request.",
    ],
    bullets: [
      "Certified organic",
      "High essential oil content",
      "Hand-sorted, free of foreign matter",
      "Suitable for extraction or whole-leaf use",
    ],
  },
  {
    id: "mango-fresh",
    name: "Ethiopian Fresh Mango (Keitt)",
    emoji: "🥭",
    location: "Oromia, Ethiopia",
    region: "Oromia",
    category: "Fruits",
    available: "10 MT",
    moq: "1 MT",
    rating: 4.6,
    reviews: 31,
    price: "Negotiable",
    grade: "Export Grade",
    harvest: "Seasonal — Jun–Sep",
    moisture: "N/A",
    packaging: "4kg cartons",
    description: [
      "Fresh Keitt mangoes grown along the Rift Valley, hand-picked at export maturity and pre-cooled before dispatch.",
      "Cold-chain logistics available for air and sea freight. Volume and delivery windows confirmed at booking.",
    ],
    bullets: [
      "Export-grade sizing and color",
      "Pre-cooled before dispatch",
      "Cold-chain export logistics available",
      "Seasonal availability window",
    ],
  },
  {
    id: "sesame-white",
    name: "Ethiopian White Sesame Seeds",
    emoji: "🌾",
    location: "Tigray, Ethiopia",
    region: "Tigray",
    category: "Grains",
    available: "15 MT",
    moq: "1 MT",
    rating: 4.9,
    reviews: 42,
    price: "Negotiable",
    grade: "99% Purity",
    harvest: "2026 Season",
    moisture: "< 6%",
    packaging: "50 kg PP bags",
    description: [
      "High-purity white sesame seeds sourced from Humera and surrounding growing areas, cleaned and sorted to export specification.",
      "Popular for oil extraction and confectionery. Purity and oil-content certificates provided per shipment.",
    ],
    bullets: [
      "99% purity, machine-cleaned",
      "Low FFA, high oil content",
      "Suitable for oil extraction and confectionery",
      "Fumigation certificate on request",
    ],
  },
  {
    id: "chili-birdseye",
    name: "Dried Bird's Eye Chili",
    emoji: "🌶️",
    location: "SNNPR, Ethiopia",
    region: "SNNPR",
    category: "Spices",
    available: "4 MT",
    moq: "500 kg",
    rating: 4.5,
    reviews: 15,
    price: "Negotiable",
    grade: "Grade A",
    harvest: "2026 Season",
    moisture: "< 10%",
    packaging: "25 kg jute bags",
    description: [
      "Sun-dried bird's eye chili with high Scoville rating, sorted for color and size uniformity.",
      "Well suited for chili powder, flake production and whole-pod export.",
    ],
    bullets: [
      "High Scoville rating",
      "Uniform color and size sorting",
      "Sun-dried, low moisture",
      "Whole pod or ground on request",
    ],
  },
];

export const categories = [
  { name: "Herbs & Botanicals", emoji: "🌿", count: 128 },
  { name: "Coffee", emoji: "☕", count: 96 },
  { name: "Spices", emoji: "🌶️", count: 84 },
  { name: "Grains", emoji: "🌾", count: 72 },
  { name: "Pulses", emoji: "🥜", count: 68 },
  { name: "Honey", emoji: "🍯", count: 45 },
  { name: "Moringa", emoji: "🌱", count: 38 },
  { name: "Rosemary", emoji: "🌿", count: 22 },
  { name: "Tea", emoji: "🍵", count: 31 },
  { name: "Fruits", emoji: "🥭", count: 27 },
  { name: "Vegetables", emoji: "🥬", count: 19 },
  { name: "Other", emoji: "📦", count: 16 },
];

export type StatusKind =
  | "open"
  | "processing"
  | "confirmed"
  | "shipped"
  | "closed";

export const statusStyles: Record<StatusKind, string> = {
  open: "bg-primary-100 text-primary-700",
  processing: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-violet-100 text-violet-700",
  closed: "bg-gray-100 text-gray-500",
};

export const buyerRfqs = [
  {
    id: "RFQ-2026-0912",
    title: "Grade 1 Coffee",
    detail: "10 MT · Destination: Dubai · 3 quotes received",
    icon: "☕",
    status: "open" as StatusKind,
    statusLabel: "Active",
  },
  {
    id: "RFQ-2026-0908",
    title: "Dried Moringa",
    detail: "5 MT · Destination: Netherlands · 1 quote",
    icon: "🌿",
    status: "processing" as StatusKind,
    statusLabel: "Reviewing",
  },
  {
    id: "RFQ-2026-0899",
    title: "Bird's Eye Chili",
    detail: "2 MT · Destination: Addis Ababa · Closed",
    icon: "🌶️",
    status: "confirmed" as StatusKind,
    statusLabel: "Awarded",
  },
];

export const buyerOrders = [
  {
    id: "ORD-INA-2026-00124",
    title: "Ethiopian Coffee",
    detail: "5 MT · Status: Quality Check → Ready for Shipping",
    icon: "☕",
    status: "processing" as StatusKind,
    statusLabel: "In Progress",
  },
];

export const sellerOrders = [
  {
    id: "ORD-2026-0156",
    title: "White Sesame Seed · 2,000 kg",
    detail: "Addis Ababa · May 23",
    icon: "🌾",
    status: "confirmed" as StatusKind,
    statusLabel: "Confirmed",
  },
  {
    id: "ORD-2026-0155",
    title: "Red Kidney Beans · 1,500 kg",
    detail: "Bahir Dar · May 22",
    icon: "🥜",
    status: "processing" as StatusKind,
    statusLabel: "Processing",
  },
  {
    id: "ORD-2026-0154",
    title: "Chickpeas · 3,000 kg",
    detail: "Dire Dawa · May 21",
    icon: "🫘",
    status: "shipped" as StatusKind,
    statusLabel: "Shipped",
  },
];

export const sellerRfqs = [
  {
    id: "RFQ-2026-0789",
    title: "Groundnuts · 5,000 kg",
    detail: "Addis Ababa · May 24",
    icon: "🥜",
    status: "open" as StatusKind,
    statusLabel: "Open",
  },
  {
    id: "RFQ-2026-0788",
    title: "Coffee (Washed) · 2,000 kg",
    detail: "Jimma · May 23",
    icon: "☕",
    status: "open" as StatusKind,
    statusLabel: "Open",
  },
  {
    id: "RFQ-2026-0787",
    title: "Soybean · 10,000 kg",
    detail: "Hawassa · May 21",
    icon: "🌱",
    status: "closed" as StatusKind,
    statusLabel: "Closed",
  },
];

export const adminVerifications = [
  {
    id: "green-valley",
    title: "Green Valley Exports",
    detail: "Business documents · Submitted 2h ago",
    icon: "🏢",
  },
  {
    id: "organic-teff",
    title: "Product: Organic Teff",
    detail: "Quality check · Supplier: Habesha Farms",
    icon: "🌿",
  },
  {
    id: "abebe-kebede",
    title: "Identity: Abebe Kebede",
    detail: "KYC documents · Submitted yesterday",
    icon: "👤",
  },
];

export const adminActivity = [
  {
    id: "order-128",
    title: "New Order #INA-2026-00128",
    detail: "5 MT Coffee · Value: under review",
    icon: "🛒",
    time: "12 min ago",
  },
  {
    id: "supplier-sidama",
    title: "New Supplier Registered",
    detail: "Sidama Coffee Cooperative",
    icon: "👤",
    time: "1h ago",
  },
  {
    id: "dispute-98",
    title: "Dispute Opened",
    detail: "Order #INA-2026-00098 · Quality claim",
    icon: "⚠️",
    time: "3h ago",
  },
];
