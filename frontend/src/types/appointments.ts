export interface AppointmentForm {
  clientId: string;
  date: string;
  time: string;
  reminder: boolean;
  templateId?: string;
  slots: number;
}
