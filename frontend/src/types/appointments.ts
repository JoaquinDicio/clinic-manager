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
  treatmentIds: string[];
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

export type AppointmentListItem = {
  id: string;
  date: string;
  time: string;
  endTime: string;

  client: {
    id: string;
    name: string;
    phone: string;
  };

  doctor: {
    id: string;
    name: string;
  } | null;

  treatments: {
    id: string;
    name: string;
  }[];
};
