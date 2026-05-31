import type { DashboardOrder, TimelineEvent } from "@/types";

export const dashboardStats = [
  {
    label: "Active requests",
    value: "148",
    delta: "+18%",
    detail: "Across 19 states, routed from Nasarawa desks"
  },
  {
    label: "Procurement value",
    value: "NGN 82.4m",
    delta: "+11%",
    detail: "Month to date"
  },
  {
    label: "On-time delivery",
    value: "94%",
    delta: "+4%",
    detail: "Keffi, Lafia, Karu, and Akwanga lanes"
  },
  {
    label: "Open disputes",
    value: "7",
    delta: "-22%",
    detail: "2 awaiting customer evidence"
  }
];

export const orders: DashboardOrder[] = [
  {
    id: "ord_9012",
    requestNumber: "NRP-2026-0418",
    customer: "Aminu Retail Stores",
    title: "Premium sesame seed, 120 bags",
    destination: "Kano, Kano",
    market: "Lafia Main Market",
    amount: 18450000,
    status: "QUALITY_CHECK",
    paymentStatus: "PAID",
    eta: "May 22"
  },
  {
    id: "ord_9013",
    requestNumber: "NRP-2026-0419",
    customer: "Blue Coast Foods",
    title: "Dried hibiscus, export grade",
    destination: "Apapa, Lagos",
    market: "Keffi Produce Line",
    amount: 12800000,
    status: "IN_TRANSIT",
    paymentStatus: "PAID",
    eta: "May 20"
  },
  {
    id: "ord_9014",
    requestNumber: "NRP-2026-0420",
    customer: "Enugu Wholesale Co.",
    title: "Yam tubers, mixed sizes",
    destination: "Nsukka, Enugu",
    market: "Akwanga Aggregation Yard",
    amount: 7350000,
    status: "QUOTED",
    paymentStatus: "INITIATED",
    eta: "Pending"
  },
  {
    id: "ord_9015",
    requestNumber: "NRP-2026-0421",
    customer: "Jos Agro Partners",
    title: "Groundnut oil cartons",
    destination: "Jos North, Plateau",
    market: "Karu Trade Cluster",
    amount: 4920000,
    status: "DISPUTED",
    paymentStatus: "PAID",
    eta: "Review"
  }
];

export const trackingTimeline: TimelineEvent[] = [
  {
    title: "Quotation accepted",
    description: "Customer approved market quote and payment reference was generated.",
    timestamp: "May 18, 09:12",
    status: "done"
  },
  {
    title: "Payment confirmed",
    description: "Provider webhook verified and transaction log reconciled.",
    timestamp: "May 18, 09:18",
    status: "done"
  },
  {
    title: "Quality check",
    description: "Procurement officer is matching bags against customer reference images.",
    timestamp: "May 18, 14:40",
    status: "current"
  },
  {
    title: "Dispatch booking",
    description: "Logistics team will assign carrier after inspection is complete.",
    timestamp: "May 19",
    status: "upcoming"
  }
];

export const transactionLogs = [
  {
    id: "txn_5710",
    event: "PAYMENT_CAPTURE",
    actor: "Paystack webhook",
    amount: 18450000,
    order: "NRP-2026-0418",
    time: "09:18"
  },
  {
    id: "txn_5711",
    event: "QUOTE_CREATED",
    actor: "Fatima Bello",
    amount: 7350000,
    order: "NRP-2026-0420",
    time: "10:05"
  },
  {
    id: "txn_5712",
    event: "REFUND_REVIEW",
    actor: "Dispute desk",
    amount: 4920000,
    order: "NRP-2026-0421",
    time: "11:42"
  }
];

export const auditTrail = [
  {
    actor: "Admin",
    action: "STATUS_CHANGE",
    entity: "NRP-2026-0418",
    detail: "PROCUREMENT_STARTED to QUALITY_CHECK",
    time: "14:40"
  },
  {
    actor: "Procurement officer",
    action: "UPDATE",
    entity: "NRP-2026-0418",
    detail: "Uploaded inspection note",
    time: "14:16"
  },
  {
    actor: "Customer",
    action: "CREATE",
    entity: "NRP-2026-0421",
    detail: "Opened delivery quality dispute",
    time: "13:02"
  }
];

