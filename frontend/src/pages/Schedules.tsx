import { useState, useEffect } from "react";
import type { Schedule } from "../types/db";
import { getSchedules } from "../services/schedules.service";

export default function Schedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSchedules();
  });

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
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  return (
    <div>
      <ul className="pt-10 grid gap-2 grid-cols-3">
        {schedules.map((schedule) => (
          <li
            key={schedule.id}
            className="bg-white gap-3 w-full hover:shadow-sm duration-75 p-4 rounded-sm flex flex-col"
          >
            <div className="flex justify-between items-center">
              <p className="font-bold">{schedule.client_id}</p>
              <p className="font-bold">{schedule.status}</p>
            </div>
            <i className="text-sm">Time:{schedule.sendAt}</i>
            <i className="text-xs"># {schedule.id}</i>
          </li>
        ))}
      </ul>
    </div>
  );
}
