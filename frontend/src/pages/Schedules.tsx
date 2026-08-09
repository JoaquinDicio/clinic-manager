import { useState, useEffect } from "react";
import type { Schedule } from "../types/db";
import { getSchedules, deleteSchedule } from "../services/schedules.service";
import Table from "../components/Table";

export default function Schedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSchedules();
  }, []);

  async function fetchSchedules() {
    try {
      const response = await getSchedules();
      const data = await response.json();
      setSchedules(data);
    } catch (err) {
      setError("Error fetching schedules");
      console.error("Error:", err);
    }
  }

  async function fetchDelete(scheduleId: string) {
    try {
      const response = await deleteSchedule(scheduleId);

      if (response.ok) {
        setSchedules((prevSchedules) =>
          prevSchedules.filter((schedule) => schedule.id !== scheduleId),
        );
      }
    } catch (err) {
      setError("Error deleting schedule");
      console.error("Error:", err);
    }
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="pt-10">
      {schedules.length == 0 ? (
        <i>There is no pending schedules.</i>
      ) : (
        <Table
          cols={[
            { header: "Client", accessor: (row) => row.client_id },
            { header: "Status", accessor: (row) => row.status },
            { header: "Time", accessor: (row) => row.formattedSendAt },
          ]}
          data={schedules}
          onDelete={(id) => fetchDelete(id)}
        />
      )}
    </div>
  );
}
