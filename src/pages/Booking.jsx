import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { config } from "../config";

export default function Booking() {
  const { data: timeslots, isLoading } = useQuery({
    queryKey: ["Availability"],
    queryFn: () => axios.get(`${config.apiUrl}/Availability`),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Availability</h2>
      <div className="grid gap-4">
        {timeslots?.data?.map((appt) => (
          <div key={appt.id} className="border p-4 rounded-lg shadow">
            <div className="mt-2 text-gray-600">
              <p>Date: {appt.date}</p>
              <p>
                Time: {appt.start_time} - {appt.end_time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
