-- =========================
-- RESET (solo desarrollo)
-- =========================

DROP TABLE IF EXISTS schedules CASCADE;
DROP TABLE IF EXISTS appointment_treatments CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS treatments CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
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

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- TEMPLATES
-- =========================

CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL,
    body TEXT NOT NULL,
    variables TEXT[],

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- DOCTORS
-- =========================

CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    specialty TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- APPOINTMENTS
-- Turnos con duración en slots de 30 min
-- =========================

CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    client_id UUID
        REFERENCES clients(id)
        ON DELETE CASCADE,

    doctor_id UUID
        REFERENCES doctors(id)
        ON DELETE SET NULL,

    date DATE NOT NULL,
    time TIME NOT NULL,

    slots INTEGER NOT NULL DEFAULT 1
        CHECK (slots > 0),

    reminder BOOLEAN DEFAULT true,
    note TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice útil para consultas de agenda
CREATE INDEX idx_appointments_date_time
ON appointments (date, time);

-- Índice para consultas por doctor
CREATE INDEX idx_appointments_doctor_id
ON appointments (doctor_id);

-- =========================
-- TREATMENTS
-- Catálogo de tratamientos
-- =========================

CREATE TABLE treatments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL,
    description TEXT,

    price NUMERIC(10, 2),

    active BOOLEAN DEFAULT true,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- APPOINTMENT TREATMENTS
-- Relación entre appointments y treatments
-- =========================

CREATE TABLE appointment_treatments (
    appointment_id UUID NOT NULL
        REFERENCES appointments(id)
        ON DELETE CASCADE,

    treatment_id UUID NOT NULL
        REFERENCES treatments(id)
        ON DELETE RESTRICT
        
    price NUMERIC(10, 2),

    PRIMARY KEY (appointment_id, treatment_id)
);

-- Índice para búsquedas por appointment
CREATE INDEX idx_appointment_treatments_appointment_id
ON appointment_treatments (appointment_id);

-- Índice para búsquedas por treatment
CREATE INDEX idx_appointment_treatments_treatment_id
ON appointment_treatments (treatment_id);

-- =========================
-- SCHEDULES
-- Cada schedule = 1 mensaje a 1 cliente
-- Puede estar asociado opcionalmente a un appointment
-- =========================

CREATE TABLE schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    client_id UUID NOT NULL
        REFERENCES clients(id)
        ON DELETE CASCADE,

    appointment_id UUID
        REFERENCES appointments(id)
        ON DELETE SET NULL,

    template_id UUID
        REFERENCES templates(id)
        ON DELETE SET NULL,

    body TEXT NOT NULL,

    send_at TIMESTAMPTZ NOT NULL,

    status TEXT DEFAULT 'pending'
        CHECK (status IN ('pending', 'processing', 'sent', 'failed')),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para buscar recordatorios pendientes rápidamente
CREATE INDEX idx_schedules_pending_send_at
ON schedules (send_at)
WHERE status = 'pending';

-- Índice para búsquedas por appointment
CREATE INDEX idx_schedules_appointment_id
ON schedules (appointment_id);

-- Índice para búsquedas por cliente
CREATE INDEX idx_schedules_client_id
ON schedules (client_id);