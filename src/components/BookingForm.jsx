import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { config } from "../config";
import { useMemo } from "react";

const formatTimeSlot = (slot) => {
  // Create a Date object for the appointment date
  const appointmentDate = new Date(slot.date);

  // Format the day, month, and date with suffix
  const dayOfWeek = appointmentDate.toLocaleString("en-US", {
    weekday: "short",
  });
  const month = appointmentDate.toLocaleString("en-US", { month: "short" });
  const dayOfMonth = appointmentDate.getDate();

  // Create the date suffix (th, st, nd, rd)
  const getDateSuffix = (day) => {
    if (day >= 11 && day <= 13) return "th";
    const lastDigit = day % 10;
    switch (lastDigit) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };
  const dateSuffix = getDateSuffix(dayOfMonth);

  // Calculate appointment duration
  const startTime = new Date(`${slot.date}T${slot.start_time}`);
  const endTime = new Date(`${slot.date}T${slot.end_time}`);
  const durationHours = (endTime - startTime) / (1000 * 60 * 60);

  // Format the start time in 12-hour format
  const timeString = startTime
    .toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();

  // Format the duration string
  const durationString =
    durationHours === 1
      ? "1 hour"
      : durationHours % 1 === 0
      ? `${durationHours} hours`
      : `${durationHours} hours`;

  // Combine all parts into the final format
  return `${dayOfWeek}, ${month} ${dayOfMonth}${dateSuffix} - ${timeString} (${durationString})`;
};

const getActiveMonthsData = (timeslots) => {
  // Return early if no data
  if (!Array.isArray(timeslots) || timeslots.length === 0) {
    return [];
  }

  // Create a Map to store unique months and their appointment counts
  const monthsMap = new Map();

  timeslots.forEach((slot) => {
    // Get the date from the slot object
    const date = new Date(slot.date);
    const monthNumber = date.getMonth() + 1;
    const monthName = date.toLocaleString("default", { month: "long" });
    const monthKey = `${date.getFullYear()}-${monthNumber}`;

    // Initialize month data if we haven't seen this month yet
    if (!monthsMap.has(monthKey)) {
      monthsMap.set(monthKey, {
        monthName,
        monthNumber: monthNumber.toString().padStart(2, "0"),
        remainingAppts: 0,
        year: date.getFullYear(),
      });
    }

    // Count unbooked appointments
    if (slot.is_booked === 0) {
      const monthData = monthsMap.get(monthKey);
      monthData.remainingAppts += 1;
    }
  });

  // Convert to array and sort chronologically
  return Array.from(monthsMap.values())
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return parseInt(a.monthNumber) - parseInt(b.monthNumber);
    })
    .map(({ monthName, monthNumber, remainingAppts }) => ({
      monthName,
      monthNumber,
      remainingAppts,
    }));
};

const getActiveTimeslots = (timeslots, selectedMonth) => {
  // No need to parse since we're now using numbers throughout
  const filteredSlots = timeslots.filter((slot) => {
    const date = new Date(slot.date);
    const monthNumber = date.getMonth() + 1;
    return monthNumber === Number(selectedMonth) && slot.is_booked === 0;
  });

  return filteredSlots;
};

