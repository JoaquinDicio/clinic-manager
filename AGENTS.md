# AGENTS.md — clinic-manager

Monorepo sin workspaces. Dos apps independientes: `backend/` (Express) + `frontend/` (React Vite). Sin script root, sin tests.

## Comandos

Backend (`backend/`, puerto 8080):
- `npm run dev` → `nodemon --exec tsx src/main.ts`
- `npm run db:init` → `sudo -u postgres psql -d wpp_auto -f src/db/init.sql` (DESTRUCTIVO, hace DROP TABLE, solo dev)

Frontend (`frontend/`, puerto 5173):
- `npm run dev` / `npm run build` (`tsc -b && vite build`) / `npm run lint` / `npm run preview`

DB local Postgres: `DB_HOST=localhost DB_USER=postgres DB_PASSWORD=1234 DB_NAME=wpp_auto` (ver `backend/.env`, gitignored).

## Estructura

```
backend/src/
  main.ts (monta routers, conecta WhatsApp, inicia dispatcher)
  routes/ controllers/ services/ validators/ middlewares/
  routes/whatsappPublic.routes.ts (GET /whatsapp/status, /whatsapp/qr y /whatsapp/events SSE, SIN guard)
  jobs/dispatcher.ts (node-cron, envía schedules pendientes)
  config/whatsapp.ts (Baileys: socket WS, auth en baileys_auth/, QR + estado por eventos)
  db/connection.ts (pg Pool) + db.ts (SOLO types TS) + db/init.sql (schema + seed)
frontend/src/
  pages/ (Dashboard, Clients, Appointments, Templates, Schedules, Doctors, Treatments)
  components/ (Table, ModalContainer, New*Form, AppointmentCard, etc.)
  services/*.service.ts (fetch nativo a http://localhost:8080) + hooks/useX.tsx
  types/ + utils/ + layout/AppLayout.tsx + App.tsx (react-router v7 anidado)
```

## Modelo de datos (Postgres, `init.sql` es fuente de verdad)

`clients` → `appointments` ← `doctors` | `appointments` ↔ `appointment_treatments` ↔ `treatments` | `schedules` (client_id + appointment_id + template_id, `status: pending|processing|sent|failed`)

Contratos API clave (`backend/src/db/db.ts`):
- `AppointmentListItem { id, date, time, endTime, client{id,name,phone}, doctor{id,name}|null, treatments[{id,name}] }`
- `AppointmentFullInfo = Appointment + { client, doctor|null, treatments[] }`

## Convenciones obligatorias

Backend:
- ESM + TS estricto. Imports internos SIEMPRE con extensión `.js` (ej: `../db/db.js`). Target ES2022, module NodeNext.
- Capas: `routes/*.routes.ts` → `controllers/*` → `services/*` → `pg Pool`. Validar todo input con `zod` en `validators/`.
- Errores: lanzar `AppError(statusCode, msg)` desde services, cierra con `errorMiddleware` al final de `main.ts`.
- SQL: `pg` con parámetros `$1`, mapear `snake_case` → `camelCase` con alias (`client_id AS "clientId"`, `created_at AS "createdAt"`). Para objetos anidados usar `json_build_object` + `json_agg` + `COALESCE(..., '[]')` (ver `services/appointments.service.ts`).
- Nombres de tablas/columnas en inglés snake_case, respuestas JSON en camelCase.
- Variables de templates: fuente de verdad `utils/templateData.ts` (`buildTemplateData` + hint `GET /templates/variables`). Agregar un campo = una línea en el builder.

Frontend:
- `services/` hace `fetch` + `response.json()`, `hooks/useX.tsx` maneja estado. No agregar Axios/React Query sin consultar.
- Estado WhatsApp: `WhatsappStatusProvider` (SSE `GET /whatsapp/events`, sin polling) + `useWhatsappStatus` (`{connected, qr}`). `RequireWhatsapp` redirige a `/whatsapp` si desconectado; página `Whatsapp.tsx` muestra el QR que llega por push. Badge en `Header`.
- Routing bajo `<Route element={<AppLayout/>}>` en `App.tsx`. Nuevas pages van ahí + link en `components/Sidebar.tsx`.
- Estilos con Tailwind v4 (`@tailwindcss/vite`), iconos con `lucide-react`. Formularios siguen patrón `New*Form.tsx` + `ModalContainer`.
- URLs API hardcodeadas a `http://localhost:8080` hoy — mantener hasta centralizar en env/cliente común.

## DB local: reglas (datos descartables)

- Se permite borrar todo, editar `init.sql` libremente y re-correr `db:init`. NO hacer migraciones.
- Respetar FKs: `appointments.client_id ON DELETE CASCADE`, `doctor_id ON DELETE SET NULL`, `appointment_treatments` con PK compuesta + `ON DELETE CASCADE/RESTRICT`.
- Seed mínimo ya existe en `init.sql` (5 clientes, 3 doctores, 6 tratamientos, 3 templates, 4 appointments). Si agregás tablas, agregá seed.

## No hacer

- `lowdb` / `db.json` eliminados (punto 1 hecho); no revivir, el backend usa solo `pg`.
- No commitear `backend/.env`, `.wwebjs_auth/`, `.wwebjs_cache/` (ya gitignored).
- No cambiar contrato `AppointmentListItem` / `AppointmentFullInfo` sin actualizar `frontend/src/types/` + `utils/formatAppointmentToList.ts`.
- No bloquear boot en `main.ts`: `connectToWhatsapp()` + `startDispatcher()` son efectos al inicio, `/wpp` exige `checkWhatsappReady`.
- Ojo bugs conocidos, no replicar: `PUT /appointments/:id` hoy llama a `create` (ver `appointments.routes.ts:10`); `update()` en service solo toca 4 campos; cálculo de reminder usa `hour +3` manual y crea schedule sin transacción.

## Estado actual (ver `todo.md`)

Hecho: create appointment retorna full info, AppointmentCard con edit/delete, treatments como tabla separada en DB, quitar "hoy" del dashboard. Pendiente: page de tratamientos ya existe (`pages/Treatments.tsx`) pero verificar CRUD completo; `getAppointmentsWithClient` debe migrarse al schema con doctor+treatments.
