import type { AppointmentWithClient } from "./appointments";

export interface AppointmentDashboard extends AppointmentWithClient {
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