export const disputes = [
  {
    id: "DSP-1082",
    order: "NRP-2026-0421",
    reason: "Quality mismatch",
    status: "UNDER_REVIEW",
    owner: "Dispute desk",
    age: "5h",
    level: "L1" as const
  },
  {
    id: "DSP-1083",
    order: "NRP-2026-0399",
    reason: "Late delivery",
    status: "WAITING_ON_VENDOR",
    owner: "Logistics lead",
    age: "1d",
    level: "L2" as const
  }
];

export const marketNodes = [
  {
    name: "Lafia Main Market",
    lga: "Lafia LGA",
    role: "State capital procurement desk",
    commodities: ["sesame", "soybeans", "yam", "maize"],
    verification: "Trader association contact verified",
    signal: "High sesame availability, medium truck congestion",
    confidence: 92
  },
  {
    name: "Keffi Central Market",
    lga: "Keffi LGA",
    role: "Abuja corridor aggregation point",
    commodities: ["hibiscus", "groundnut", "livestock inputs", "grains"],
    verification: "Market address and pickup zone recorded",
    signal: "Fast access to Abuja, prices moving on grains",
    confidence: 88
  },
  {
    name: "Akwanga Modern Market",
    lga: "Akwanga LGA",
    role: "Northern Nasarawa consolidation node",
    commodities: ["yam", "rice", "maize", "vegetables"],
    verification: "Market-day officer assigned",
    signal: "Good yam supply, weather-sensitive dispatch window",
    confidence: 84
  },
  {
    name: "Nasarawa Eggon Modern Market",
    lga: "Nasarawa Eggon LGA",
    role: "Hill produce and rural supply desk",
    commodities: ["maize", "sorghum", "millet", "pepper"],
    verification: "Supplier references under review",
    signal: "Moderate grain supply, inspect packaging closely",
    confidence: 76
  },
  {
    name: "Karu and Mararaba corridor",
    lga: "Karu LGA",
    role: "FCT-adjacent fulfillment corridor",
    commodities: ["retail food supply", "building materials", "general trade"],
    verification: "Carrier pickup partners verified",
    signal: "Strong delivery access, traffic risk after 4 PM",
    confidence: 90
  }
];

export const verificationChecks = [
  {
    label: "Registered buyer profile",
    status: "Verified",
    detail: "Email, phone, and delivery contact checked before quote acceptance."
  },
  {
    label: "Market officer identity",
    status: "Verified",
    detail: "Officer assignment is logged against the request before sourcing begins."
  },
  {
    label: "Supplier reference",
    status: "In review",
    detail: "Trader reference, stall location, and prior transaction notes are attached."
  },
  {
    label: "Payment release control",
    status: "Protected",
    detail: "Procurement starts only after payment webhook and transaction log match."
  }
];

export const procurementProgression = [
  {
    stage: "Request intake",
    owner: "Customer desk",
    evidence: "Product notes, budget, delivery address, reference images",
    status: "Complete"
  },
  {
    stage: "Market sourcing",
    owner: "Lafia officer",
    evidence: "Supplier calls, market-day price sheet, availability notes",
    status: "Complete"
  },
  {
    stage: "Quote control",
    owner: "Admin reviewer",
    evidence: "Goods subtotal, service fee, transport estimate, validity period",
    status: "Complete"
  },
  {
    stage: "Inspection",
    owner: "Quality desk",
    evidence: "Bag count, moisture check, packaging photos, officer note",
    status: "Active"
  },
  {
    stage: "Dispatch release",
    owner: "Logistics desk",
    evidence: "Carrier manifest, pickup photo, waybill, tracking event",
    status: "Queued"
  }
];

export const transportUpdates = [
  {
    lane: "Lafia Main Market to Kano",
    carrier: "NorthLink Haulage",
    vehicle: "Canter truck, KTN-442LA",
    driver: "Musa A.",
    checkpoint: "Akwanga weigh point cleared",
    eta: "May 22, 18:00",
    risk: "Medium",
    nextAction: "Confirm night stop before Kaduna bypass"
  },
  {
    lane: "Keffi Central Market to Apapa",
    carrier: "BlueRoad Logistics",
    vehicle: "Closed-body truck, APP-318KD",
    driver: "Chinedu O.",
    checkpoint: "Abuja outbound manifest accepted",
    eta: "May 20, 11:30",
    risk: "Low",
    nextAction: "Send customer port-entry notice"
  },
  {
    lane: "Akwanga Modern Market to Nsukka",
    carrier: "EastGate Dispatch",
    vehicle: "Pickup van, ENU-229AX",
    driver: "Grace E.",
    checkpoint: "Awaiting quality release",
    eta: "Pending",
    risk: "Watch",
    nextAction: "Book loading crew after inspection photos"
  }
];

