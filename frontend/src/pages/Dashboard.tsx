import StatCard from "../components/StatCard";
import { useState, useEffect } from "react";
import type { DashboardData } from "../types/dashboard";
import AppointmentCard from "../components/AppointmentCard";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );

  useEffect(() => {
    fetch("http://localhost:8080/dashboard")
      .then((res) => res.json())
      .then((data: DashboardData) => {
        setDashboardData(data);
      });
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
