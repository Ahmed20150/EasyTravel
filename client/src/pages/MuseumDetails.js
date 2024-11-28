import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MuseumDetails = () => {
  const { id } = useParams(); // Fetch museum ID from the URL
  const [museum, setMuseum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMuseum = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/museums/${id}`);
        setMuseum(response.data);
        setError("");
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.error || "Failed to load museum details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMuseum();
    }
  }, [id]);

  // Handle copying the link to clipboard
  const handleCopyLink = () => {
    const link = `${window.location.origin}/museums/${id}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((error) => {
        console.error("Error copying link:", error);
        alert("Failed to copy the link.");
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading museum details...</p>
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

  if (!museum) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Museum not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">{museum.name}</h1>
        <figure className="mb-6">
          <img
            src={museum.picture || "/placeholder-image.jpg"} // Use a placeholder if no image is provided
            alt={museum.name}
            className="rounded-lg"
          />
        </figure>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <p><strong>Description:</strong> {museum.description}</p>
            <p><strong>Location:</strong> {museum.location}</p>
            <p><strong>Opening Hours:</strong> {museum.openingHours.from} - {museum.openingHours.to}</p>
          </div>
          <div className="space-y-2">
            <p><strong>Foreigner Ticket Price:</strong> ${museum.ticketPrices.foreigner}</p>
            <p><strong>Native Ticket Price:</strong> ${museum.ticketPrices.native}</p>
            <p><strong>Student Ticket Price:</strong> ${museum.ticketPrices.student}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Tags</h2>
          <ul className="list-disc pl-5 space-y-1">
            {museum.tags?.length > 0 ? (
              museum.tags.map((tag, index) => (
                <li key={index}>{tag}</li>
              ))
            ) : (
              <p>No tags available</p>
            )}
          </ul>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleCopyLink}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default MuseumDetails;