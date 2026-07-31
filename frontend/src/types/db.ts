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
  client_id: string;
  template_id: string | null;
  sendAt: string;
  variables?: Record<string, string>;
  status: "pending" | "processing" | "sent" | "failed";
  createdAt: string;
};

export type Appointment = {
  id: string;
  client_id: string;
  date: string;
  time: string;
  slots: number;
  reminder: boolean;
  createdAt: string;
};

export type DBSchema = {
  clients: Client[];
  templates: Template[];
  schedules: Schedule[];
  appointments: Appointment[];
};
