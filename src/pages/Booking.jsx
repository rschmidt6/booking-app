import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { config } from "../config";
import BookingForm from "../components/BookingForm";

export default function Booking() {
  const { data: timeslots, isLoading } = useQuery({
    queryKey: ["Availability"],
    queryFn: () => axios.get(`${config.apiUrl}/Availability`),
  });

  if (isLoading) return <div>Loading available timeslots...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* //passing the timeslots data, if there isn't any, it will be an empty array */}
      <BookingForm timeslots={timeslots?.data || []} />
    </div>
  );
}
