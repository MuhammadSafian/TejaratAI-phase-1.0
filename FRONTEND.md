# TijaratAI — Frontend Documentation

> AI-Powered E-Commerce Management Platform for sellers in Pakistan.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.1.6 | React framework (App Router, Turbopack) |
| **React** | 19 | UI library |
| **TypeScript** | 5.7.3 | Type-safe development |
| **Tailwind CSS** | 3.4.17 | Utility-first styling |
| **shadcn/ui** | Latest | Pre-built UI component library (50 components) |
| **Recharts** | 2.15.0 | Charts & data visualization |
| **Lucide React** | 0.544.0 | Icon library |
| **next-themes** | 0.4.6 | Dark/light theme support |
| **React Hook Form** | 7.54.1 | Form handling |
| **Zod** | 3.24.1 | Schema validation |
| **Sonner** | 1.7.1 | Toast notifications |
| **Vaul** | 1.1.2 | Drawer component |
| **date-fns** | 4.1.0 | Date utilities |

---

## Getting Started

```bash
# Install dependencies
npm install --legacy-peer-deps

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

Dev server runs at **http://localhost:3000** by default.

---

## Project Structure

```
tijarat-ai-overview/
├── app/                              # Next.js App Router pages
│   ├── layout.tsx                    # Root layout (fonts, theme provider, metadata)
│   ├── page.tsx                      # Landing page (/)
│   ├── globals.css                   # Global styles & CSS variables
│   ├── auth/
│   │   ├── login/page.tsx            # Login page (/auth/login)
│   │   └── sign-up/page.tsx          # Sign up page (/auth/sign-up)
│   ├── dashboard/
│   │   ├── layout.tsx                # Dashboard layout (sidebar + header)
│   │   ├── page.tsx                  # Main dashboard (/dashboard)
│   │   ├── sales/page.tsx            # Sales analytics (/dashboard/sales)
│   │   ├── ads/page.tsx              # Ads & campaigns (/dashboard/ads)
│   │   ├── inventory/page.tsx        # Inventory management (/dashboard/inventory)
│   │   ├── ai-insights/page.tsx      # AI insights center (/dashboard/ai-insights)
│   │   ├── customers/page.tsx        # Customer management (/dashboard/customers)
│   │   └── settings/page.tsx         # Settings (/dashboard/settings)
│   └── onboarding/
│       └── page.tsx                  # Onboarding wizard (/onboarding)
│
├── components/
│   ├── theme-provider.tsx            # next-themes wrapper component
│   ├── landing/                      # Landing page components
│   │   ├── navbar.tsx                # Top navigation bar
│   │   ├── hero.tsx                  # Hero section with CTA
│   │   ├── features.tsx              # 6 AI feature cards
│   │   ├── how-it-works.tsx          # Step-by-step flow
│   │   ├── pricing.tsx               # 3 pricing plan cards
│   │   └── footer.tsx                # Site footer
│   ├── dashboard/                    # Dashboard shared components
│   │   ├── sidebar.tsx               # Fixed sidebar navigation
│   │   ├── header.tsx                # Top header bar with notification dropdown
│   │   ├── ai-chat-widget.tsx        # Floating AI chat assistant with FAB toggle
│   │   ├── stat-cards.tsx            # 4 KPI metric cards
│   │   ├── sales-chart.tsx           # Monthly sales/profit/adSpend area chart
│   │   ├── weekly-chart.tsx          # Weekly orders & revenue bar chart
│   │   ├── ai-suggestions.tsx        # AI agent suggestion cards
│   │   ├── top-products.tsx          # Top selling products list
│   │   ├── ads-performance.tsx       # Ad campaigns performance table
│   │   └── recent-orders.tsx         # Recent orders table
│   ├── dashboard/sales/              # Sales page components
│   │   ├── sales-stat-cards.tsx      # 4 sales KPI cards
│   │   ├── revenue-chart.tsx         # Monthly revenue vs profit bar chart
│   │   ├── sales-by-category.tsx     # Donut chart by category
│   │   ├── sales-table.tsx           # Full orders table with status tabs
│   │   └── sales-summary.tsx         # Monthly comparison card
│   ├── dashboard/ads/                # Ads page components
│   │   ├── ads-stat-cards.tsx        # 4 ads KPI cards
│   │   ├── campaign-performance.tsx  # Campaign cards with filters
│   │   ├── ads-spend-chart.tsx       # Spend vs Revenue stacked chart
│   │   ├── ads-orders-table.tsx      # Orders attributed to ads
│   │   └── platform-breakdown.tsx    # Facebook vs Google comparison
│   ├── dashboard/inventory/          # Inventory page components
│   │   ├── inventory-stat-cards.tsx   # 4 stock KPI cards
│   │   ├── stock-levels-chart.tsx    # Stock movement bar chart
│   │   ├── low-stock-alerts.tsx      # Low/out-of-stock warning cards
│   │   ├── inventory-table.tsx       # Full product table with status tabs
│   │   └── category-stock.tsx        # Stock by category breakdown
│   ├── dashboard/ai/                 # AI Insights page components
│   │   ├── ai-stat-cards.tsx         # Optimization score, potential revenue
│   │   ├── insights-list.tsx         # Actionable insights with apply/dismiss
│   │   └── recent-activity.tsx       # Automated actions timeline
│   ├── dashboard/customers/          # Customers page components
│   │   ├── customer-stat-cards.tsx   # Customer KPIs
│   │   └── customer-table.tsx        # Detailed customer table
│   ├── dashboard/settings/           # Settings page components
│   │   ├── profile-settings.tsx      # Profile & company form
│   │   ├── store-connections.tsx     # Connected stores & ad accounts
│   │   ├── notification-settings.tsx # Alert toggle preferences
│   │   └── ai-automation-settings.tsx # Automation levels & agent controls
│   └── ui/                           # 50 shadcn/ui components
│       ├── button.tsx, input.tsx, card.tsx, badge.tsx, ...
│
├── hooks/
│   ├── use-mobile.tsx                # Mobile viewport detection hook
│   └── use-toast.ts                  # Toast notification hook
│
├── lib/
│   ├── utils.ts                      # cn() utility (clsx + tailwind-merge)
│   └── mock-data.ts                  # All mock data for dashboard
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.mjs
├── components.json                   # shadcn/ui configuration
└── eslint.config.mjs
```

---

## Routes & Pages

### 1. Landing Page — `/`

**File:** `app/page.tsx`

The public-facing marketing page that introduces TijaratAI to potential customers.

**Sections:**

| Section | Component | Description |
|---|---|---|
| **Navbar** | `landing/navbar.tsx` | Fixed top nav with logo, links (Features, How It Works, Pricing), Sign In & Get Started buttons. Mobile hamburger menu. |
| **Hero** | `landing/hero.tsx` | Main headline, two CTA buttons, and 3 social proof stats (300% ROAS, $2.4M Ad Waste Prevented, 1,200+ Stores). |
| **Features** | `landing/features.tsx` | 6 feature cards: AI Business Manager, Sales Analysis, Ads Optimization, Inventory Management, Profit & Loss Insights, Smart Alerts. |
| **How It Works** | `landing/how-it-works.tsx` | Step-by-step flow. |
| **Pricing** | `landing/pricing.tsx` | 3 plans: **Starter** (Free), **Growth** (PKR 2,500/month — Most Popular), **Enterprise** (Custom). |
| **Footer** | `landing/footer.tsx` | Site footer with links and branding. |

---

### 2. Authentication — `/auth/login` & `/auth/sign-up`

**Files:** `app/auth/login/page.tsx`, `app/auth/sign-up/page.tsx`

Both are client-side rendered with mock authentication (TODO: Supabase integration).

#### Login Page
- **Fields:** Email, Password (with show/hide toggle)
- **Actions:** Sign In → redirects to `/dashboard`

#### Sign Up Page
- **Fields:** Company Name, Full Name, Email, Password (min 6 chars)
- **Actions:** Create Account → redirects to `/onboarding`

---

### 3. Onboarding Wizard — `/onboarding`

**File:** `app/onboarding/page.tsx`

A 3-step guided setup wizard:

| Step | Title | Details |
|---|---|---|
| **Step 1** | Connect Store | Choose platform (Shopify, WooCommerce, Amazon, Daraz) + API key |
| **Step 2** | Connect Ads | Select ad platforms (Facebook Ads, Google Ads) |
| **Step 3** | All Set! | Summary + "Go to Dashboard" button |

---

### 4. Main Dashboard — `/dashboard`

**File:** `app/dashboard/page.tsx`

| Component | File | Description |
|---|---|---|
| **StatCards** | `stat-cards.tsx` | 4 KPIs: Today's Sales, Profit Margin, Ad Spend, Total Orders |
| **SalesChart** | `sales-chart.tsx` | Monthly area chart (Sales, Profit, Ad Spend) |
| **WeeklyChart** | `weekly-chart.tsx` | Weekly bar chart (orders & revenue) |
| **AIChatWidget** | `ai-chat-widget.tsx` | Floating AI assistant with FAB toggle icon (Bot/X) |
| **AISuggestions** | `ai-suggestions.tsx` | 4 AI-generated suggestions with action/dismiss |
| **TopProducts** | `top-products.tsx` | Top 5 products with trend indicators |
| **AdsPerformance** | `ads-performance.tsx` | 5 ad campaigns with ROAS, CPA |
| **RecentOrders** | `recent-orders.tsx` | 5 recent orders table |

---

### 5. Sales Analytics — `/dashboard/sales`

**File:** `app/dashboard/sales/page.tsx`

| Component | File | Description |
|---|---|---|
| **SalesStatCards** | `sales/sales-stat-cards.tsx` | 4 KPIs: Total Revenue (PKR 145,200), Items Sold (1,248), Avg Order Value (PKR 116), Total Customers (892) |
| **RevenueChart** | `sales/revenue-chart.tsx` | Monthly Revenue vs Profit bar chart (Jan–Jul) |
| **SalesByCategory** | `sales/sales-by-category.tsx` | Donut chart: Electronics (42%), Fashion (22%), Home (15%), Sports (12%), Accessories (9%) |
| **SalesSummary** | `sales/sales-summary.tsx` | Month-over-month comparison with progress bars, top product, busiest day |
| **SalesTable** | `sales/sales-table.tsx` | Full orders table with tab filters (All/Delivered/Shipped/Processing/Returned) |

---

### 6. Ads & Campaigns — `/dashboard/ads`

**File:** `app/dashboard/ads/page.tsx`

| Component | File | Description |
|---|---|---|
| **AdsStatCards** | `ads/ads-stat-cards.tsx` | 4 KPIs: Total Ad Spend (PKR 8,450), Revenue from Ads (PKR 28,750), ROAS (3.4x), Conversions (342) |
| **PlatformBreakdown** | `ads/platform-breakdown.tsx` | Side-by-side Facebook vs Google cards with metrics |
| **AdsSpendChart** | `ads/ads-spend-chart.tsx` | Stacked bar chart (FB/Google spend) + revenue line |
| **CampaignPerformance** | `ads/campaign-performance.tsx` | 8 campaign cards with tabs (All/Active/Paused/Ended), impressions, clicks, ROAS |
| **AdsOrdersTable** | `ads/ads-orders-table.tsx` | 8 orders attributed to specific ad campaigns |

---

### 7. Inventory Management — `/dashboard/inventory`

**File:** `app/dashboard/inventory/page.tsx`

| Component | File | Description |
|---|---|---|
| **InventoryStatCards** | `inventory/inventory-stat-cards.tsx` | 4 KPIs: Total SKUs (248), In Stock (198), Low Stock (35), Out of Stock (15) |
| **StockLevelsChart** | `inventory/stock-levels-chart.tsx` | Monthly stock movement bar chart (Received/Sold/Returned) |
| **CategoryStock** | `inventory/category-stock.tsx` | Stock distribution per category with progress bars & values |
| **LowStockAlerts** | `inventory/low-stock-alerts.tsx` | Color-coded alert cards for low/out-of-stock items with reorder action |
| **InventoryTable** | `inventory/inventory-table.tsx` | 12 products with SKU, stock bars, cost/price, supplier, status tabs |

---

### 8. AI Insights Center — `/dashboard/ai-insights`

**File:** `app/dashboard/ai-insights/page.tsx`

| Component | Description |
|-----------|-------------|
| `AIStatCards` | KPI cards for Optimization Score, Potential Revenue, etc. |
| `InsightsList` | Categorized list of actionable insights with "Apply" buttons. |
| `RecentActivity` | Timeline of automated AI actions. |

---

### 9. Customer Management — `/dashboard/customers`

**File:** `app/dashboard/customers/page.tsx`

| Component | Description |
|-----------|-------------|
| `CustomerStatCards` | Metrics for Total/Active/New/VIP customers. |
| `CustomerTable` | List of customers with segment filters and status badges. |

---

### 10. Settings Page — `/dashboard/settings`

**File:** `app/dashboard/ai-insights/page.tsx`

| Component | File | Description |
|---|---|---|
| **AIStatCards** | `ai/ai-stat-cards.tsx` | 4 KPIs: Optimization Score (78/100), Potential Revenue (PKR 12,450), Automated Actions (128), Time Saved (42 hrs) |
| **InsightsList** | `ai/insights-list.tsx` | 6 actionable insights from various agents (Sales, Ads, Inventory, Pricing, CRM) with impact level, potential value, apply/dismiss |
| **RecentActivity** | `ai/recent-activity.tsx` | Timeline of automated AI actions (bid adjustments, stock reorders, price updates, email campaigns) |

---

### 9. Settings — `/dashboard/settings`

**File:** `app/dashboard/settings/page.tsx`

| Component | File | Description |
|---|---|---|
| **ProfileSettings** | `settings/profile-settings.tsx` | Avatar, name, company, email, phone, **Business Goals**, **Constraints** fields. |
| **StoreConnections** | `settings/store-connections.tsx` | Connected stores (Shopify, WooCommerce, **Daraz** [App Key, Secret, Seller ID], **Amazon** [LWA, Secret, Seller ID, Marketplace ID]). |
| **NotificationSettings** | `settings/notification-settings.tsx` | Toggle switches — Channels (Email, Push, SMS), Alerts (Low Stock, Orders, Campaigns, AI), Reports (Weekly, Monthly) |
| **AIAutomationSettings** | `settings/ai-automation-settings.tsx` | 3 automation levels + 6 agents: **Supervisor**, **Sales Analysis**, **Ads & Budget**, **Inventory**, **Business Manager**, **Action & Alert**. |

---

## Dashboard Layout

**Sidebar Navigation:**

| Label | Route | Icon | Status |
|---|---|---|---|
| Dashboard | `/dashboard` | LayoutDashboard | ✅ |
| Sales | `/dashboard/sales` | BarChart3 | ✅ |
| Ads | `/dashboard/ads` | Megaphone | ✅ |
| Inventory | `/dashboard/inventory` | Package | ✅ |
| AI Insights | `/dashboard/ai-insights` | Bot | ✅ |
| Settings | `/dashboard/settings` | Settings | ✅ |

**Header:** Top bar with search input, functional notification bell (dropdown with 5 notifications, mark-all-read, dismiss, unread badge), and Sign Out button. (Language selection removed).

---

## Mock Data (`lib/mock-data.ts`)

All dashboard data is served from mock data structured to mirror future Supabase tables.

| Export | Type | Records | Used By |
|---|---|---|---|
| `mockDashboardStats` | Object | 1 | Main dashboard stat cards |
| `mockSalesData` | Array | 7 | Monthly sales area chart |
| `mockWeeklySales` | Array | 7 | Weekly bar chart |
| `mockAdsPerformance` | Array | 5 | Ads performance table |
| `mockTopProducts` | Array | 5 | Top products list |
| `mockAISuggestions` | Array | 4 | AI suggestions panel |
| `mockRecentOrders` | Array | 5 | Recent orders table |
| `mockSalesKPIs` | Object | 1 | Sales page stat cards |
| `mockSalesByCategory` | Array | 5 | Sales donut chart |
| `mockMonthlySalesComparison` | Object | 1 | Sales summary card |
| `mockMonthlyRevenueData` | Array | 7 | Revenue bar chart |
| `mockAllOrders` | Array | 8 | Sales orders table |
| `mockAdsKPIs` | Object | 1 | Ads page stat cards |
| `mockDetailedCampaigns` | Array | 8 | Campaign cards |
| `mockAdSpendTimeline` | Array | 7 | Ads spend chart |
| `mockPlatformStats` | Object | 1 | Platform breakdown cards |
| `mockAdOrders` | Array | 8 | Ads orders table |
| `mockInventoryKPIs` | Object | 1 | Inventory stat cards |
| `mockInventoryProducts` | Array | 12 | Inventory table |
| `mockStockByCategory` | Array | 5 | Category stock breakdown |
| `mockStockMovement` | Array | 7 | Stock movement chart |
| `mockAIStats` | Object | 1 | AI stat cards |
| `mockAIInsights` | Array | 6 | AI insights list |
| `mockRecentActivity` | Array | 5 | AI activity timeline |

**Currency:** PKR (Pakistani Rupee)  
**Target Market:** Pakistan

---

## Theming & Design

- **Theme Provider:** `next-themes` with dark mode as default
- **Color System:** CSS variables with HSL values (defined in `globals.css`)
- **Fonts:** Geist Sans + Geist Mono (Google Fonts via `next/font`)
- **Component Library:** shadcn/ui with `default` style, `neutral` base color, CSS variables enabled

---

## Custom Hooks

| Hook | File | Description |
|---|---|---|
| `useMobile` | `hooks/use-mobile.tsx` | Detects if viewport is mobile-sized |
| `useToast` | `hooks/use-toast.ts` | Toast notification state management |

---

## User Flow

```
Landing Page (/)
    │
    ├── Sign In → /auth/login → /dashboard
    │
    └── Sign Up → /auth/sign-up → /onboarding
                                       │
                                       ├── Step 1: Connect Store
                                       ├── Step 2: Connect Ads
                                       └── Step 3: All Set → /dashboard
                                                               │
                              ┌─────────────────────────────────┤
                              │                                 │
                         Sidebar Nav                     Header (Search, Notifications, Sign Out)
                              │
                    ┌─────────┼──────────┬──────────┬──────────┬──────────┐
                    │         │          │          │          │          │
                Dashboard   Sales      Ads     Inventory  AI Insights  Settings
```

---

## TODO / Pending Implementations

- [x] **AIChatWidget** — Added functional FAB with Bot/X toggle icons.
- [ ] **Supabase Integration** — Replace mock auth with Supabase Auth
- [ ] **Database Connection** — Replace `mock-data.ts` with real Supabase queries
- [ ] **Real-time Data** — Connect dashboard to live API endpoints
- [ ] **Store API Integration** — Implement Shopify/WooCommerce API connections
- [ ] **Ad Platform Integration** — Connect Facebook Ads & Google Ads APIs
- [ ] **AI Agent Backend** — Build multi-agent AI system
- [ ] **Role-Based Access** — Multi-tenant architecture
- [ ] **Responsive Polish** — Final testing across all breakpoints

---

*Last updated: February 15, 2026*
