-- TimescaleDB extension enable karo
CREATE EXTENSION IF NOT EXISTS timescaledb;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ── Sellers ────────────────────────────────────────────
CREATE TABLE sellers (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name          VARCHAR(200) NOT NULL,
    phone         VARCHAR(20) UNIQUE NOT NULL,
    email         VARCHAR(200) UNIQUE,
    password_hash VARCHAR(200) NOT NULL,
    plan          VARCHAR(20) DEFAULT 'free',   -- free | pro | enterprise
    language_pref VARCHAR(10) DEFAULT 'roman_urdu',  -- roman_urdu | nastaleeq | english
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Platform Tokens (Encrypted) ────────────────────────
CREATE TABLE platform_tokens (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id       UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    platform        VARCHAR(20) NOT NULL,   -- shopify | daraz | woocommerce
    encrypted_token TEXT NOT NULL,           -- AES-256 Fernet encrypted JSON
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(seller_id, platform)
);

-- ── Seller Config ───────────────────────────────────────
CREATE TABLE seller_config (
    seller_id              UUID PRIMARY KEY REFERENCES sellers(id),
    packaging_cost_per_order  DECIMAL(10,2) DEFAULT 50.00,
    avg_ad_cost_per_order     DECIMAL(10,2) DEFAULT 0.00,
    monthly_rent              DECIMAL(10,2) DEFAULT 0.00,
    team_cost_daily           DECIMAL(10,2) DEFAULT 0.00,
    electricity_monthly       DECIMAL(10,2) DEFAULT 0.00,
    default_courier           VARCHAR(20) DEFAULT 'auto',
    whatsapp_notifications    BOOLEAN DEFAULT TRUE,
    share_rto_data            BOOLEAN DEFAULT FALSE,   -- opt-in for community RTO DB
    seller_city               VARCHAR(100),
    updated_at                TIMESTAMPTZ DEFAULT NOW()
);

-- ── Custom Variable Expenses (Added to Blueprint) ───────
CREATE TABLE variable_expenses (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id       UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    expense_date    DATE NOT NULL,
    amount          DECIMAL(10,2) NOT NULL,
    category        VARCHAR(100), -- 'marketing', 'logistics', 'misc'
    description     TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Orders ─────────────────────────────────────────────
CREATE TABLE orders (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id       UUID NOT NULL REFERENCES sellers(id),
    platform_order_id VARCHAR(100) NOT NULL,
    platform        VARCHAR(20) NOT NULL,
    order_value     DECIMAL(12,2) NOT NULL,
    customer_phone  VARCHAR(20),
    customer_city   VARCHAR(100),
    customer_address TEXT,
    payment_method  VARCHAR(20),   -- cod | prepaid
    status          VARCHAR(30),
    cod_confirmed   BOOLEAN,
    rto_score       SMALLINT,
    true_roi        DECIMAL(8,2),
    courier_used    VARCHAR(20),
    created_at      TIMESTAMPTZ NOT NULL,
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(seller_id, platform, platform_order_id)
);
-- TimescaleDB hypertable
SELECT create_hypertable('orders', 'created_at');

-- ── Order Items ─────────────────────────────────────────
CREATE TABLE order_items (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    sku         VARCHAR(100),
    product_name VARCHAR(300),
    quantity    INTEGER NOT NULL DEFAULT 1,
    unit_price  DECIMAL(10,2),
    cost_price  DECIMAL(10,2)
);

-- ── Inventory ───────────────────────────────────────────
CREATE TABLE inventory (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id           UUID NOT NULL REFERENCES sellers(id),
    sku                 VARCHAR(100) NOT NULL,
    product_name        VARCHAR(300) NOT NULL,
    quantity            INTEGER NOT NULL DEFAULT 0,
    cost_price          DECIMAL(10,2),
    selling_price       DECIMAL(10,2),
    lead_time_days      INTEGER DEFAULT 7,
    max_lead_time_days  INTEGER DEFAULT 10,
    reorder_point       DECIMAL(8,2),
    supplier_name       VARCHAR(200),
    supplier_phone      VARCHAR(20),
    shopify_variant_id  VARCHAR(100),
    daraz_seller_sku    VARCHAR(100),
    weight_grams        INTEGER DEFAULT 500,
    last_restocked_at   TIMESTAMPTZ,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(seller_id, sku)
);

-- ── RTO History (National COD Database) ─────────────────
CREATE TABLE rto_history (
    id              BIGSERIAL PRIMARY KEY,
    phone_number    VARCHAR(20) NOT NULL,
    city            VARCHAR(100) NOT NULL,
    courier         VARCHAR(30),
    order_delivered BOOLEAN DEFAULT FALSE,
    order_returned  BOOLEAN DEFAULT FALSE,
    return_reason   VARCHAR(100),
    seller_id       UUID REFERENCES sellers(id),  -- NULL = community
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_rto_phone  ON rto_history(phone_number);
CREATE INDEX idx_rto_city   ON rto_history(city, courier);
CREATE INDEX idx_rto_seller ON rto_history(seller_id);
SELECT create_hypertable('rto_history', 'created_at');

-- ── City-Courier RTO Rate Materialized View ────────────
CREATE MATERIALIZED VIEW city_courier_rto_rate AS
SELECT
    city,
    courier,
    COUNT(*) AS total_orders,
    SUM(CASE WHEN order_returned THEN 1 ELSE 0 END) AS returned,
    ROUND(
        SUM(CASE WHEN order_returned THEN 1 ELSE 0 END)::numeric / COUNT(*) * 100, 2
    ) AS return_rate_pct
FROM rto_history
WHERE created_at >= NOW() - INTERVAL '90 days'
GROUP BY city, courier;

CREATE UNIQUE INDEX ON city_courier_rto_rate (city, courier);

-- ── Shipments ───────────────────────────────────────────
CREATE TABLE shipments (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id         UUID NOT NULL REFERENCES orders(id),
    seller_id        UUID NOT NULL REFERENCES sellers(id),
    courier          VARCHAR(30) NOT NULL,
    tracking_number  VARCHAR(100) UNIQUE NOT NULL,
    status           VARCHAR(30) DEFAULT 'created',
    attempt_count    SMALLINT DEFAULT 0,
    shipped_at       TIMESTAMPTZ,
    delivered_at     TIMESTAMPTZ,
    returned_at      TIMESTAMPTZ,
    cod_amount       DECIMAL(10,2),
    cod_remitted     BOOLEAN DEFAULT FALSE,
    cod_remitted_at  TIMESTAMPTZ,
    expected_remittance_date TIMESTAMPTZ,
    created_at       TIMESTAMPTZ DEFAULT NOW()
);
SELECT create_hypertable('shipments', 'created_at');

-- ── Platform Tokens rotation log ────────────────────────
CREATE TABLE token_rotation_log (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id   UUID REFERENCES sellers(id),
    platform    VARCHAR(20),
    rotated_at  TIMESTAMPTZ DEFAULT NOW(),
    rotated_by  VARCHAR(50)  -- "scheduled" | "manual" | "security_alert"
);

-- ── Refresh Tokens ──────────────────────────────────────
CREATE TABLE refresh_tokens (
    jti         UUID PRIMARY KEY,
    seller_id   UUID NOT NULL REFERENCES sellers(id),
    expires_at  TIMESTAMPTZ NOT NULL,
    revoked     BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_rt_seller ON refresh_tokens(seller_id);

-- ── Additional Indexes ──────────────────────────────────────
CREATE INDEX idx_orders_seller_time ON orders(seller_id, created_at DESC);
CREATE INDEX idx_orders_city       ON orders(seller_id, customer_city);
CREATE INDEX idx_orders_status     ON orders(seller_id, status);
CREATE INDEX idx_inventory_seller ON inventory(seller_id);
CREATE INDEX idx_inventory_sku    ON inventory(seller_id, sku);
CREATE INDEX idx_rto_phone_recent ON rto_history(phone_number, created_at DESC);
CREATE INDEX idx_shipments_remittance ON shipments(seller_id, cod_remitted, delivered_at);
CREATE INDEX idx_rt_expires ON refresh_tokens(expires_at) WHERE revoked = FALSE;

-- ══════════════════════════════════════════════════════════
-- ── Row Level Security (Multi-Tenant Isolation) ──────────
-- ══════════════════════════════════════════════════════════
-- Every seller can ONLY see their own data. Agar koi query
-- mein seller_id bhool bhi gaya, RLS will block it.

-- Create app role (used by AI Core / Gateway connections)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'tijarat_app') THEN
        CREATE ROLE tijarat_app LOGIN PASSWORD 'app_password';
    END IF;
END $$;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO tijarat_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO tijarat_app;

-- ── Enable RLS on all seller-scoped tables ──────────────
ALTER TABLE orders             ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory          ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_tokens    ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_config      ENABLE ROW LEVEL SECURITY;
ALTER TABLE variable_expenses  ENABLE ROW LEVEL SECURITY;
ALTER TABLE rto_history        ENABLE ROW LEVEL SECURITY;

-- ── RLS Policies ────────────────────────────────────────
-- App sets: SET app.current_seller_id = '<uuid>' before queries

CREATE POLICY seller_orders ON orders
    FOR ALL TO tijarat_app
    USING (seller_id::text = current_setting('app.current_seller_id', true));

CREATE POLICY seller_order_items ON order_items
    FOR ALL TO tijarat_app
    USING (order_id IN (
        SELECT id FROM orders WHERE seller_id::text = current_setting('app.current_seller_id', true)
    ));

CREATE POLICY seller_inventory ON inventory
    FOR ALL TO tijarat_app
    USING (seller_id::text = current_setting('app.current_seller_id', true));

CREATE POLICY seller_shipments ON shipments
    FOR ALL TO tijarat_app
    USING (seller_id::text = current_setting('app.current_seller_id', true));

CREATE POLICY seller_platform_tokens ON platform_tokens
    FOR ALL TO tijarat_app
    USING (seller_id::text = current_setting('app.current_seller_id', true));

CREATE POLICY seller_config_policy ON seller_config
    FOR ALL TO tijarat_app
    USING (seller_id::text = current_setting('app.current_seller_id', true));

CREATE POLICY seller_expenses ON variable_expenses
    FOR ALL TO tijarat_app
    USING (seller_id::text = current_setting('app.current_seller_id', true));

CREATE POLICY seller_rto ON rto_history
    FOR ALL TO tijarat_app
    USING (
        seller_id IS NULL  -- Community data (shared, no seller_id)
        OR seller_id::text = current_setting('app.current_seller_id', true)
    );

-- Superuser (tijarat) bypasses all RLS — used for admin tasks
ALTER TABLE orders            FORCE ROW LEVEL SECURITY;
ALTER TABLE order_items       FORCE ROW LEVEL SECURITY;
ALTER TABLE inventory         FORCE ROW LEVEL SECURITY;
ALTER TABLE shipments         FORCE ROW LEVEL SECURITY;
ALTER TABLE platform_tokens   FORCE ROW LEVEL SECURITY;
ALTER TABLE seller_config     FORCE ROW LEVEL SECURITY;
ALTER TABLE variable_expenses FORCE ROW LEVEL SECURITY;
ALTER TABLE rto_history       FORCE ROW LEVEL SECURITY;