export const inspectionEvidence = [
  {
    title: "Sesame bag count",
    order: "NRP-2026-0418",
    market: "Lafia Main Market",
    result: "120 bags counted, 118 passed first check",
    evidence: "Scale reading, seal photos, bag stitching closeups",
    reviewer: "Quality desk",
    status: "Active review"
  },
  {
    title: "Hibiscus color check",
    order: "NRP-2026-0419",
    market: "Keffi Central Market",
    result: "Color, dryness, and foreign matter within quote tolerance",
    evidence: "Tray sample images, supplier stall photo, dispatch label",
    reviewer: "Procurement lead",
    status: "Cleared"
  },
  {
    title: "Yam tuber grading",
    order: "NRP-2026-0420",
    market: "Akwanga Modern Market",
    result: "Mixed sizes need customer approval before payment",
    evidence: "Reference comparison, crate sample, officer voice note",
    reviewer: "Customer desk",
    status: "Needs approval"
  }
];

export const whatsappEscalations = [
  {
    step: "Trigger",
    title: "Customer asks for urgent help",
    detail: "The order page opens WhatsApp with request number, dispute type, and last status already drafted."
  },
  {
    step: "Triage",
    title: "Ops desk receives structured context",
    detail: "Admin sees customer phone, order owner, market, payment status, and latest tracking event."
  },
  {
    step: "Resolution",
    title: "Decision is logged",
    detail: "Refund review, replacement sourcing, carrier update, or inspection recheck is written to the audit trail."
  }
];

export const marketSignals = [
  {
    label: "Sesame availability",
    market: "Lafia and Doma supply belt",
    value: "Strong",
    detail: "Buying agents active; confirm moisture and clean-bag standard.",
    tone: "green"
  },
  {
    label: "Yam dispatch window",
    market: "Akwanga and Nasarawa Eggon",
    value: "Tight",
    detail: "Load early to avoid heat exposure and afternoon road delays.",
    tone: "amber"
  },
  {
    label: "Abuja corridor traffic",
    market: "Karu and Mararaba",
    value: "Watch",
    detail: "Plan pickups before evening congestion on the FCT approach.",
    tone: "blue"
  },
  {
    label: "Hibiscus quote spread",
    market: "Keffi aggregation line",
    value: "+6%",
    detail: "Export-grade lots are firmer; attach sample photos before quote.",
    tone: "clay"
  }
];

export const authenticatedUsers = [
  {
    name: "Aisha Mohammed",
    email: "aisha@aminuretail.ng",
    role: "CUSTOMER",
    organization: "Aminu Retail Stores",
    status: "Active",
    assurance: "Phone, email, business address"
  },
  {
    name: "Fatima Bello",
    email: "fatima@nasarawatradedesk.ng",
    role: "PROCUREMENT_OFFICER",
    organization: "Nasarawa Trade Desk",
    status: "Active",
    assurance: "Staff ID, market desk, supervisor approval"
  },
  {
    name: "Musa Ibrahim",
    email: "musa@nasarawatradedesk.ng",
    role: "LOGISTICS_OFFICER",
    organization: "Nasarawa Trade Desk",
    status: "Active",
    assurance: "Carrier registry and dispatch authority"
  },
  {
    name: "Ngozi Eze",
    email: "ngozi@nasarawatradedesk.ng",
    role: "DISPUTE_MANAGER",
    organization: "Nasarawa Trade Desk",
    status: "Active",
    assurance: "Resolution authority and refund review access"
  }
];

export const roleAccessMatrix = [
  {
    role: "Customer",
    canAccess: ["request intake", "quotation", "payment", "tracking", "dispute opening"],
    blockedFrom: ["supplier notes", "refund approval", "role changes"]
  },
  {
    role: "Procurement officer",
    canAccess: ["market sourcing", "inspection evidence", "quote notes", "supplier checks"],
    blockedFrom: ["payment capture", "role changes"]
  },
  {
    role: "Logistics officer",
    canAccess: ["transport assignment", "carrier updates", "POD upload", "route exceptions"],
    blockedFrom: ["quotation pricing", "refund approval"]
  },
  {
    role: "Admin",
    canAccess: ["all workflow overrides", "audit export", "role management", "dispute escalation"],
    blockedFrom: ["direct card data"]
  }
];

