const ItineraryCard = ({
  itinerary,
  onEdit,
  onDelete,
  userType,
  onBook,
  isBooked,
  onUnbook,
  onActivationToggle,
  onBookmark, // New prop to handle bookmark
  isBookmarked, // New prop to check if itinerary is bookmarked
  isProfilePage,
}) => {
  return (
    <div className="itinerary-card">
      <h2 className="itinerary-title">{itinerary.name}</h2>
      <p className="itinerary-duration">Duration: {itinerary.duration} hours</p>
      <p className="itinerary-price">Price: ${itinerary.priceOfTour}</p>
      <p className="itinerary-language">Language: {itinerary.languageOfTour}</p>
      <p className="itinerary-timeline">
        Timeline: {new Date(itinerary.timeline).toLocaleString()}
      </p>
      <h3>Locations to Visit:</h3>
      <ul className="locations-list">
        {itinerary.locationsToVisit.map((location, index) => (
          <li key={index}>{location}</li>
        ))}
      </ul>
      <h3>Available Dates:</h3>
      <ul className="dates-list">
        {itinerary.availableDates.map((date, index) => (
          <li key={index}>{new Date(date).toLocaleDateString()}</li>
        ))}
      </ul>
      <div className="button-container">
        {/* Conditionally render the buttons based on userType and isProfilePage flag */}
        {userType === "tourGuide" && (
          <>
            <button
              className="edit-button"
              onClick={() => onEdit(itinerary._id)}
            >
              Edit
            </button>
            <button
              className="delete-button"
              onClick={() => onDelete(itinerary._id)}
            >
              Delete
            </button>
          </>
        )}
        {userType === "tourist" &&
          !isProfilePage && ( // Hide buttons in profile view
            <>
              <button
                onClick={() => onBook(itinerary._id)}
                disabled={isBooked} // Disable if already booked
              >
                {isBooked ? "Already Booked" : "Book"}
              </button>
              <button onClick={() => onUnbook(itinerary._id)}>
                {isBooked ? "UnBook" : "Not Booked Yet"}
              </button>
            </>
          )}
        {userType === "tourist" && ( // Hide bookmark button in profile view
          <button
            onClick={() => onBookmark(itinerary._id)} // Handle bookmarking
            style={{ backgroundColor: isBookmarked ? "black" : "" }} // Indicate bookmarked state
          >
            {isBookmarked ? "Bookmarked" : "Bookmark"}
          </button>
        )}
        {userType === "tourGuide" && (
          <button
            className={`toggle-button ${
              itinerary.activated ? "deactivate" : "activate"
            }`}
            onClick={() => onActivationToggle(itinerary._id)}
          >
            {itinerary.activated ? "Deactivate" : "Activate"}
          </button>
        )}
      </div>
    </div>
  );
};
export default ItineraryCard;
