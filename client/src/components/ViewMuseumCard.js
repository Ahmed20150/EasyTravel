import React from "react";

const ViewMuseumCard = ({ museum, nationality, occupation }) => {
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
              Opening Hours: {museum.openingHours.from} -{" "}
              {museum.openingHours.to}
            </p>
            <p className="ticket-price">
              Ticket: <span className="price-value">${ticketPrice}</span>
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
          </div>
        </div>
      </article>
    </section>
  );
};

export default ViewMuseumCard;
