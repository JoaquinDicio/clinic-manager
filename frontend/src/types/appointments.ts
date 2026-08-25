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

export interface AppointmentWithClient extends Appointment {
  formattedDate: string;
  formattedTime: string;
  formattedEndTime: string;
  client: {
    id: string;
    name: string;
    phone: string;
  };
}
