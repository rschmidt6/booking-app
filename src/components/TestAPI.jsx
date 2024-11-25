// src/components/TestAPI.jsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { config } from "../config";

export default function TestAPI() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["availability"],
    queryFn: async () => {
      const response = await axios.get(`${config.apiUrl}/availability`);
      console.log("API Response:", response.data); // Debug log
      return response.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Available Times:</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
