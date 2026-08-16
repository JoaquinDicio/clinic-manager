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

export type AppointmentWithClient = Appointment & {
  client: Client;
};

export type DBSchema = {
  clients: Client[];
  templates: Template[];
  schedules: Schedule[];
  appointments: Appointment[];
};
