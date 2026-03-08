# TijaratAI — Complete Frontend Redesign Specification

> **Design Direction:** Clean, sharp, data-forward SaaS — "Terminal Green" aesthetic. Professional emerald-on-obsidian palette, monospaced accents, glassmorphism cards, and crisp micro-animations. Built for Pakistani e-commerce operators who want power and clarity.

---

## 🎨 Design System

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `--primary` | `#00E5A0` | CTAs, active states, highlights |
| `--primary-dim` | `#00C27F` | Hover states, secondary accents |
| `--primary-glow` | `rgba(0,229,160,0.15)` | Card glows, focus rings |
| `--bg-base` | `#080C0A` | Page background |
| `--bg-surface` | `#0E1612` | Cards, panels |
| `--bg-elevated` | `#162019` | Hover cards, dropdowns |
| `--border` | `rgba(0,229,160,0.12)` | Card borders |
| `--border-strong` | `rgba(0,229,160,0.28)` | Active borders |
| `--text-primary` | `#F0FFF8` | Main headings |
| `--text-secondary` | `#8BA898` | Subtext, labels |
| `--text-muted` | `#4A6358` | Disabled, placeholders |
| `--danger` | `#FF4D6A` | RTO warnings, errors |
| `--warning` | `#FFB347` | Low stock, caution |
| `--success` | `#00E5A0` | Positive metrics |

### Typography

```
Display / Headers:  "Syne" (700, 800) — sharp geometric, futuristic
Body / UI:          "DM Sans" (400, 500, 600) — clean, readable
Mono / Data:        "JetBrains Mono" (400, 600) — metrics, SKUs, numbers
Urdu Labels:        "Noto Nastaliq Urdu" — AI supervisor messages
```

### Spacing Scale
`4px → 8px → 12px → 16px → 24px → 32px → 48px → 64px → 96px`

### Border Radius
- Cards: `16px`
- Buttons: `10px`
- Badges/Chips: `6px`
- Inputs: `10px`

### Shadows & Glow
```css
--shadow-card:  0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,229,160,0.08);
--glow-active:  0 0 24px rgba(0,229,160,0.2), 0 0 0 1px rgba(0,229,160,0.3);
--glow-subtle:  0 0 12px rgba(0,229,160,0.08);
```

---

## 📐 Layout Architecture

### Sidebar (Desktop)
- Width: `260px` fixed
- Background: `#0A0F0C` with subtle left-border glow `rgba(0,229,160,0.06)`
- Logo: TijaratAI wordmark + lightning bolt icon in `--primary`
- Nav items: Icon + label, active state has `--primary-glow` pill behind
- Bottom: User avatar + "Sign Out" with fade

### Main Content
- Left padding: `32px`, top: `32px`, right: `32px`
- Page title: Syne 700, 28px
- Subtitle/breadcrumb: DM Sans 14px, `--text-secondary`

### Top Action Bar
- Right-aligned CTAs per page
- Primary button: `--primary` background, black text, Syne 600
- Secondary button: transparent + `--border-strong` border

---

## 🖥️ Pages — Detailed Redesign

---

### 1. Landing Page (Marketing)

**Hero Section**
- Full-bleed black background with animated radial green gradient mesh (subtle, CSS only)
- Navbar: glass blur `backdrop-filter: blur(20px)`, border-bottom `rgba(0,229,160,0.1)`
- Nav links: DM Sans 500, hover → `--primary` color with underline slide
- "Get Started Free" CTA: `--primary` pill button, pulsing glow on hover
- Hero headline: Syne 800, 72px responsive, white + `--primary` two-tone
  ```
  Grow your e-commerce
  with AI intelligence
  ```
- Subtext: DM Sans 18px, `--text-secondary`, max-width 560px, centered
- Hero CTA row: "Get Started Free" (large, primary) + "Watch Demo" (ghost, secondary)
- Below fold: Three floating stat cards with glassmorphism
  - `300% AVG ROI BOOST` | `PKR 4.5M+ LOSS PREVENTION` | `1,000+ STORES POWERED`
  - Each card: dark glass, neon number in `--primary`, caption in muted text

**Features Section ("Unified AI Management Suite")**
- Section heading: Syne 700, 48px, centered
- Subheading: DM Sans 16px, `--text-secondary`
- 3-column card grid (2-col on tablet, 1-col mobile)
- Feature cards: `--bg-surface`, `--border`, 16px radius, hover → `--bg-elevated` + `--glow-subtle`
- Icon squares: `--primary-glow` background, `--primary` icon, 48×48px, 12px radius
- Feature title: Syne 600, 18px
- Feature description: DM Sans 14px, `--text-secondary`, line-height 1.6

