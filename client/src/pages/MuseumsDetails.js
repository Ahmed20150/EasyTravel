import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCurrency } from "../components/CurrencyContext";

const MuseumDetails = () => {
  // ... other state and hooks remain the same ...

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !museum) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-red-500 text-lg">{error || "Museum not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="relative h-96">
            <img
              src={museum.picture || "/placeholder-image.jpg"}
              alt={museum.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-4xl font-bold mb-2">{museum.name}</h1>
              <p className="text-lg opacity-90">{museum.location}</p>
            </div>
          </div>

          {/* Rest of the content remains the same ... */}
        </div>
      </div>
    </div>
  );
};

export default MuseumDetails; 