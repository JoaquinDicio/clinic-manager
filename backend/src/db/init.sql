-- =========================
-- RESET (solo desarrollo)
-- =========================

DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS schedules CASCADE;
DROP TABLE IF EXISTS templates CASCADE;
DROP TABLE IF EXISTS clients CASCADE;

-- =========================
-- EXTENSIONS
-- =========================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================
-- CLIENTS
-- =========================

CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    created_at timestamptz DEFAULT NOW()
);

-- =========================
-- TEMPLATES
-- =========================

CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    body TEXT NOT NULL,
    variables TEXT[],
    created_at timestamptz DEFAULT NOW()
);

-- =========================
-- SCHEDULES
-- Cada schedule = 1 mensaje a 1 cliente
-- =========================

CREATE TABLE schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    client_id UUID NOT NULL
        REFERENCES clients(id)
        ON DELETE CASCADE,

    template_id UUID
        REFERENCES templates(id)
        ON DELETE SET NULL,

    variables JSONB,

    send_at timestamptz NOT NULL,

    status TEXT DEFAULT 'pending'
        CHECK (status IN ('pending','processing','sent','failed')),

    created_at timestamptz DEFAULT NOW()
);

-- índice para buscar recordatorios pendientes rápido
CREATE INDEX idx_schedules_pending_send_at
ON schedules (send_at)
WHERE status = 'pending';

-- =========================
-- APPOINTMENTS
-- Turnos con duración en slots de 30 min
-- =========================

CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    client_id UUID
        REFERENCES clients(id)
        ON DELETE CASCADE,

    date DATE NOT NULL,
    time TIME NOT NULL,

    slots INTEGER NOT NULL DEFAULT 1
        CHECK (slots > 0),

    reminder BOOLEAN DEFAULT true,

    created_at timestamptz DEFAULT NOW()
);

-- índice útil para consultas de agenda
CREATE INDEX idx_appointments_date_time
ON appointments (date, time);