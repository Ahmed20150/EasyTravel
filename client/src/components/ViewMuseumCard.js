import React from "react";
import { useCurrency } from "../components/CurrencyContext"; // Assuming CurrencyContext.js is in components folder

const ViewMuseumCard = ({ museum, nationality, occupation }) => {
  const { selectedCurrency, exchangeRates } = useCurrency();

  // Function to convert price to selected currency
  const convertPrice = (priceInUSD) => {
    if (exchangeRates[selectedCurrency]) {
      return (priceInUSD * exchangeRates[selectedCurrency]).toFixed(2);
    }
    return priceInUSD.toFixed(2); // Default to USD if no exchange rate is found
  };

  // Extract the country from museum.location
  const museumCountry = museum.location.split(",")[1]?.trim();
  let ticketPrice;
  if (occupation === "Student") {
    ticketPrice = museum.ticketPrices.student;
  } else if (nationality === museumCountry) {
    ticketPrice = museum.ticketPrices.native;
  } else {
    ticketPrice = museum.ticketPrices.foreigner;
  }

  // Share button handler
const handleShare = async () => {
  // Generate the link for the museum dynamically
  const link = `${window.location.origin}/museum/${museum._id}`;

  const shareData = {
    title: museum.name,
    text: `Check out this amazing museum: ${museum.name}\nLocated at: ${museum.location}\nFind out more here: ${link}`,

  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      console.log("Museum shared successfully");
    } catch (error) {
      console.error("Error sharing museum:", error);
    }
  } else {
    alert("Sharing is not supported on this browser.");
  }
};

  // Copy link handler
  const handleCopyLink = () => {
    const link = `${window.location.origin}/museum/${museum._id}`; // Generate museum-specific link
    navigator.clipboard
      .writeText(link)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy link:", error);
        alert("Failed to copy the link.");
      });
  };

  return (
    <section className="articles">
      <article>
        <div className="article-wrapper">
          <figure className="figure">
            <img src={museum.picture} alt={museum.name} />
          </figure>
          <div className="article-body">
            <h2>{museum.name}</h2>
            <p className="location">{museum.location}</p>
            <p>{museum.description}</p>
            <p className="opening-hours">
              Opening Hours: {museum.openingHours.from} - {museum.openingHours.to}
            </p>
            <p className="ticket-price">
              Ticket: <span className="price-value">
                ${convertPrice(ticketPrice)} {selectedCurrency}
              </span>
            </p>
            {/* Display Tags */}
            <div className="tags-cont">
              {museum.tags &&
                museum.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
            </div>
            {/* Share and Copy Link Buttons */}
            <div className="button-container">
              <button className="share-button" onClick={handleShare}>
                Share Museum
              </button>
              <button className="copy-link-button" onClick={handleCopyLink}>
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
};

export default ViewMuseumCard;