import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { config } from "../config";

// breaking this page down:
// we have the booking form data which is our main state
// we have a mutation function that will be called when the form is submitted
// the mutation function will make a post request to the api to book an appointment
// then after it is successful, it will reset the form data and alert the user that the appointment was booked

function BookingForm({ timeslots }) {
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

  // Group timeslots by date for better organization
  const groupedSlots = timeslots.reduce((groups, slot) => {
    const date = new Date(slot.date).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(slot);
    return groups;
  }, {});

  //this implementation is using the object syntax of useMutation (as opposed to the function syntax)
  //use mutation for posts, puts, and deletes
  //use query for gets
  //to call mutation we use mutation.mutate(data)
  //mutation is going to have 3 parts: onMutate, onSuccess, and onError
  //it even manages isloading, iserror, and data for us
  const mutation = useMutation({
    mutationFn: (newAppt) => {
      //returns a promise
      //react query (mutation) will wait for this promise to resolve and handle the async stuff
      return axios.post(`${config.apiUrl}/appointments`, newAppt);
      // i actually may need to switch to function syntax for this because i need to update the availability table as well
    },
    onSuccess: () => {
      setFormData({
        clientName: "",
        email: "",
        age: "",
        igHandle: "",
        budget: "",
        serviceDescription: "",
      });
      alert("Appointment booked!");
    },
    onError: (error) => {
      alert("Error booking appointment: " + error.message);
    },
  });

  //we are doing this so that every time the form is changed, the state is updated in the specific way it corresponds
  //have to do the spread operator to update object correctly
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // this is the function that will be called when the form is submitted
  //updates mutation state with the form data
  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
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
            className="w-full p-2 border rounded"
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
            className="w-full p-2 border rounded"
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
            className="w-full p-2 border rounded"
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
            className="w-full p-2 border rounded"
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
            className="w-full p-2 border rounded"
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
            className="w-full p-2 border rounded"
            rows="3"
          ></textarea>
        </div>

        {/* appointment time selection */}
        {/* <div className="pb-2">
          <label className="block text-sm mb-2">
            Select Appointment Time *
          </label>
          <select
            name="availabilityId"
            value={formData.availabilityId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select a time</option>
            {Object.entries(groupedSlots).map(([date, slots]) => (
              <optgroup key={date} label={date}>
                {slots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {`${slot.start_time} - ${slot.end_time}`}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div> */}
        <div className="flex justify-center w-full">
          <div className="bg-gray-700 rounded mt-2 pb-2 w-full lg:w-3/5">
            <h2 className="flex justify-center p-2">
              Select An Appointment Time
            </h2>
            <div className="flex justify-center px-1 mb-4">
              <div className="bg-gray-500 rounded p-2 mx-1 border-dashed border-2 border-orange-400">
                <div>November</div>
                <div className="text-sm text-gray-300"> 1 spot left</div>
              </div>
              <div className="bg-gray-500 rounded p-2 mx-1">
                <div>December</div>
                <div className="text-sm text-gray-300"> 8 spots left</div>
              </div>
              <div className="bg-gray-500 rounded p-2 mx-1">
                <div>January</div>
                <div className="text-sm text-gray-300"> 0 spots left</div>
              </div>
            </div>
            <div className="bg-gray-500 mx-4 my-2 p-2 rounded">
              <div className="mx-2 flex">
                <div className="mr-2 min-w-24">Wed, Nov 15:</div>
                <div className="bg-gray-400 rounded px-2 mr-2">2:00 pm</div>
                <div className="bg-gray-400 rounded px-2">5:00 pm</div>
              </div>
            </div>
            <div className="bg-gray-500 mx-4 my-2 p-2 rounded">
              <div className="mx-2 flex">
                <div className="mr-2 min-w-24">Thu, Nov 16:</div>
                <div className="bg-gray-400 rounded px-2 mr-2">2:00 pm</div>
                <div className="bg-gray-400 rounded px-2">5:00 pm</div>
              </div>
            </div>
            <div className="bg-gray-500 mx-4 my-2 p-2 rounded">
              <div className="mx-2 flex">
                <div className="mr-2 min-w-24">Fri, Jan 1:</div>
                <div className="bg-gray-400 rounded px-2">5:00 pm</div>
              </div>
            </div>
            <div className="bg-gray-500 mx-4 my-2 p-2 rounded">
              <div className="mx-2 flex">
                <div className="mr-2 min-w-24">Wed, Nov 15:</div>
                <div className="bg-gray-400 rounded px-2 mr-2">2:00 pm</div>
                <div className="bg-gray-400 rounded px-2">5:00 pm</div>
              </div>
            </div>
            <div className="bg-gray-500 mx-4 my-2 p-2 rounded">
              <div className="mx-2 flex">
                <div className="mr-2 min-w-24">Thu, Nov 16:</div>
                <div className="bg-gray-400 rounded px-2 mr-2">2:00 pm</div>
                <div className="bg-gray-400 rounded px-2">5:00 pm</div>
              </div>
            </div>
            <div className="bg-gray-500 mx-4 my-2 p-2 rounded">
              <div className="mx-2 flex">
                <div className="mr-2 min-w-24">Fri, Jan 1:</div>
                <div className="bg-gray-400 rounded px-2">5:00 pm</div>
              </div>
            </div>
            <div className="bg-gray-500 mx-4 my-2 p-2 rounded">
              <div className="mx-2 flex">
                <div className="mr-2 min-w-24">Wed, Nov 15:</div>
                <div className="bg-gray-400 rounded px-2 mr-2">2:00 pm</div>
                <div className="bg-gray-400 rounded px-2">5:00 pm</div>
              </div>
            </div>
            <div className="bg-gray-500 mx-4 my-2 p-2 rounded">
              <div className="mx-2 flex">
                <div className="mr-2 min-w-24">Thu, Nov 16:</div>
                <div className="bg-gray-400 rounded px-2 mr-2">2:00 pm</div>
                <div className="bg-gray-400 rounded px-2">5:00 pm</div>
              </div>
            </div>
            <div className="bg-gray-500 mx-4 my-2 p-2 rounded">
              <div className="mx-2 flex">
                <div className="mr-2 min-w-24">Fri, Jan 1:</div>
                <div className="bg-gray-400 rounded px-2">5:00 pm</div>
              </div>
            </div>
            <div className="flex justify-evenly my-4">
              <div className="italic">Timeslot selected:</div>
              <div className="border-2 rounded border-orange-400 border-dashed px-2">
                Wed, Nov 16th at 2:00pm
              </div>
            </div>
          </div>
        </div>

        {/* i need a selected month */}

        {/* submit button */}
        <div className="py-2 flex justify-center pt-4">
          <button className="w-36" disabled={mutation.isPending} type="submit">
            {mutation.isPending ? "Submitting..." : "Book"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookingForm;