export const procurementOfficers = [
  {
    name: "Fatima Bello",
    desk: "Lafia Main Market",
    phone: "+234 803 000 0142",
    languages: ["English", "Hausa"],
    activeRequests: 18,
    verification: "Staff ID NTD-PO-104 verified",
    specialties: ["sesame", "soybeans", "maize"],
    supervisor: "Ops lead: Salihu Danladi"
  },
  {
    name: "Ibrahim Adamu",
    desk: "Keffi Central Market",
    phone: "+234 803 000 0198",
    languages: ["English", "Hausa"],
    activeRequests: 12,
    verification: "Market desk and supplier book verified",
    specialties: ["hibiscus", "groundnut", "grains"],
    supervisor: "Ops lead: Salihu Danladi"
  },
  {
    name: "Ruth Audu",
    desk: "Akwanga Modern Market",
    phone: "+234 803 000 0176",
    languages: ["English", "Eggon", "Hausa"],
    activeRequests: 9,
    verification: "Inspection authority active",
    specialties: ["yam", "rice", "vegetables"],
    supervisor: "Quality lead: Mariam Tanko"
  }
];

export const stateTransitionRules = [
  {
    from: "SUBMITTED",
    to: "SOURCING",
    actor: "Procurement officer",
    guard: "Customer profile verified and target Nasarawa market assigned"
  },
  {
    from: "SOURCING",
    to: "QUOTED",
    actor: "Procurement officer",
    guard: "At least one supplier reference, market price note, and logistics estimate attached"
  },
  {
    from: "QUOTED",
    to: "AWAITING_PAYMENT",
    actor: "Customer",
    guard: "Customer accepts quotation before validity expiry"
  },
  {
    from: "AWAITING_PAYMENT",
    to: "PROCUREMENT_STARTED",
    actor: "Finance officer",
    guard: "Payment webhook, amount, provider reference, and order total match"
  },
  {
    from: "PROCUREMENT_STARTED",
    to: "QUALITY_CHECK",
    actor: "Procurement officer",
    guard: "Items purchased and inspection task opened"
  },
  {
    from: "QUALITY_CHECK",
    to: "READY_FOR_DISPATCH",
    actor: "Quality reviewer",
    guard: "Inspection evidence passes or customer approves variance"
  },
  {
    from: "READY_FOR_DISPATCH",
    to: "IN_TRANSIT",
    actor: "Logistics officer",
    guard: "Carrier, driver, vehicle, route risk, and manifest are assigned"
  },
  {
    from: "IN_TRANSIT",
    to: "DELIVERED",
    actor: "Logistics officer",
    guard: "Proof of delivery photo, recipient name, timestamp, and GPS note captured"
  },
  {
    from: "DELIVERED",
    to: "COMPLETED",
    actor: "Customer or admin",
    guard: "Customer confirms receipt or dispute window closes"
  }
];

export const transportAssignments = [
  {
    id: "TA-7710",
    order: "NRP-2026-0418",
    lane: "Lafia Main Market to Kano",
    carrier: "NorthLink Haulage",
    driver: "Musa A.",
    driverPhone: "+234 806 000 1188",
    vehicle: "Canter truck KTN-442LA",
    manifest: "120 sealed sesame bags, 50kg each",
    status: "Assigned",
    routeRisk: "Medium",
    releaseGate: "Waiting for final quality signoff"
  },
  {
    id: "TA-7711",
    order: "NRP-2026-0419",
    lane: "Keffi Central Market to Apapa",
    carrier: "BlueRoad Logistics",
    driver: "Chinedu O.",
    driverPhone: "+234 806 000 2290",
    vehicle: "Closed-body truck APP-318KD",
    manifest: "Export-grade hibiscus cartons",
    status: "In transit",
    routeRisk: "Low",
    releaseGate: "Manifest accepted"
  },
  {
    id: "TA-7712",
    order: "NRP-2026-0420",
    lane: "Akwanga Modern Market to Nsukka",
    carrier: "EastGate Dispatch",
    driver: "Grace E.",
    driverPhone: "+234 806 000 3301",
    vehicle: "Pickup van ENU-229AX",
    manifest: "Yam tuber crates after grading approval",
    status: "Pending release",
    routeRisk: "Watch",
    releaseGate: "Customer variance approval required"
  }
];

