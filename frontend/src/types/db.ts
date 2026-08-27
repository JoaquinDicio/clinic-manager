export type Client = {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
};

export type Template = {
  id: string;
  name: string;
  body: string;
  variables: string[];
  createdAt: string;
};

export type Schedule = {
  id: string;
  clientId: string;
  templateId: string | null;
  send_at: string;
  variables?: Record<string, string>;
  status: "pending" | "processing" | "sent" | "failed";
  createdAt: string;
};

export type Doctor = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  specialty: string | null;
  createdAt: string;
};

export type Treatment = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  active: boolean;
  createdAt: string;
};

export type Appointment = {
  id: string;
  clientId: string;
  doctorId: string | null;
  date: string;
  time: string;
  slots: number;
  reminder: boolean;
  note: string | null;
  templateId?: string | null;
  createdAt: string;
};

export type AppointmentTreatment = {
  appointmentId: string;
  treatmentId: string;
  price: number | null;
};

export type AppointmentWithClient = Appointment & {
  client: Client;
};

export type AppointmentFullInfo = Appointment & {
  client: Client;
  doctor: Doctor | null;
  treatments: Treatment[];
};

export type DBSchema = {
  clients: Client[];
  templates: Template[];
  schedules: Schedule[];
  appointments: Appointment[];
  treatments: Treatment[];
  appointmentTreatments: AppointmentTreatment[];
};
