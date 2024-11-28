import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ItineraryDetailsPage = () => {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/itinerary/${id}`);
        setItinerary(response.data);
        setError("");
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.error || "Failed to load itinerary details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItinerary();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading itinerary details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Itinerary not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Itinerary Details</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <p><strong>Creator:</strong> {itinerary.creator}</p>
            <p><strong>Duration:</strong> {itinerary.duration} hours</p>
            <p><strong>Language:</strong> {itinerary.languageOfTour}</p>
            <p><strong>Price:</strong> ${itinerary.priceOfTour}</p>
          </div>
          <div className="space-y-2">
            <p><strong>Accessibility:</strong> {itinerary.accessibility}</p>
            <p><strong>Pickup Location:</strong> {itinerary.pickupLocation}</p>
            <p><strong>Dropoff Location:</strong> {itinerary.dropoffLocation}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Locations to Visit</h2>
          <ul className="list-disc pl-5 space-y-1">
            {itinerary.locationsToVisit?.map((location, index) => (
              <li key={index}>{location}</li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Available Dates</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {itinerary.availableDates?.map((date, index) => (
              <div key={index} className="bg-gray-50 p-2 rounded text-center">
                {new Date(date).toLocaleDateString()}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Available Times</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {itinerary.availableTimes?.map((time, index) => (
              <div key={index} className="bg-gray-50 p-2 rounded text-center">
                {time}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryDetailsPage;
