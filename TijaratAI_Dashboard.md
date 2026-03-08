# TijaratAI — Complete Dashboard Content

---

## SIDEBAR / NAVIGATION

**Logo:**
⚡ TijaratAI

**Nav Items:**
| Icon | Label | State |
|---|---|---|
| ⊞ | DASHBOARD | Active (green pill + left border bar) |
| 📈 | SALES | Default |
| 🚚 | LOGISTICS | Default |
| 📦 | INVENTORY | Default |
| ⚙ | SETTINGS | Default |

**Active State:**
- Green left border bar (3px, glowing)
- Green pill background behind item
- Label color → `#00E5A0`

**Bottom User Panel:**
- Avatar circle: "S" (initials)
- Name: **Safian**
- Email: safian@example.com
- Sign Out button: ↩

---

## PAGE 1 — DASHBOARD (Home)

### Page Header

**Heading:**
```
Welcome Back, Safian
```
*"Safian" in green (#00E5A0)*

**Subtext:**
TijaratAI 4-Agent Core is active · ● Business health is stable
*Green dot (●) before "Business health"*

**Right Side Action Buttons:**
- ⚡ Run Analysis (outlined/ghost button)
- 🔒 Security Vault (primary green button)

---

### KPI Cards Row (4 cards)

**Card 1 — Business Health Score**
- Badge: `AI CORE` (green pill, top right)
- Value: **78.4 / 100**
- Change: ▲ +2.5% vs last week (green)
- Progress bar below value: 78.4% filled, green gradient
- Hover: green border glow

**Card 2 — Today's Sales**
- Icon: 💰 (top right)
- Value: **PKR 12,450**
- Change: ▲ +12.5% vs last week (green)

**Card 3 — True ROI**
- Icon: 📈 (top right)
- Value: **18.5%**
- Change: ▲ +1.2% vs last week (green)

**Card 4 — RTO Rate**
- Icon: ↩ (top right)
- Value: **12.2%**
- Change: ▼ -1.1% vs last week (red — lower is worse for RTO)

*All 4 cards animate: numbers count up from 0 on page load with staggered delay (0ms, 80ms, 160ms, 240ms)*

---

### Main Content Row

#### Left — Sales Overview Chart (2/3 width)

**Card Title:** Sales Overview

**Time Filter Tabs (top right of card):**
- Day | **Week** (active) | Month

**Chart Type:** Area chart (smooth curve)
- Stroke: `#00E5A0`, width 2.5px
- Fill: green gradient (25% opacity at top → 0% at bottom)
- Active dot: green circle, black stroke
- X-axis: Mon · Tue · Wed · Thu · Fri · Sat · Sun
- Y-axis: K40 · K60 · K80

**Chart Data:**
| Day | Revenue (PKR) | Orders |
|---|---|---|
| Mon | 42,000 | 18 |
| Tue | 58,000 | 24 |
| Wed | 51,000 | 21 |
| Thu | 67,000 | 29 |
| Fri | 74,000 | 31 |
| Sat | 89,000 | 38 |
| Sun | 12,450 | 5 |

**Tooltip on hover:**
- Dark glass card
- Day label (monospace, muted)
- PKR value (green, bold, monospace)
- Order count (muted)

---

#### Right — Health Breakdown (1/3 width)

**Card Header:**
- Label: `HEALTH BREAKDOWN` (uppercase, monospace, muted)
- Subtext: Weighted factors affecting BHS

**Health Factor Rows (5 items):**

| Factor | Weight | Score | Bar Color |
|---|---|---|---|
| Sales Momentum | 25% | 85 | Green |
| RTO Control | 25% | 72 | Green |
| Inventory Health | 20% | 91 | Green |
| Cash Flow | 15% | 68 | Amber/Warning |
| Ad Efficiency | 15% | 77 | Green |

*Each row: label (left) + weight % (muted) + score number (right) + animated progress bar below*
*Bars animate slide-in from left on load, staggered 120ms each*

**Bottom Summary (after divider line):**
- Label: Overall Score (monospace, muted)
- Value: **78.4 / 100** (large, green)

---

### Bottom Row

#### Left — Courier Performance Table (2/3 width)

**Card Title:** Courier Performance

**Table Columns:**
Courier | Orders | RTO Rate | ROI | Status

**Table Data:**

| Courier | Orders | RTO Rate | ROI | Status | Status Color |
|---|---|---|---|---|---|
| TCS | 450 | 12% | 18% | RECOMMENDED | Green |
| LEOPARDS | 320 | 15% | 15% | STABLE | Blue (#4D9FFF) |
| POSTEX | 180 | 8% | 22% | BEST ROI | Green |
| TRAX | 150 | 18% | 12% | REVIEW | Amber |

**RTO Rate Color Rules:**
- ≤ 10% → Green
- 11–15% → Amber
- > 15% → Red

**Row hover:** background lightens, 150ms ease

---

#### Right — Supervisor Logic AI Panel (1/3 width)

**Card Header:**
- Icon: 🤖 in green square
- Title: `SUPERVISOR LOGIC` (green, monospace, bold)
- Subtitle: AI Intelligence Feed
- Live indicator: green dot (glowing) top right

**Border:** Strong green border + subtle outer glow

**AI Message Cards (4 messages):**

**Message 1 — Warning**
- Icon: ⚠
- Text: Karachi ke orders mein RTO zyada — advance payment ya confirmation lein
- Time: 2m ago
- Background: amber tint

**Message 2 — Alert**
- Icon: 📦
- Text: Smart Watch Z2 stock 12 units remaining — reorder point reached
- Time: 15m ago
- Background: red tint

**Message 3 — Info**
- Icon: 📈
- Text: Lahore region showing 15% higher conversion on mobile today
- Time: 1h ago
- Background: green tint

**Message 4 — Info**
- Icon: 🎯
- Text: PostEx delivering best ROI this week — consider routing more orders
- Time: 3h ago
- Background: green tint

---

## PAGE 2 — SALES ANALYTICS

### Page Header

**Heading:** Sales Analytics

**Subtext:**
Real-time revenue tracking and margin analysis · ● LIVE NODE
*"LIVE NODE" in green, monospace, bold*

**Right Side Buttons:**
- ↓ Download Report (outlined)
- Export Data (primary green)

---

### Top Metrics Row (3 cards)

**Card 1 — Gross Revenue (Today)**
- Value: **PKR 12,450**
- Sub: ▲ +12.5% vs yesterday (green)

**Card 2 — Net Profit Margin**
- Value: **18.5%**
- Sub: ▲ +1.2 point lift (green)

**Card 3 — Customer LTV**
- Value: **PKR 8.2k**
- Icon: ⚡
- Sub: AI Optimized (green)

---

### Revenue Trend Chart (full width)

**Card Title:** Revenue Trend

**Time Filter Tabs:**
Today | **Week** (active) | Month | Custom

**Chart:** Same area chart style as dashboard — green stroke, gradient fill, smooth curve

---

### Sales Intelligence Panel (full width)

**Card Title:** ⚡ SALES INTELLIGENCE (green, monospace)

**4 Intelligence Cards (2×2 grid):**

**1. 📊 CONVERSION OPTIMIZATION**
Lahore region is seeing 15% higher conversion on mobile. Scaling ads recommended.

**2. 🛒 BASKET ANALYSIS**
Wireless Earbuds + Phone Case Pro bundled — 22% higher AOV detected this week.

**3. ⏰ PEAK HOURS**
Orders spike between 8–10 PM daily. Consider scheduling flash sales during this window.

**4. 📍 TOP CITY**
Lahore accounts for 38% of total revenue today. Consider city-specific promotions.

---

## PAGE 3 — LOGISTICS COMMAND

### Page Header

**Heading:** Logistics Command

**Subtext:**
RTO minimization and courier performance matrix · NEURAL HUB
*"NEURAL HUB" in blue (#4D9FFF), monospace*

**Right Side Buttons:**
- Courier Settings (outlined)
- ● AUTO-DISPATCH: ON (primary green)

---

### Main Layout (2 columns)

#### Left — Courier Performance Index Table (full detail)

**Section Label:** `COURIER PERFORMANCE INDEX` (uppercase, monospace, muted)

**Table Columns:**
Courier | Orders | RTO Rate | ROI | Status

**Table Data:**

| Courier | Orders | RTO Rate | ROI | Status | Color |
|---|---|---|---|---|---|
| TCS | 450 | 12% | 18% | RECOMMENDED | Green |
| LEOPARDS | 320 | 15% | 15% | STABLE | Blue |
| POSTEX | 180 | 8% | 22% | BEST ROI | Green |
| TRAX | 150 | 18% | 12% | REVIEW | Amber |

**Row hover:** elevates background, cursor pointer

---

#### Right — AI RTO Signals Panel

**Title:** 🛡 AI RTO SIGNALS (green, monospace, bold)

**Signal Cards (5 stacked):**

| Signal | Neural Weight | Badge Type | Badge Color |
|---|---|---|---|
| Previous Return History | +25 | HIGH RISK | Red |
| Incomplete Address Validation | +15 | WARNING | Amber |
| Odd Hours Order Pattern | +10 | NOTICE | Blue |
| High Value COD Threshold | +15 | WARNING | Amber |
| City Historical RTO | +8 | NOTICE | Blue |

*Each card: signal name (bold) + badge (right) + "NEURAL WEIGHT: +XX" (green accent, monospace, small)*

---

## PAGE 4 — INVENTORY CONTROL

### Page Header

**Heading:** Inventory Control

**Subtext:**
Real-time stock synchronization active · MULTI-PLATFORM SYNC
*"MULTI-PLATFORM SYNC" in green pill badge*

**Right Side Button:**
+ Add Product (primary green)

---

### Top Stats Row (4 cards)

| Label | Value | Color |
|---|---|---|
| TOTAL SKUs | **5** | White |
| LOW STOCK | **1** | Amber |
| OUT OF STOCK | **1** | Red |
| INVENTORY VALUE | **PKR 1.2M** | Green |

---

### Search + Filter Bar

**Search Input:**
- Icon: 🔍
- Placeholder: Search SKU or Product Name...
- Background: dark surface
- Focus: green border glow
- Real-time filtering — results update as user types

**Filter Button:** ⚙ Filter (outlined, right side)

---

### Product Table

**Table Columns:**
Product Details | SKU | Stock Level | Price | Status | Actions

**Product Data:**

| Product | SKU | Stock | Max | Price (PKR) | Status |
|---|---|---|---|---|---|
| Wireless Earbuds | EA-102 | 85 | 100 | 2,450 | IN STOCK |
| Smart Watch Z2 | SW-099 | 12 | 100 | 2,400 | LOW STOCK |
| Phone Case Pro | PC-045 | 0 | 50 | 450 | OUT OF STOCK |
| USB-C Hub 7-in-1 | UH-201 | 34 | 50 | 1,850 | IN STOCK |
| Laptop Stand Alloy | LS-310 | 67 | 80 | 3,200 | IN STOCK |

**Stock Level Column:**
- Shows: "85 Units" (bold, monospace)
- Progress bar below: fills % of max stock
  - > 30% → Green
  - 10–30% → Amber
  - 0% → Red

**Status Badge Rules:**
- IN STOCK → Green pill
- LOW STOCK → Amber pill
- OUT OF STOCK → Red pill

**Actions Column:**
- EDIT button (outlined, green text, hover glow)

**Row hover:** background elevates, cursor pointer

---

## PAGE 5 — SETTINGS (System Configuration)

### Page Header

**Heading:**
```
SYSTEM CONFIGURATION
```
*"SYSTEM" in white italic · "CONFIGURATION" in green*

**Subtext:**
`GLOBAL NEURAL NODE & PLATFORM PARAMETERS`
*(uppercase, monospace, muted, tracked)*

---

### Section 1 — Identity & Shop Parameters

**Section Header:**
- Icon: 👤
- Title: *IDENTITY & SHOP PARAMETERS* (italic, bold, monospace)
- Sub: 🔒 Secure vault encryption active.

**Form Fields (2-column grid):**

| Field Label | Default Value |
|---|---|
| SHOP DESIGNATION | Safian's Store |
| EMERGENCY EMAIL | safian@example.com |

**Input States:**
- Default: dark surface, soft green border
- Focus: green border + outer glow ring
- Transition: 0.2s ease

**Save Button:**
- Label: `SAVE PARAMETERS`
- Style: Primary green, full width of left column
- After click: Changes to `✓ SAVED!` for 2 seconds, then resets
- Hover: green glow shadow

---

### Section 2 — Platform Integration Cluster

**Section Header:**
- Icon: 🔌
- Title: *PLATFORM INTEGRATION CLUSTER* (italic, bold, monospace)
- Sub: Manage API bridges and webhook endpoints.

**Integration Cards (3-column grid, 6 cards):**

| Platform | Color | Status |
|---|---|---|
| Daraz | Orange | ● CONNECTED |
| Shopify | Green | ○ DISCONNECTED |
| WooCommerce | Purple | ○ DISCONNECTED |
| TCS API | Red | ● CONNECTED |
| WhatsApp | Green (#25D366) | ○ DISCONNECTED |
| Meta Ads | Blue (#1877F2) | ○ DISCONNECTED |

**Card Actions:**
- Connected → "Manage" button (green outlined)
- Disconnected → "Connect" button (muted outlined)

**Connected card border:** strong green border

---

## GLOBAL UI COMPONENTS

### Sidebar Nav Item States

| State | Background | Text Color | Left Border |
|---|---|---|---|
| Default | Transparent | Muted (#5A7A6A) | None |
| Hover | rgba(255,255,255,0.04) | Light | None |
| Active | rgba(0,229,160,0.10) | Green (#00E5A0) | 3px green glowing bar |

---

### Breadcrumb (top of main area)

Format: `Dashboard / [Current Page]`
- Style: monospace, 11px, muted color
- Only shows sub-page name when not on Dashboard

---

### KPI Card Structure

```
┌─────────────────────────────────┐
│  LABEL (monospace, 10px, muted) │  [BADGE or ICON]
│                                 │
│  VALUE (monospace, 28px, bold)  │
│  [progress bar if applicable]   │
│                                 │
│  ▲ +X.X%  vs last week         │
└─────────────────────────────────┘
```

**Hover effect:**
- Border: muted → strong green
- Box shadow: `0 0 24px rgba(0,229,160,0.10)`
- Transition: all 200ms ease

---

### Table Row Hover

- Background transitions from transparent → elevated (#131A16)
- Duration: 150ms ease
- Cursor: pointer

---

### Status Badge Styles

| Status | Background | Border | Text Color |
|---|---|---|---|
| IN STOCK / RECOMMENDED / BEST ROI | rgba(0,229,160,0.10) | rgba(0,229,160,0.25) | #00E5A0 |
| STABLE / NOTICE | rgba(77,159,255,0.10) | rgba(77,159,255,0.25) | #4D9FFF |
| LOW STOCK / WARNING / REVIEW | rgba(255,184,77,0.10) | rgba(255,184,77,0.25) | #FFB84D |
| OUT OF STOCK / HIGH RISK | rgba(255,77,106,0.10) | rgba(255,77,106,0.25) | #FF4D6A |

*All badges: border-radius 6px, padding 3px 8px, font-size 9px, font-weight 800, letter-spacing 0.08em, monospace*

---

### Button Variants

| Type | Background | Border | Text | Hover Effect |
|---|---|---|---|---|
| Primary | #00E5A0 | None | Black, bold | Brighter green + glow shadow + lift -2px |
| Outlined/Ghost | Transparent | rgba(0,229,160,0.28) | Light | Border brightens |
| Danger | #FF4D6A | None | White | Darker red |
| Table Action | Transparent | rgba(0,229,160,0.10) | Green | Border strengthens |

---

### Chart Tooltip

```
┌──────────────────┐
│  Wed             │  ← Day label (monospace, muted, 11px)
│  PKR 67,000      │  ← Value (green, bold, monospace, 15px)
│  29 orders       │  ← Sub info (muted, 12px)
└──────────────────┘
```

Background: `#111A16`
Border: `1px solid rgba(0,229,160,0.28)`
Border-radius: 10px
Box-shadow: `0 8px 32px rgba(0,0,0,0.5)`

---

## ANIMATIONS & INTERACTIONS

### Page Load Sequence
1. Sidebar fades in (instant)
2. Breadcrumb fades in (100ms delay)
3. Page header fades up (150ms delay)
4. KPI Card 1 fades up (0ms)
5. KPI Card 2 fades up (80ms)
6. KPI Card 3 fades up (160ms)
7. KPI Card 4 fades up (240ms)
8. Chart card fades up (320ms)
9. Health/side panels fade up (380ms)
10. Bottom row fades up (440ms)

**Animation style:**
```
opacity: 0 → 1
transform: translateY(20px) → translateY(0)
duration: 0.5s ease
```

### KPI Number Counter
- All metric values count up from 0 to final value
- Duration: 1200ms
- Easing: linear step (16ms intervals)
- Triggers on component mount

### Health Bar Slide-in
- Width animates from 0% → actual score %
- Duration: 0.9s cubic-bezier(0.4, 0, 0.2, 1)
- Stagger: 120ms between each bar
- Glow shadow on bar: `0 0 8px [color]80`

### Supervisor Logic Panel
- Messages appear with static content (no animation needed)
- Live dot: subtle CSS pulse animation

### Settings Save Button
- On click: background dims slightly
- Label changes: "SAVE PARAMETERS" → "✓ SAVED!"
- After 2000ms: resets back
- Glow shadow removes on saved state

---

## DESIGN TOKENS

### Colors
| Token | Value | Usage |
|---|---|---|
| Primary | `#00E5A0` | CTAs, active states, highlights |
| Primary Dim | `#00C27F` | Hover states |
| Background | `#06080A` | Page base |
| Surface | `#0C1210` | Cards, panels |
| Elevated | `#111A16` | Hover cards, dropdowns |
| Sidebar | `#090D0B` | Sidebar background |
| Border | `rgba(0,229,160,0.10)` | Default card borders |
| Border Strong | `rgba(0,229,160,0.28)` | Active/hover borders |
| Text Primary | `#EDF9F4` | Headings, values |
| Text Sub | `#8BA898` | Body, descriptions |
| Text Muted | `#4A6358` | Labels, placeholders |
| Danger | `#FF4D6A` | Errors, high risk, out of stock |
| Warning | `#FFB84D` | Low stock, caution, review |
| Info Blue | `#4D9FFF` | Stable, notice badges |

### Typography
| Role | Font | Size | Weight |
|---|---|---|---|
| Page Headings | Monospace | 28–32px | 800 |
| Section Labels | Monospace | 10–11px | 700 |
| Card Values / Numbers | Monospace | 26–32px | 800 |
| Table Data / SKUs | Monospace | 12–13px | 400–600 |
| Body / Descriptions | DM Sans | 12–14px | 400–500 |
| Badges | Monospace | 9px | 800 |

### Spacing
- Sidebar width: `240px`
- Main content padding: `28px 30px`
- Card padding: `20px 22px` (KPI) · `22px 24px` (chart/table)
- Table cell padding: `13–15px 20px`
- Gap between KPI cards: `14px`
- Gap between rows: `16–24px`

### Shadows & Glow
```
Card hover glow:    0 0 24px rgba(0,229,160,0.10)
Supervisor panel:   0 0 30px rgba(0,229,160,0.06)
Primary button:     0 0 20px rgba(0,229,160,0.28)
Active nav bar:     0 0 8px #00E5A0
Health bar glow:    0 0 8px [color]80
```

### Border Radius
| Element | Radius |
|---|---|
| Cards | 16px |
| KPI Cards | 16px |
| Buttons | 10px |
| Badges | 6px |
| Inputs | 10px |
| Table container | 16px |
| Icon squares | 9–12px |
| Nav items | 10px |
| Sidebar logo | 9px |
| User avatar | 50% (circle) |

---

*TijaratAI — Pakistan's AI-Powered E-Commerce Intelligence Platform*
*© 2026 TijaratAI. All rights reserved.*
