import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCurrency } from "../components/CurrencyContext";

const MuseumDetails = () => {
  const { id } = useParams();
  const [museum, setMuseum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { selectedCurrency, exchangeRates } = useCurrency();

  useEffect(() => {
    const fetchMuseum = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/museums/${id}`);
        setMuseum(response.data);
        setError("");
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.error || "Failed to load museum details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMuseum();
    }
  }, [id]);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/museum/${id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: museum.name,
          text: 'Check out this museum on EasyTravel',
          url: shareUrl
        });
        toast.success('Shared successfully!');
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !museum) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">{error || "Museum not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg overflow-hidden shadow-lg">
          {/* Image Section */}
          <div className="relative h-[400px]">
            <img 
              src={museum.picture || "/placeholder-image.jpg"}
              alt={museum.name}
              className="w-full h-[400px] object-cover"
            />
            <button 
              onClick={handleShare}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
              title="Share museum"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 hover:text-gray-800" viewBox="0 0 20 20" fill="currentColor">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
            </button>
          </div>
          
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{museum.name}</h1>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {museum.tags?.map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-gray-600 flex items-center gap-2 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {museum.location}
            </p>
            
            <p className="text-gray-600 text-base mb-4">{museum.description}</p>
            
            <div className="flex items-center justify-between text-sm mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {museum.openingHours.from} - {museum.openingHours.to}
              </div>
              
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">⭐</span>
                <span className="text-gray-700 font-medium">{museum.rating || "4.8"}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h2 className="text-lg font-semibold mb-3">Ticket Prices</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-sm">Student</p>
                  <p className="text-xl font-bold">${museum.ticketPrices.student}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-sm">Local Resident</p>
                  <p className="text-xl font-bold">${museum.ticketPrices.native}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-sm">Standard</p>
                  <p className="text-xl font-bold">${museum.ticketPrices.foreigner}</p>
                </div>
              </div>
              <div className="mt-3 space-y-0.5 text-xs text-gray-500">
                <p>• Prices are in USD</p>
                <p>• Valid ID required for student discounts</p>
                <p>• Children under 5 enter free</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MuseumDetails;