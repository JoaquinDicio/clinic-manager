import StatCard from "../components/StatCard";
import { useState, useEffect } from "react";
import type { DashboardData } from "../types/dashboard";
import AppointmentCard from "../components/AppointmentCard";
import formatAppointmentToList from "../utils/formatAppointmentToList";
import { type AppointmentForList } from "../types/appointments";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );

  async function fetchDashboard() {
    const response = await fetch("http://localhost:8080/dashboard");

    const data = await response.json();

    const formattedAppointments = data.todayAppointments.map(
      (appointment: AppointmentForList) => formatAppointmentToList(appointment),
    );

    const formattedData = {
      ...data,
      todayAppointments: formattedAppointments,
    };

    setDashboardData(formattedData);
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Appointments Today"
          value={dashboardData?.appointmentsToday ?? 0}
        />

        <StatCard
          title="Pending Messages"
          value={dashboardData?.pendingMessages ?? 0}
        />

        <StatCard title="Sent Today" value={dashboardData?.sentToday ?? 0} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Today's Appointments</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardData?.todayAppointments?.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      </div>
    </div>
  );
}