**Features list:**
- 4-Agent AI System
- RTO Predictor
- 12-Factor ROI Calculator
- Smart Inventory
- Courier Routing
- WhatsApp Alerts (Urdu)

**How It Works Section**
- Numbered step timeline (vertical on mobile, horizontal on desktop)
- Step numbers: JetBrains Mono, large, `--primary`, faint background circle

**Pricing Section**
- 2–3 tier cards, center card highlighted with `--glow-active`

**Footer**
- TijaratAI logo + tagline
- Links: Contact Us, Terms of Service, Privacy Policy
- Copyright: `© 2026 TijaratAI. Built for Pakistan's E-Commerce.`
- Background: `#050807`

---

### 2. Auth Pages (Sign Up / Sign In)

**Layout**
- Split screen: left = brand panel (dark with animated green mesh), right = form panel
- Left panel: TijaratAI logo, tagline, 3 social proof bullet points
- Right panel: pure `--bg-base`, centered form, max-width 420px

**Sign Up Form**
- Title: "Create Account" — Syne 700, 28px
- Subtitle: DM Sans 14px, `--text-secondary`
- Fields: First Name + Last Name (2-col grid), Email, Password
- Input style: `--bg-surface` background, `--border` border, 10px radius, `--primary` focus ring glow
- "Create Account" button: full-width, `--primary`, Syne 600, 14px
- Divider: "OR CONTINUE WITH" — DM Sans 12px, `--text-muted`, horizontal rules
- Google button: outlined, white Google icon, DM Sans 500
- Footer: "Already have an account? **Sign in**" — `--primary` link

---

### 3. Onboarding Flow (Multi-Step)

**Progress Bar**
- Top: 3 labeled steps with icon circles — Identity → Logistics → AI Cluster
- Active: `--primary` icon + label, connected by progress line
- Inactive: `--text-muted` with dimmed icons

**Step 1 — Identity Nexus**
- Title: "IDENTITY NEXUS" (Syne 700) + "SELECT YOUR E-COMMERCE NEXUS" (DM Sans, muted, tracked)
- 3 platform tiles in a row: Daraz, Shopify, WooCommerce
- Tile: 160×160px, `--bg-surface` card, platform logo centered, name below
- Hover: border → `--border-strong`, subtle `--glow-subtle`
- Selected: `--glow-active` border, checkmark badge top-right in `--primary`

**Step 2 — Logistics Nexus**
- Title: "LOGISTICS NEXUS" + "BRIDGE YOUR DELIVERY PROTOCOLS"
- 5 courier tiles in a row: TCS (red), Leopards (yellow), PostEx (blue), Trax (orange), BlueEx (blue)
- Same tile style as Identity step
- Multi-select allowed (checkmark overlay when selected)
- Previous Stage / Advance Protocol navigation

**Step 3 — AI Cluster Nexus**
- Title: "AI CLUSTER NEXUS" + "INITIALIZE NEURAL COMMAND"
- Central status card: `--bg-elevated`, gear/chip icon in `--primary`, "NEURAL CORE INITIALIZED" headline
- 3 capability rows (checklist style):
  - ✅ Inventory Velocity Tracking — Auto-Synced Nexus
  - ✅ Logistics ROI Matrix — Predictive Courier Routing
  - ✅ Supervisor Priority Stream — Real-Time Urdu Intelligence
- Each row: title in DM Sans 600, subtitle in `--text-secondary`, check in `--primary`
- "INITIALIZE DASHBOARD" CTA: full-width, `--primary`, Syne 700, lightning bolt icon

---

### 4. Dashboard (Home)

**Header**
- "Welcome Back, [Name]" — Syne 700, 32px
- Subtitle: "TijaratAI 4-Agent Core is active. Your business health is stable." — DM Sans 14px, `--text-secondary`
- Right: "Run Analysis" (outlined) + "Security Vault" (primary CTA)

**KPI Cards Row (4 cards)**

Each card:
- Background: `--bg-surface`
- Border: `--border`
- Hover: `--bg-elevated` + subtle lift shadow
- Label: DM Sans 11px, uppercase, tracked, `--text-secondary`
- Value: JetBrains Mono 700, 32px, `--text-primary`
- Change indicator: small pill — green (▲) or red (▼), DM Sans 500, 12px
- Icon: top-right, 32×32px icon square, `--primary-glow` bg

| Card | Special |
|---|---|
| Business Health Score | "AI CORE" badge, progress bar below |
| Today's Sales | Green $ icon |
| True ROI | % icon |
| RTO Rate | Red trend (negative is bad) |

**Main Content Row (3 columns)**

