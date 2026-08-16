import { type Appointment } from "./db";

export interface AppointmentForm {
  clientId: string;
  date: string;
  time: string;
  reminder: boolean;
  templateId?: string;
  doctorId: string;
  note: string;
  slots: number;
}

export interface AppointmentsWithClient extends Appointment {
  formattedDate: string;
  client: {
    id: string;
    name: string;
    phone: string;
  };
}
