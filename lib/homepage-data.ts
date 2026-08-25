export const heroContent = {
  headline: ["We Engineer", "the Silicon that", "Powers the Future."],
  subtext:
    "End-to-end IC engineering services from architecture to silicon. Built for innovation. Optimized for performance. Delivered with precision.",
  primaryCta: "Discuss Your Project",
  secondaryCta: "Explore Services",
};

export const missionContent = {
  text: "We are a specialized semiconductor design partner, delivering silicon-proven VLSI solutions across advanced process nodes for clients in power electronics, telecommunications, automotive, and IoT.",
};

export type ServiceItem = {
  id: string;
  title: string;
  description: string;
};

export const services: ServiceItem[] = [
  {
    id: "3d-ic",
    title: "3D-IC Design",
    description:
      "Advanced 3D integration, chiplet architecture, die-to-die interfaces, and TSV design for next-gen packaging.",
  },
  {
    id: "photonics",
    title: "Silicon Photonics",
    description:
      "Photonic IC design and integration services spanning waveguides, modulators, and electronic-photonic co-packaging for high-bandwidth optical interconnect.",
  },
  {
    id: "rf-analog",
    title: "RF & Analog",
    description:
      "Transceivers, PLLs/synthesizers, and high-speed analog interfaces for 5G, Wi-Fi, automotive, and IoT applications.",
  },
  {
    id: "tcad",
    title: "TCAD Simulation",
    description:
      "Process and device simulation, PDK calibration, and SPICE model extraction using Sentaurus TCAD and Silvaco Atlas/Victory.",
  },
  {
    id: "quantum",
    title: "Quantum Computing",
    description:
      "Design and engineering support for quantum hardware — from cryo-CMOS control circuitry to qubit interconnect and packaging challenges unique to sub-Kelvin operation.",
  },
  {
    id: "physical-design",
    title: "Physical Design",
    description:
      "Full RTL-to-GDSII implementation — synthesis, floorplan, CTS, routing and signoff on nodes down to 3nm.",
  },
  {
    id: "ams",
    title: "AMS Verification",
    description:
      "Expert analog behavioral modeling and AMS verification for faster validation, shorter cycles, and higher design confidence.",
  },
];

export type WorkstepSlide = {
  number: string;
  title: string;
  description: string;
  items: string[];
};

export const workstepSlides: WorkstepSlide[] = [
  {
    number: "01",
    title: "Device physics through to power stage.",
    description:
      "We design high-electron-mobility transistors (HEMTs) across GaN-on-Si and GaN-on-SiC processes — from gate driver co-design to thermal reliability analysis. Every device is simulated end-to-end with SPICE models calibrated to foundry PDKs, targeting EV chargers, telecom, and 5G power stages.",
    items: [
      "HEMT design · GaN-on-Si & GaN-on-SiC",
      "Process simulation via Sentaurus TCAD & Silvaco Atlas",
      "I-V, C-V, transient & AC device analysis",
      "SPICE extraction calibrated to foundry PDKs",
    ],
  },
  {
    number: "02",
    title: "Advanced-node PnR, signed off.",
    description:
      "Full RTL-to-GDSII implementation from synthesis through DRC/LVS signoff, across nodes from 3nm to 90nm using Synopsys Fusion Compiler, Cadence Innovus, and ICC2. Low-power flows with multi-Vt, power gating, and UPF/CPF — plus 3D-IC chiplet integration including UCIe, HBM, and EMIB die-to-die interfaces. 10+ tapeouts delivered.",
    items: [
      "RTL-to-GDSII · Synopsys FC · Cadence Innovus · ICC2",
      "Nodes: 3nm, 5nm, 7nm, 14nm, 28nm → 90nm",
      "Low-power: multi-Vt, power gating, UPF/CPF",
      "Chiplet integration: UCIe · HBM · EMIB · TSV",
    ],
  },
  {
    number: "03",
    title: "RF-aware, parasitic-sensitive layout.",
    description:
      "Proven expertise across LNAs, PAs, mixers, VCO/PLLs, and full transceiver front-ends — verified via HFSS and Momentum/ADS EM simulation. We cover HDMI, MIPI, USB3.x, and PCIe analog interfaces, SerDes AFE, LVDS/DDR/LPDDR comboPHY, and 5G communication chip IP modules, all built with parasitic-sensitive custom layout at the core.",
    items: [
      "LNA · PA · Mixer · VCO/PLL · Synthesizer design",
      "Full TX/RX transceiver front-end architecture",
      "SerDes AFE · LVDS/DDR/LPDDR comboPHY",
      "EM simulation: HFSS & Momentum/ADS",
    ],
  },
];