*Column 1–2: Sales Overview Chart*
- Card: full-width area chart, `--primary` stroke + gradient fill
- Chart title: "Sales Overview" — Syne 600, 18px
- Axis labels: JetBrains Mono 11px, `--text-muted`
- Tooltip: dark glass card on hover

*Column 3 (right): Health Breakdown + Supervisor Logic*

Health Breakdown card:
- "HEALTH BREAKDOWN" label — DM Sans 11px, uppercase, tracked
- "Weighted factors affecting BHS" — 14px, muted
- Progress rows: Sales Momentum, RTO Control, etc.
- Each row: label + weight % (right-aligned, muted) + `--primary` progress bar + score

Supervisor Logic panel:
- Dark card with glowing `--primary` border
- "SUPERVISOR LOGIC" header — Syne 700, `--primary`
- AI message bubbles: Urdu text in Noto Nastaliq, DM Sans for labels
- Warning icon in amber for alerts
- Floating action button (FAB): `--primary` circle, bot icon, bottom-right corner

---

### 5. Sales Analytics

**Header**
- "Sales Analytics" — Syne 700
- "Real-time revenue tracking and margin analysis" + "LIVE NODE" badge
- Right: "Download Report" (outlined) + "Export Data" (primary)

**Top Metrics (3 cards)**

| Metric | Value | Sub |
|---|---|---|
| Gross Revenue (Today) | PKR 12,450 | +12.5% vs yesterday |
| Net Profit Margin | 18.5% | +1.2 point lift |
| Customer LTV | PKR 8.2k | AI Optimized |

**Sales Overview Chart**
- Same chart style as dashboard, larger
- Time filter tabs: Today / Week / Month / Custom

**Sales Intelligence Panel (right column)**
- "SALES INTELLIGENCE" header — Syne 700, `--primary`
- Conversion Optimization card
- Basket Analysis card
- Each with insight text, metric highlight in `--primary`

---

### 6. Logistics Command

**Header**
- "Logistics Command" — Syne 700
- "RTO minimization and courier performance matrix" + "NEURAL HUB" badge
- Right: "Courier Settings" (outlined) + "AUTO-DISPATCH: ON" toggle button

**Courier Performance Index Table**

Table container: `--bg-surface`, full border, `--border`

Columns: Courier | Orders | RTO Rate | ROI | Status

Row style:
- Courier logo + name
- Orders: JetBrains Mono, `--text-primary`
- RTO Rate: Color-coded — green if low (<12%), amber if medium, red if high
- ROI: JetBrains Mono, `--primary`
- Status badge: pill with border — RECOMMENDED (green), STABLE (blue), BEST ROI (emerald), REVIEW (amber)

**AI RTO Signals Panel (right)**
- "AI RTO SIGNALS" header — Syne 700, `--primary`
- Signal cards (stacked):
  - Previous Return History → HIGH RISK (red badge)
  - Incomplete Address Validation → WARNING (amber)
  - Odd Hours Order Pattern → NOTICE (blue)
  - High Value COD Threshold → WARNING (amber)
  - City Courier Historical RTO → (additional)
- Each signal: location pin icon, signal name (DM Sans 600), badge, "NEURAL WEIGHT: +XX" (JetBrains Mono, muted)

---

### 7. Inventory Control

**Header**
- "Inventory Control" — Syne 700
- "Real-time stock synchronization active" + "MULTI-PLATFORM SYNC" badge (green pill)
- Right: "+ Add Product" (primary)

**Top Stats (4 cards)**

| Stat | Value | Color |
|---|---|---|
| Total SKUs | 5 | neutral |
| Low Stock | 1 | amber |
| Out of Stock | 1 | red |
| Inventory Value | PKR 1.2M | `--primary` |

**Search + Filter Bar**
- Full-width search input: `--bg-surface`, search icon, placeholder "Search SKU or Product Name..."
- Filter button: outlined, filter icon

**Product Table**

Columns: Product Details | SKU | Stock Level | Price | Status | Actions

Row elements:
- Product icon (box): `--primary` on dark square
- Product name: DM Sans 600
- SKU: JetBrains Mono, `--text-secondary`, small
- Stock Level: number + progress bar (green → amber → red based on level)
- Price: JetBrains Mono, `--text-primary`
- Status badge: IN STOCK (green), LOW STOCK (amber), OUT OF STOCK (red)
- Edit action: DM Sans 500, `--primary` hover

---

### 8. Settings (System Configuration)

**Header**
- "SYSTEM CONFIGURATION" — Syne 800, white + `--primary` two-tone
- "GLOBAL NEURAL NODE & PLATFORM PARAMETERS" — DM Sans 12px, tracked, muted