export const proofOfDeliveryRecords = [
  {
    order: "NRP-2026-0398",
    recipient: "M. Abubakar",
    destination: "Kaduna South, Kaduna",
    capturedBy: "NorthLink Haulage",
    capturedAt: "May 17, 16:42",
    evidence: ["delivery photo", "signed waybill", "recipient phone confirmation"],
    status: "Accepted"
  },
  {
    order: "NRP-2026-0402",
    recipient: "Adaobi Okonkwo",
    destination: "Onitsha North, Anambra",
    capturedBy: "EastGate Dispatch",
    capturedAt: "May 18, 12:09",
    evidence: ["warehouse gate photo", "signed invoice", "GPS note"],
    status: "Under review"
  }
];

export const inspectionGallery = [
  {
    id: "IMG-441",
    title: "Reference match",
    order: "NRP-2026-0418",
    type: "Photo",
    caption: "Sesame bag seal and stitching compared with requested packaging",
    status: "Passed"
  },
  {
    id: "IMG-442",
    title: "Scale reading",
    order: "NRP-2026-0418",
    type: "Photo",
    caption: "Representative bag weight logged before truck loading",
    status: "Passed"
  },
  {
    id: "IMG-443",
    title: "Supplier stall",
    order: "NRP-2026-0419",
    type: "Photo",
    caption: "Keffi supplier stall and carton lot before dispatch",
    status: "Cleared"
  },
  {
    id: "IMG-444",
    title: "Variance evidence",
    order: "NRP-2026-0420",
    type: "Voice note",
    caption: "Officer explains mixed yam size variance for customer approval",
    status: "Needs approval"
  }
];

export const enterpriseAuditEvents = [
  {
    id: "AUD-9001",
    actor: "Fatima Bello",
    role: "PROCUREMENT_OFFICER",
    action: "STATUS_CHANGE",
    entity: "NRP-2026-0418",
    before: "PROCUREMENT_STARTED",
    after: "QUALITY_CHECK",
    source: "dashboard",
    ip: "102.89.44.18",
    time: "May 18, 14:40"
  },
  {
    id: "AUD-9002",
    actor: "Paystack webhook",
    role: "SYSTEM",
    action: "PAYMENT_CAPTURE",
    entity: "NRP-2026-0418",
    before: "AWAITING_PAYMENT",
    after: "PROCUREMENT_STARTED",
    source: "webhook",
    ip: "52.31.12.90",
    time: "May 18, 09:18"
  },
  {
    id: "AUD-9003",
    actor: "Musa Ibrahim",
    role: "LOGISTICS_OFFICER",
    action: "TRANSPORT_ASSIGNMENT",
    entity: "TA-7710",
    before: "unassigned",
    after: "NorthLink Haulage",
    source: "dashboard",
    ip: "102.89.51.22",
    time: "May 18, 15:12"
  },
  {
    id: "AUD-9004",
    actor: "Ngozi Eze",
    role: "DISPUTE_MANAGER",
    action: "ESCALATION_OPENED",
    entity: "DSP-1082",
    before: "OPEN",
    after: "UNDER_REVIEW",
    source: "whatsapp_triage",
    ip: "102.89.41.09",
    time: "May 18, 15:28"
  }
];

export const whatsappThreads = [
  {
    order: "NRP-2026-0418",
    contact: "Aisha Mohammed",
    phone: "+234 805 000 7781",
    template: "Inspection update",
    lastMessage: "Quality desk is reviewing 2 bags with weaker seals before dispatch release.",
    linkedRecord: "Inspection evidence IMG-441, IMG-442",
    status: "Open"
  },
  {
    order: "NRP-2026-0419",
    contact: "Blue Coast Foods",
    phone: "+234 805 000 8842",
    template: "Transport checkpoint",
    lastMessage: "Carrier has cleared Abuja outbound manifest. ETA Apapa remains May 20.",
    linkedRecord: "Transport assignment TA-7711",
    status: "Sent"
  },
  {
    order: "NRP-2026-0421",
    contact: "Jos Agro Partners",
    phone: "+234 805 000 9920",
    template: "Dispute triage",
    lastMessage: "Please send receiving photos so the dispute desk can compare against inspection evidence.",
    linkedRecord: "Dispute DSP-1082",
    status: "Awaiting customer"
  }
];