export type EngagementRow = {
  label: string;
  value: string;
};

export type EngagementModel = {
  eyebrow: string;
  title: string;
  rows: EngagementRow[];
  variant: "default" | "section";
};

export const engagementModels: EngagementModel[] = [
  {
    eyebrow: "RETAINER-BASED",
    title: "Dedicated team, monthly",
    variant: "default",
    rows: [
      { label: "Allocation", value: "Senior engineers, assigned monthly" },
      { label: "Scope", value: "Task-driven — bugs, reviews, new features" },
      { label: "Billing", value: "Predictable monthly, easy to scale" },
      { label: "Best for", value: "Ongoing support & maintenance" },
    ],
  },
  {
    eyebrow: "TURNKEY",
    title: "Fixed scope, spec to silicon",
    variant: "section",
    rows: [
      { label: "Delivery", value: "Complete spec → GDSII / silicon" },
      { label: "Payments", value: "Milestone-based — spec, RTL, tapeout" },
      { label: "IP terms", value: "Work-for-hire — client owns all IP" },
      { label: "Best for", value: "New products & time-critical tapeouts" },
    ],
  },
];

export type SecurityCardIcon =
  | "shield-check"
  | "fingerprint-simple"
  | "folder-simple-lock"
  | "lock";

export type SecurityCard = {
  id: string;
  title: string;
  icon: SecurityCardIcon;
  items: string[];
};

export const securityCards: SecurityCard[] = [
  {
    id: "ip-legal",
    title: "IP & Legal",
    icon: "shield-check",
    items: [
      "NDA signed by all personnel",
      "Work-for-hire — client owns IP",
      "Export regulation adherence",
    ],
  },
  {
    id: "device-data",
    title: "Device & Data",
    icon: "fingerprint-simple",
    items: [
      "Air-gapped RTL/Netlist/GDS machines",
      "Full-disk encryption, EDR tools",
      "No BYOD — company devices only",
    ],
  },
  {
    id: "access-control",
    title: "Access Control",
    icon: "folder-simple-lock",
    items: [
      "Biometric ODC room access",
      "MFA on all engineering systems",
      "Role-based version control",
    ],
  },
  {
    id: "secure-communication",
    title: "Secure Communication",
    icon: "lock",
    items: [
      "Encrypted VPN to client servers",
      "24/7 ODC surveillance",
      "Dedicated Bridge Engineer",
    ],
  },
];

export type WhyCard = {
  eyebrow: string;
  title: string;
  description: string;
};

export const whyCards: WhyCard[] = [
  {
    eyebrow: "FULL-STACK",
    title: "One team, one partner",
    description:
      "From TCAD device physics to physical verification signoff - no handoffs between vendors.",
  },
  {
    eyebrow: "ADVANCED NODE",
    title: "Proven on leading nodes",
    description:
      "Tapeouts on TSMC 3nm–28nm, Samsung 5nm, and GlobalFoundries processes.",
  },
  {
    eyebrow: "OUR LOCATIONS",
    title: "Global Presence",
    description: "ODC in Bangladesh with headquarters in USA.",
  },
  {
    eyebrow: "IP-SAFE",
    title: "Air-gapped delivery",
    description:
      "Biometric ODC access and strict NDAs - your IP never leaves our secure environment.",
  },
  {
    eyebrow: "COMMERCIAL",
    title: "Flexible terms",
    description:
      "Retainer or turnkey - we adapt to your project structure and budget.",
  },
  {
    eyebrow: "TRACK RECORD",
    title: "Silicon-validated",
    description:
      "10+ tapeouts and proven analog IPs, recognized at BEAR 2025.",
  },
];

export const contactContent = {
  eyebrow: "CONTACT us",
  headline: ["Ready to start", "your next tapeout?"],
  email: "info@staqx.ai",
  odc: "Dhaka, Bangladesh",
  hq: "USA",
  submitLabel: "Discuss Your Project",
};

export const footerContent = {
  tagline: "Silicon-proven VLSI engineering from concept to tapeout.",
  copyright: "© 2026 staqx-ai. All rights reserved.",
};