function BookingForm({ timeslots }) {
  // State management
  const [formData, setFormData] = useState({
    clientName: "",
    email: "",
    age: "",
    igHandle: "",
    budget: "",
    serviceDescription: "",
    date: "",
    start_time: "",
    end_time: "",
  });

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [activeTimeslots, setActiveTimeslots] = useState([]);
  const [selectedTimeslot, setSelectedTimeslot] = useState(null);

  const queryClient = useQueryClient();

  // Process the availability data and add selected state
  const monthlyAvailability = useMemo(() => {
    const monthData = getActiveMonthsData(timeslots);
    return monthData.map((month) => ({
      ...month,
      isSelected: month.monthNumber === selectedMonth,
    }));
  }, [timeslots, selectedMonth]);

  // Event handlers
  const handleMonthSelect = (monthNumber) => {
    setSelectedMonth(monthNumber === selectedMonth ? null : monthNumber);
    setActiveTimeslots(getActiveTimeslots(timeslots, monthNumber));
  };

  const handleTimeslotSelect = (slot) => {
    console.log(slot);
    // Toggle selection - if same slot is clicked, deselect it
    setSelectedTimeslot((prevSelected) =>
      prevSelected?.id === slot.id ? null : slot
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // API mutation setup for creating an appointment
  const createAppointment = useMutation({
    mutationFn: (newAppt) => {
      return axios.post(`${config.apiUrl}/appointments`, newAppt);
    },
    onSuccess: (data) => {
      // Update availability after creating the appointment
      updateAvailability.mutate(selectedTimeslot.id);
    },
    onError: (error) => {
      console.error("Error creating appointment:", error);
    },
  });

  // API mutation setup for updating availability
  const updateAvailability = useMutation({
    mutationFn: (timeslotId) => {
      return axios.patch(`${config.apiUrl}/availability/${timeslotId}`, {
        is_booked: 1,
      });
    },
    onSuccess: () => {
      // Invalidate and refetch timeslots data
      queryClient.invalidateQueries("timeslots");
      // Reset form data
      setFormData({
        clientName: "",
        email: "",
        age: "",
        igHandle: "",
        budget: "",
        serviceDescription: "",
        date: "",
        start_time: "",
        end_time: "",
      });
      setSelectedTimeslot(null);
      //i should probably actually just route to a confirmation page and clear the form
    },
    onError: (error) => {
      console.error("Error updating availability:", error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createAppointment.mutate(formData);
  };

  return (
    <div className="max-w-2xl mx-auto px-2 font-almendra">
      <h2 className="py-2">
        Fill out this form to book a slot with me, just please check the info
        page prior :-)
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="py-2">
          <label htmlFor="clientName">Name *</label>
          <input
            type="text"
            name="clientName"
            id="clientName"
            value={formData.clientName}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-600 rounded focus:outline-dashed focus:outline-orange-400"
          ></input>
        </div>
        <div className="py-2">
          <label htmlFor="age">Age *</label>
          <input
            type="text"
            name="age"
            id="age"
            placeholder="18+"
            value={formData.age}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-600 rounded focus:outline-dashed focus:outline-orange-400"
          ></input>
        </div>
        <div className="py-2">
          <label htmlFor="email">Email *</label>
          <input
            type="text"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-600 rounded focus:outline-dashed focus:outline-orange-400"
          ></input>
        </div>
        <div className="py-2">
          <label htmlFor="igHandle">Ig Handle</label>
          <input
            type="text"
            name="igHandle"
            id="igHandle"
            placeholder="optional - if you dm'd me info"
            value={formData.igHandle}
            onChange={handleChange}
            className="w-full p-2 border border-gray-600 rounded focus:outline-dashed focus:outline-orange-400"
          ></input>
        </div>
        <div className="py-2">
          <label htmlFor="budget">Your Budget</label>
          <input
            type="text"
            name="budget"
            id="budget"
            placeholder="optional - if you have a budget in mind"
            value={formData.budget}
            onChange={handleChange}
            className="w-full p-2 border border-gray-600 rounded focus:outline-dashed focus:outline-orange-400"
          ></input>
        </div>
        <div className="py-2">
          <label htmlFor="serviceDescription">
            What are you interested in? *
          </label>
          <textarea
            type="text"
            name="serviceDescription"
            id="serviceDescription"
            placeholder="mostly to just give me an idea of appt length - you can change your mind later"
            value={formData.serviceDescription}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-600 rounded focus:outline-dashed focus:outline-orange-400"
            rows="3"
          ></textarea>
        </div>

        {/* appointment time selection */}
        <div className="flex justify-center w-full">
          <div className="bg-gray-700 rounded mt-2 pb-2 w-full md:w-3/5 lg:w-3/5">
            <h2 className="flex justify-center p-2">
              Select An Appointment Time
            </h2>
            {/* month selector */}
            <div className=" flex justify-center px-1 mb-4">
              {monthlyAvailability.map((month) => (
                <div
                  key={`${month.monthName}-${month.monthNumber}`}
                  onClick={() => handleMonthSelect(month.monthNumber)}
                >
                  <div
                    className={`
                bg-gray-500 rounded p-2 mx-1 border-2 
                ${
                  month.isSelected
                    ? "border-orange-400 border-dashed"
                    : "border-solid border-gray-500"
                }
                cursor-pointer
                ${month.remainingAppts === 0 ? "opacity-50" : ""}
              `}
                  >
                    <div>{month.monthName}</div>
                    <div className="text-sm text-gray-300">
                      {month.remainingAppts}
                      {month.remainingAppts === 1 ? "spot" : "spots"} left
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* day selector */}
            <div>
              <div className="flex flex-row flex-wrap gap-y-2">
                {activeTimeslots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`
          bg-gray-500 rounded py-1 px-2 mx-6 w-full 
          flex justify-center cursor-pointer
          border-2 ${
            selectedTimeslot?.id === slot.id
              ? "border-orange-400 border-dashed"
              : "border-gray-500 border-solid"
          }
          hover:border-orange-400 hover:border-dashed
          
        `}
                    onClick={() => handleTimeslotSelect(slot)}
                  >
                    {formatTimeSlot(slot)}
                  </div>
                ))}
              </div>
            </div>

            {/* selection confirmation */}
            {selectedTimeslot ? (
              <div className="flex justify-evenly my-4">
                <div className="italic border-2 border-gray-700">Selected:</div>
                <div className="border-2 rounded border-orange-400 border-dashed px-2">
                  {formatTimeSlot(selectedTimeslot)}
                </div>
              </div>
            ) : (
              <div className="italic flex justify-center m-4 text-xl">
                Please select a timeslot
              </div>
            )}
          </div>
        </div>

        {/* submit button */}
        <div className="py-2 flex justify-center pt-4 ">
          <button
            className="w-36 border border-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed p-2 rounded"
            disabled={mutation.isPending || !selectedTimeslot}
            type="submit"
          >
            {mutation.isPending ? "Submitting..." : "Book!"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookingForm;