**Section: Identity & Shop Parameters**
- Section icon + "IDENTITY & SHOP PARAMETERS" — Syne 600, italic
- "Secure vault encryption active." — DM Sans 14px, muted
- 2-col field grid: Shop Designation | Emergency Email
- Inputs: `--bg-surface`, `--border`, focus → `--glow-active`
- "SAVE PARAMETERS" button: `--primary`, Syne 600

**Section: Platform Integration Cluster**
- Icon + "PLATFORM INTEGRATION CLUSTER" — Syne 600
- "Manage API bridges and webhook endpoints." — muted subtitle
- Integration tiles with connect/disconnect states

---

## ⚡ Interaction Patterns

### Animations

```css
/* Page load: staggered card reveal */
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.card { animation: fadeSlideUp 0.4s ease both; }
.card:nth-child(2) { animation-delay: 0.08s; }
.card:nth-child(3) { animation-delay: 0.16s; }
.card:nth-child(4) { animation-delay: 0.24s; }

/* Button hover pulse */
.btn-primary:hover {
  box-shadow: 0 0 20px rgba(0,229,160,0.35);
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

/* Nav active indicator */
.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: var(--primary);
  border-radius: 0 3px 3px 0;
}
```

### Micro-interactions
- Metric cards: number counter animation on load (count up from 0)
- Progress bars: slide in from left on mount
- Badges: subtle pulse animation for LIVE NODE, MULTI-PLATFORM SYNC
- Supervisor logic FAB: subtle rotation on hover
- Table rows: background lighten on hover with 150ms ease
- Status badges: slight scale(1.03) on hover

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| `< 768px` (Mobile) | Sidebar becomes bottom tab bar, single-column cards, stacked metrics |
| `768px–1024px` (Tablet) | Collapsible sidebar (icon-only), 2-col card grid |
| `> 1024px` (Desktop) | Full sidebar, 4-col KPI row, multi-column layouts |

### Mobile-specific
- Bottom navigation: 5 icons (Dashboard, Sales, Logistics, Inventory, Settings)
- Cards stack vertically, full-width
- Charts become scrollable horizontally
- FAB remains fixed bottom-right

---

## 🔤 Component Library

### Button Variants
```
Primary:   bg=--primary, text=black, font=Syne 600, 10px radius
Secondary: bg=transparent, border=--border-strong, text=--text-primary
Ghost:     bg=transparent, text=--primary, underline on hover
Danger:    bg=--danger, text=white
Icon-only: 40×40px square, same border style
```

### Badge/Chip Variants
```
Success:   bg=rgba(0,229,160,0.12), text=--primary, border=rgba(0,229,160,0.25)
Warning:   bg=rgba(255,179,71,0.12), text=#FFB347, border=rgba(255,179,71,0.25)
Danger:    bg=rgba(255,77,106,0.12), text=--danger, border=rgba(255,77,106,0.25)
Neutral:   bg=rgba(255,255,255,0.06), text=--text-secondary
```

### Input Fields
```
Background: --bg-surface
Border: 1px solid --border
Focus: border-color=--primary, box-shadow=--glow-active
Font: DM Sans 14px, --text-primary
Placeholder: --text-muted
Border-radius: 10px
Padding: 12px 16px
```

### Cards
```
Background: --bg-surface
Border: 1px solid --border
Border-radius: 16px
Padding: 20px–24px
Hover: background=--bg-elevated, box-shadow=--glow-subtle
Transition: all 200ms ease
```

---

## 🧱 Tech Stack Recommendations

| Concern | Recommendation |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + CSS Variables |
| Charts | Recharts or Victory (themed to design system) |
| Animations | Framer Motion |
| Icons | Lucide React |
| Fonts | Google Fonts (Syne, DM Sans, JetBrains Mono, Noto Nastaliq Urdu) |
| State | Zustand |
| Tables | TanStack Table v8 |

---

## ✅ UX Improvements Over Current Design

| Current Issue | Redesign Solution |
|---|---|
| Inconsistent font sizes | Strict type scale with Syne + DM Sans |
| Card borders barely visible | Stronger `--border` tokens, hover glow |
| No clear visual hierarchy | Syne for headings, Mono for data, DM Sans for body |
| Nav items feel flat | Active indicator bar + pill glow behind item |
| Charts lack context | Tooltips, axis labels, time filter tabs |
| Courier table too dense | Row padding, better status badges |
| Onboarding feels disconnected | Unified step progress with icon states |
| Mobile not addressed | Proper responsive strategy with bottom tabs |
| Urdu AI messages lost in UI | Dedicated Noto Nastaliq font, special bubble component |

---

*Designed for TijaratAI — Pakistan's AI-Powered E-Commerce Intelligence Platform*
*© 2026 TijaratAI. Built for Pakistan's E-Commerce.*
