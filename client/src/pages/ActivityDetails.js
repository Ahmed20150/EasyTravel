import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ActivityDetails = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/activities/${id}`);
        setActivity(response.data);
        setError("");
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.error || "Failed to load activity details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchActivity();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading activity details...</p>
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

  if (!activity) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Activity not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Activity Details</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <p><strong>Creator:</strong> {activity.creator}</p>
            <p><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {activity.time}</p>
            <p><strong>Category:</strong> {activity.category}</p>
          </div>
          <div className="space-y-2">
            <p><strong>Location:</strong> {activity.location?.address}</p>
            <p><strong>Min Price:</strong> ${activity.price?.min}</p>
            <p><strong>Max Price:</strong> ${activity.price?.max}</p>
            <p><strong>Booking Open:</strong> {activity.isBookingOpen ? "Yes" : "No"}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Tags</h2>
          <ul className="list-disc pl-5 space-y-1">
            {activity.tags?.map((tag, index) => (
              <li key={index}>{tag}</li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Special Discounts</h2>
          <p>{activity.specialDiscounts}%</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Ratings</h2>
          {activity.ratings?.length > 0 ? (
            <div className="space-y-2">
              {activity.ratings.map((rating, index) => (
                <div key={index} className="border p-3 rounded-lg">
                  <p><strong>Rating:</strong> {rating.rating}/5</p>
                  <p><strong>Comment:</strong> {rating.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No ratings available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityDetails;