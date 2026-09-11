-- =========================================================
-- RESET (solo desarrollo)
-- =========================================================

DROP TABLE IF EXISTS schedules CASCADE;
DROP TABLE IF EXISTS appointment_treatments CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS treatments CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS templates CASCADE;
DROP TABLE IF EXISTS clients CASCADE;


-- =========================================================
-- EXTENSIONS
-- =========================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- =========================================================
-- TABLES
-- =========================================================

CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    body TEXT NOT NULL,
    variables TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);


CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    specialty TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


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


CREATE TABLE treatments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


CREATE TABLE appointment_treatments (
    appointment_id UUID NOT NULL
        REFERENCES appointments(id)
        ON DELETE CASCADE,

    treatment_id UUID NOT NULL
        REFERENCES treatments(id)
        ON DELETE RESTRICT,

    price NUMERIC(10, 2),

    PRIMARY KEY (appointment_id, treatment_id)
);


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
        CHECK (
            status IN (
                'pending',
                'processing',
                'sent',
                'failed'
            )
        ),

    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =========================================================
-- INDEXES
-- =========================================================

CREATE INDEX idx_appointments_date_time
ON appointments (date, time);


CREATE INDEX idx_appointments_doctor_id
ON appointments (doctor_id);


CREATE INDEX idx_appointment_treatments_appointment_id
ON appointment_treatments (appointment_id);


CREATE INDEX idx_appointment_treatments_treatment_id
ON appointment_treatments (treatment_id);


CREATE INDEX idx_schedules_pending_send_at
ON schedules (send_at)
WHERE status = 'pending';


CREATE INDEX idx_schedules_appointment_id
ON schedules (appointment_id);


CREATE INDEX idx_schedules_client_id
ON schedules (client_id);


-- =========================================================
-- SEED: CLIENTS
-- =========================================================

INSERT INTO clients (name, phone)
VALUES
    ('Juan Pérez', '1123456789'),
    ('María González', '1134567890'),
    ('Carlos Rodríguez', '1145678901'),
    ('Lucía Fernández', '1156789012'),
    ('Sofía Martínez', '1167890123');


-- =========================================================
-- SEED: DOCTORS
-- =========================================================

INSERT INTO doctors (
    name,
    phone,
    email,
    specialty
)
VALUES
    (
        'Dr. Juan García',
        '1171234567',
        'juan.garcia@clinic.com',
        'Odontología general'
    ),
    (
        'Dra. Laura Martínez',
        '1182345678',
        'laura.martinez@clinic.com',
        'Ortodoncia'
    ),
    (
        'Dr. Martín López',
        '1193456789',
        'martin.lopez@clinic.com',
        'Cirugía dental'
    );


-- =========================================================
-- SEED: TREATMENTS
-- =========================================================

INSERT INTO treatments (
    name,
    description,
    price
)
VALUES
    (
        'Limpieza dental',
        'Limpieza y eliminación de sarro.',
        15000
    ),
    (
        'Control general',
        'Control y revisión general de la salud bucal.',
        10000
    ),
    (
        'Blanqueamiento dental',
        'Blanqueamiento dental profesional.',
        50000
    ),
    (
        'Extracción dental',
        'Extracción de pieza dental.',
        25000
    ),
    (
        'Restauración',
        'Restauración de pieza dental.',
        30000
    ),
    (
        'Consulta de ortodoncia',
        'Evaluación y seguimiento de tratamiento de ortodoncia.',
        20000
    );


-- =========================================================
-- SEED: TEMPLATES
-- =========================================================

INSERT INTO templates (
    name,
    body,
    variables
)
VALUES
    (
        'Recordatorio de turno',
        'Hola {{name}}, te recordamos que tenés un turno el {{date}} a las {{time}}.',
        ARRAY['name', 'date', 'time']
    ),
    (
        'Confirmación de turno',
        'Hola {{name}}, tu turno quedó confirmado para el {{date}} a las {{time}}.',
        ARRAY['name', 'date', 'time']
    ),
    (
        'Turno mañana',
        'Hola {{name}}, te recordamos que mañana tenés un turno a las {{time}}.',
        ARRAY['name', 'time']
    );


-- =========================================================
-- SEED: APPOINTMENTS
-- =========================================================

INSERT INTO appointments (
    client_id,
    doctor_id,
    date,
    time,
    slots,
    reminder,
    note
)
VALUES
    (
        (SELECT id FROM clients WHERE name = 'Juan Pérez'),
        (SELECT id FROM doctors WHERE name = 'Dr. Juan García'),
        CURRENT_DATE,
        '10:00',
        1,
        true,
        'Control general'
    ),
    (
        (SELECT id FROM clients WHERE name = 'María González'),
        (SELECT id FROM doctors WHERE name = 'Dra. Laura Martínez'),
        CURRENT_DATE,
        '11:00',
        2,
        true,
        'Seguimiento de ortodoncia'
    ),
    (
        (SELECT id FROM clients WHERE name = 'Carlos Rodríguez'),
        (SELECT id FROM doctors WHERE name = 'Dr. Martín López'),
        CURRENT_DATE + 1,
        '09:30',
        2,
        false,
        'Extracción'
    ),
    (
        (SELECT id FROM clients WHERE name = 'Lucía Fernández'),
        (SELECT id FROM doctors WHERE name = 'Dr. Juan García'),
        CURRENT_DATE + 2,
        '14:00',
        1,
        true,
        'Limpieza dental'
    );


-- =========================================================
-- SEED: APPOINTMENT TREATMENTS
-- =========================================================

INSERT INTO appointment_treatments (
    appointment_id,
    treatment_id,
    price
)
VALUES
    (
        (
            SELECT a.id
            FROM appointments a
            JOIN clients c ON c.id = a.client_id
            WHERE c.name = 'Juan Pérez'
            AND a.date = CURRENT_DATE
            AND a.time = '10:00'
        ),
        (
            SELECT id
            FROM treatments
            WHERE name = 'Control general'
        ),
        (
            SELECT price
            FROM treatments
            WHERE name = 'Control general'
        )
    ),

    (
        (
            SELECT a.id
            FROM appointments a
            JOIN clients c ON c.id = a.client_id
            WHERE c.name = 'María González'
            AND a.date = CURRENT_DATE
            AND a.time = '11:00'
        ),
        (
            SELECT id
            FROM treatments
            WHERE name = 'Consulta de ortodoncia'
        ),
        (
            SELECT price
            FROM treatments
            WHERE name = 'Consulta de ortodoncia'
        )
    ),

    (
        (
            SELECT a.id
            FROM appointments a
            JOIN clients c ON c.id = a.client_id
            WHERE c.name = 'Carlos Rodríguez'
            AND a.date = CURRENT_DATE + 1
            AND a.time = '09:30'
        ),
        (
            SELECT id
            FROM treatments
            WHERE name = 'Extracción dental'
        ),
        (
            SELECT price
            FROM treatments
            WHERE name = 'Extracción dental'
        )
    ),

    (
        (
            SELECT a.id
            FROM appointments a
            JOIN clients c ON c.id = a.client_id
            WHERE c.name = 'Lucía Fernández'
            AND a.date = CURRENT_DATE + 2
            AND a.time = '14:00'
        ),
        (
            SELECT id
            FROM treatments
            WHERE name = 'Limpieza dental'
        ),
        (
            SELECT price
            FROM treatments
            WHERE name = 'Limpieza dental'
        )
    );


-- =========================================================
-- FIN
-- =========================================================