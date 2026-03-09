-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL,
    email       TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    phone       TEXT,
    city        TEXT,
    state       TEXT,
    country     TEXT DEFAULT 'India',
    address     TEXT,
    alert_dashboard BOOLEAN DEFAULT true,
    alert_email     BOOLEAN DEFAULT true,
    alert_sms       BOOLEAN DEFAULT false,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON public.users(email);

-- ============================================================
-- PREDICTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.predictions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES public.users(id) ON DELETE CASCADE,
    location        TEXT NOT NULL,
    rainfall        NUMERIC(8,2),
    river_level     NUMERIC(6,2),
    soil_moisture   NUMERIC(4,3),
    risk_probability NUMERIC(5,4),
    risk_level      TEXT CHECK (risk_level IN ('Low','Medium','High','Critical')),
    prediction_window INTEGER DEFAULT 24,
    prediction_time TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_predictions_user ON public.predictions(user_id);
CREATE INDEX idx_predictions_location ON public.predictions(location);

-- ============================================================
-- ALERTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.alerts (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id      UUID REFERENCES public.users(id) ON DELETE CASCADE,
    location     TEXT NOT NULL,
    state        TEXT,
    risk_level   TEXT CHECK (risk_level IN ('Low','Medium','High','Critical')),
    probability  NUMERIC(5,4),
    impact_window TEXT,
    rainfall     NUMERIC(8,2),
    is_read      BOOLEAN DEFAULT false,
    timestamp    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alerts_user ON public.alerts(user_id);
CREATE INDEX idx_alerts_location ON public.alerts(location);
CREATE INDEX idx_alerts_risk ON public.alerts(risk_level);

-- ============================================================
-- LOCATIONS TABLE (for future GIS)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.locations (
    id          SERIAL PRIMARY KEY,
    city        TEXT NOT NULL,
    state       TEXT,
    country     TEXT DEFAULT 'India',
    latitude    NUMERIC(10,6),
    longitude   NUMERIC(10,6),
    UNIQUE(city, state)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.users       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts      ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own record
CREATE POLICY "users_own_data" ON public.users
    USING (id::text = current_setting('app.user_id', true))
    WITH CHECK (id::text = current_setting('app.user_id', true));

-- Users can only see their own predictions
CREATE POLICY "predictions_own_data" ON public.predictions
    USING (user_id::text = current_setting('app.user_id', true));

-- Users can only see their own alerts
CREATE POLICY "alerts_own_data" ON public.alerts
    USING (user_id::text = current_setting('app.user_id', true));
