import { type Appointment } from "./db";

export interface AppointmentForm {
  clientId: string;
  date: string;
  time: string;
  reminder: boolean;
  templateId?: string;
  slots: number;
}

export interface AppointmentsWithClient extends Appointment {
  formatted_date: string;
  client: {
    id: string;
    name: string;
    phone: string;
  };
}
