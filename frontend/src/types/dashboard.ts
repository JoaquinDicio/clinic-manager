import type { AppointmentsWithClient } from "./appointments";

export interface AppointmentDashboard extends AppointmentsWithClient {
  formattedDate: string;
  formattedTime: string;
  formattedEndTime: string;
}

export type DashboardData = {
  appointmentsToday: number;
  pendingMessages: number;
  sentToday: number;
  todayAppointments: AppointmentDashboard[];
};
