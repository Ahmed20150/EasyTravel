import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCurrency } from "../components/CurrencyContext";

const FALLBACK_IMAGE = "https://placehold.co/600x400?text=Museum+Image"; // Placeholder image

const MuseumImage = ({ image, name }) => {
  const [imgSrc, setImgSrc] = useState(image || FALLBACK_IMAGE);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(FALLBACK_IMAGE);
      setHasError(true);
    }
  };

  return (
    <img 
      src={imgSrc}
      alt={name} 
      onError={handleError}
      className={`w-full h-48 object-cover ${hasError ? 'opacity-80' : ''}`}
    />
  );
};

const getRandomRating = () => {
  return (Math.random() * (5 - 3.5) + 3.5).toFixed(1);
};

const PriceDisplay = ({ ticketPrices }) => {
  const { selectedCurrency, exchangeRates } = useCurrency();

  const convertPrice = (price) => {
    if (!exchangeRates || !price) return price;
    const rate = exchangeRates[selectedCurrency];
    const converted = price * rate;
    return converted.toFixed(2);
  };

  const getCurrencySymbol = (currency) => {
    const symbols = {
      EUR: "€",
      USD: "$",
      GBP: "£",
      JPY: "¥",
      EGP: "E£"
    };
    return symbols[currency] || currency;
  };

  return (
    <div className="space-y-1">
      <div className="font-medium text-gray-900 flex flex-col">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Student:</span>
          <span>{getCurrencySymbol(selectedCurrency)}{convertPrice(ticketPrices.student)} per person</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Local:</span>
          <span>{getCurrencySymbol(selectedCurrency)}{convertPrice(ticketPrices.native)} per person</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Standard:</span>
          <span>{getCurrencySymbol(selectedCurrency)}{convertPrice(ticketPrices.foreigner)} per person</span>
        </div>
      </div>
    </div>
  );
};

const MuseumsPage = () => {
  const [museums, setMuseums] = useState([]);
  const [filteredMuseums, setFilteredMuseums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("All Tags");

  // Get cookies for nationality and occupation
  const [cookies] = useCookies(["nationality", "occupation"]);
  const nationality = cookies.nationality;
  const occupation = cookies.occupation;

  const tags = ["All Tags", "Monuments", "Museums", "Religious Sites", "Palaces/Castles"];

  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  useEffect(() => {
    fetchMuseums();
  }, []);

  useEffect(() => {
    filterMuseums();
  }, [museums, searchTerm, selectedTag]);

  const fetchMuseums = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/museums");
      const museumsWithRatings = response.data.map(museum => ({
        ...museum,
        rating: getRandomRating()
      }));
      setMuseums(museumsWithRatings);
      setFilteredMuseums(museumsWithRatings);
    } catch (error) {
      console.error("Error fetching museums:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterMuseums = () => {
    let filtered = [...museums];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(museum => 
        museum.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply tag filter
    if (selectedTag && selectedTag !== "All Tags") {
      filtered = filtered.filter(museum => 
        museum.tags.includes(selectedTag)
      );
    }

    setFilteredMuseums(filtered);
  };

  const handleShare = async (museumId) => {
    // Create the share URL outside try block so it's available in catch block
    const shareUrl = `${window.location.origin}/museum/${museumId}`;

    try {
      // Check if the Web Share API is available
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this museum!',
          text: 'I found this interesting museum on EasyTravel',
          url: shareUrl
        });
        toast.success('Shared successfully!');
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // If sharing fails, fallback to copying to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
      } catch (clipboardError) {
        toast.error('Failed to share or copy link');
      }
    }
  };

  const formatTime = (timeObj) => {
    if (!timeObj) return '';
    if (typeof timeObj === 'string') return timeObj;
    return `${timeObj.from} - ${timeObj.to}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      <ToastContainer />
      <button 
        onClick={handleBack}
        className="absolute left-4 top-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center"
      >
        <svg 
          className="w-5 h-5 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back
      </button>
      <h1 className="text-3xl font-bold text-center text-gray-900">
        Historical Places & Museums
      </h1>
      <p className="text-center text-gray-600 mt-2 mb-8">
        Discover the world's most fascinating historical sites and cultural institutions
      </p>

      <div className="flex gap-4 mb-8">
        <input
          type="text"
          placeholder="Search museums..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {tags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center text-gray-600">Loading Museums...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMuseums.map((museum) => (
            <div key={museum._id} className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative">
                <MuseumImage 
                  image={museum.picture}
                  name={museum.name}
                />
                <button 
                  onClick={() => handleShare(museum._id)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
                  title="Share museum"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 hover:text-gray-800" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {museum.name}
                </h2>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {museum.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-gray-600 flex items-center gap-1 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {museum.location}
                </p>
                
                <p className="text-gray-600 text-sm mb-4">
                  {museum.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {formatTime(museum.openingHours)}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-gray-700">{museum.rating}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <PriceDisplay ticketPrices={museum.ticketPrices} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MuseumsPage; 