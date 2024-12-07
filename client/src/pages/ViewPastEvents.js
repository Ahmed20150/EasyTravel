import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
// import "../styles/popup.css";

const ViewPastEvents = () => {
  const [bookings, setBookings] = useState([]);
  const [itineraries, setItineraries] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({
    entityId: null,
    entityType: "",
    rating: 0,
    comment: "",
  });

  useEffect(() => {
    const fetchPastBookings = async () => {
      try {
        const username = Cookies.get("username");
        if (!username) {
          setError("Username not found in cookies");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:3000/booking/pastBookings",
          {
            params: { username },
          }
        );
        setBookings(response.data);

        const itineraryDetails = {};

        for (const booking of response.data) {
          const itineraryResponse = await axios.get(
            `http://localhost:3000/itinerary/${booking.itineraryId}`
          );
          const itinerary = itineraryResponse.data;
          itineraryDetails[booking.itineraryId] = itinerary;
        }

        setItineraries(itineraryDetails);
      } catch (error) {
        setError("Error fetching past bookings or itinerary details");
      } finally {
        setLoading(false);
      }
    };

    fetchPastBookings();
  }, []);

  const handleReviewButtonClick = async (entityId, entityType) => {
    let entityIdentifier = entityId;

    // Log to verify if creator exists
    console.log("Itinerary:", itineraries[entityId]);
    console.log("Creator:", itineraries[entityId]?.creator);

    if (entityType === "tourguide") {
      try {
        const tourGuideResponse = await axios.get(
          `http://localhost:3000/api/profile/${entityId}`
        );

        if (tourGuideResponse.data && tourGuideResponse.data._id) {
          entityIdentifier = tourGuideResponse.data._id;
        } else {
          throw new Error("Tour guide not found");
        }
      } catch (error) {
        console.error("Error fetching tour guide:", error);
        alert("Error finding the tour guide");
        return;
      }
    }

    setReviewData({
      entityId: entityIdentifier,
      entityType,
      rating: 0,
      comment: "",
    });
    setShowReviewModal(true);
  };
  const handleReviewSubmit = async () => {
    try {
      const { entityId, entityType, rating, comment } = reviewData;

      const response = await axios.post("http://localhost:3000/review/create", {
        type: entityType,
        id: entityId,
        rating,
        comment,
      });

      if (response.status === 200) {
        // Close the review modal
        setShowReviewModal(false);

        // Alert the user about the successful submission
        alert("Review submitted successfully");

        // Fetch the updated details for the entity (itinerary, tourguide, or activity)
        if (entityType === "itinerary") {
          const itineraryResponse = await axios.get(
            `http://localhost:3000/itinerary/${entityId}`
          );
          setItineraries((prevItineraries) => ({
            ...prevItineraries,
            [entityId]: itineraryResponse.data,
          }));
        } else if (entityType === "activity") {
          // Fetch the updated activity details
          const activityResponse = await axios.get(
            `http://localhost:3000/activities/${entityId}`
          );

          // Update the specific activity in the itinerary
          setItineraries((prevItineraries) => {
            // Find the itinerary that contains the activity
            const updatedItineraries = { ...prevItineraries };

            // Loop through all itineraries to find the one containing the activity
            for (const itineraryId in updatedItineraries) {
              const itinerary = updatedItineraries[itineraryId];
              const activityIndex = itinerary.activities.findIndex(
                (activityRef) => activityRef.activity._id === entityId
              );

              // If the activity is found, update it with the new rating
              if (activityIndex !== -1) {
                itinerary.activities[activityIndex] = {
                  ...itinerary.activities[activityIndex],
                  activity: activityResponse.data, // Update the activity with the new data
                };
                break;
              }
            }

            return updatedItineraries;
          });
        }
      }
    } catch (error) {
      alert("Error submitting review");
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    setReviewData({
      ...reviewData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Past Events</h1>
      {bookings.length === 0 ? (
        <p>No past events found.</p>
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li
              key={`${booking._id}-${
                itineraries[booking.itineraryId]?.creator
              }`}
            >
              <p>
                {booking.eventName} -{" "}
                {new Date(booking.bookingDate).toLocaleDateString()} -{" "}
                {booking.bookingTime}
              </p>
              {itineraries[booking.itineraryId] ? (
                <div>
                  <h3>Itinerary Details:</h3>
                  <p>
                    <strong>Creator:</strong>{" "}
                    {itineraries[booking.itineraryId].creator}
                  </p>
                  <p>
                    <strong>Locations to Visit:</strong>{" "}
                    {itineraries[booking.itineraryId].locationsToVisit.join(
                      ", "
                    )}
                  </p>
                  <p>
                    <strong>Timeline:</strong>{" "}
                    {itineraries[booking.itineraryId].timeline}
                  </p>
                  <p>
                    <strong>Duration:</strong>{" "}
                    {itineraries[booking.itineraryId].duration} hours
                  </p>
                  <p>
                    <strong>Language of Tour:</strong>{" "}
                    {itineraries[booking.itineraryId].languageOfTour}
                  </p>
                  <p>
                    <strong>Price of Tour:</strong> $
                    {itineraries[booking.itineraryId].priceOfTour}
                  </p>
                  <p>
                    <strong>Rating:</strong>{" "}
                    {itineraries[booking.itineraryId].avgRating}
                  </p>
                  <p>
                    <strong>Total Reviews:</strong>{" "}
                    {itineraries[booking.itineraryId].totalRatingCount}
                  </p>

                  {/* Review buttons for itinerary and tour guide */}
                  <button
                    onClick={() =>
                      handleReviewButtonClick(booking.itineraryId, "itinerary")
                    }
                  >
                    Review Itinerary
                  </button>
                  <button
                    onClick={() =>
                      handleReviewButtonClick(
                        itineraries[booking.itineraryId].creator,
                        "tourguide"
                      )
                    }
                  >
                    Review Tour Guide
                  </button>

                  {/* Show activities and their review buttons */}
                  <h4>Activities:</h4>
                  {itineraries[booking.itineraryId].activities &&
                  itineraries[booking.itineraryId].activities.length > 0 ? (
                    <ul>
                      {itineraries[booking.itineraryId].activities.map(
                        (activityRef) => (
                          <li key={activityRef.activity._id}>
                            <p>
                              <strong>Activity:</strong>{" "}
                              {activityRef.activity.name}
                            </p>
                            <p>
                              <strong>Activity Name:</strong>{" "}
                              {activityRef.activity.name}
                            </p>
                            <p>
                              <strong>Creator:</strong>{" "}
                              {activityRef.activity.creator}
                            </p>
                            <p>
                              <strong>Date:</strong>{" "}
                              {new Date(
                                activityRef.activity.date
                              ).toLocaleDateString()}
                            </p>
                            <p>
                              <strong>Time:</strong> {activityRef.activity.time}
                            </p>
                            <p>
                              <strong>Location:</strong>{" "}
                              {activityRef.activity.location.address}
                            </p>
                            <p>
                              <strong>Price Range:</strong> $
                              {activityRef.activity.price.min} - $
                              {activityRef.activity.price.max}
                            </p>
                            <p>
                              <strong>Category:</strong>{" "}
                              {activityRef.activity.category}
                            </p>
                            <p>
                              <strong>Tags:</strong>{" "}
                              {activityRef.activity.tags.join(", ")}
                            </p>
                            <p>
                              <strong>Special Discounts:</strong>{" "}
                              {activityRef.activity.specialDiscounts}%
                            </p>
                            <p>
                              <strong>Rating:</strong>{" "}
                              {activityRef.activity.avgRating}
                            </p>
                            <p>
                              <strong>Total Reviews:</strong>{" "}
                              {activityRef.activity.totalRatingCount}
                            </p>
                            <button
                              onClick={() =>
                                handleReviewButtonClick(
                                  activityRef.activity._id,
                                  "activity"
                                )
                              }
                            >
                              Review Activity
                            </button>
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p>No activities available for this itinerary.</p>
                  )}
                </div>
              ) : (
                <p>Loading itinerary details...</p>
              )}
            </li>
          ))}
        </ul>
      )}

      <Link to="/ExplorePage">
        <button>Back</button>
      </Link>

      {/* Review Modal (Popup) */}
      {showReviewModal && (
        <div className="review-modal-overlay">
          <div className="review-modal">
            <h2>Submit your review</h2>
            <div>
              <label>Rating (1-5):</label>
              <input
                type="number"
                name="rating"
                min="1"
                max="5"
                value={reviewData.rating}
                onChange={handleInputChange}
                placeholder="Rating"
                style={{ marginBottom: "10px", width: "50px" }}
              />
            </div>
            <div>
              <label>Review:</label>
              <textarea
                name="comment"
                value={reviewData.comment}
                onChange={handleInputChange}
                placeholder="Write your review"
                style={{ width: "100%", minHeight: "100px" }}
              />
            </div>
            <button onClick={handleReviewSubmit}>Submit Review</button>
            <button onClick={() => setShowReviewModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPastEvents;
