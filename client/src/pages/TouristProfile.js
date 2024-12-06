// client/src/pages/TouristProfile.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import PreferenceSelector from "../components/PreferenceSelector"; // Import the new component
import { useLocation, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import ItineraryCard from "../components/ItineraryItem";
import TouristForm from "../components/TouristForm";
import "../css/TouristProfile.css"; // Import CSS
import level1Image from "../images/Level_1.avif"; // Adjust the path as needed
import level2Image from "../images/Level_2.avif"; // Adjust the path as needed
import level3Image from "../images/Level_3.webp"; // Adjust the path as needed
const TouristProfile = () => {
  const [cookies] = useCookies(["userType", "username"]);
  const userType = cookies.userType;
  const [tourist, setTourist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLevel, setUserLevel] = useState(null); // State to store user level
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isPreferencesEditing, setIsPreferencesEditing] = useState(false); // State to toggle preferences editing
  const location = useLocation();
  const { username } = location.state || {};
  const [bookmarkedEvents, setBookmarkedEvents] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [bookedItineraries, setBookedItineraries] = useState([]); // New state for booked itineraries
  const isProfilePage = true;

  useEffect(() => {
    const fetchTouristProfile = async () => {
      if (!username) {
        setError("Username not provided");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:3000/api/tourist/${username}`
        );
        setTourist(response.data);
        setLoading(false);
        fetchUserLevel(username); // Fetch user level if the user is a tourist
      } catch (err) {
        setError("Failed to fetch tourist profile");
        setLoading(false);
      }
    };
    const fetchUserLevel = async (username) => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/tourist/${username}`
        );
        setUserLevel(response.data.level); // Assuming the response contains the level
      } catch (error) {
        console.error("Error fetching user level:", error);
      }
    };
    const fetchBookmarkedEvents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/bookmarkedEvents/${username}`
        );
        setBookmarkedEvents(response.data.bookmarkedEvents || []);
        fetchItineraries(response.data.bookmarkedEvents || []);
      } catch (err) {
        console.error("Error fetching bookmarked events", err);
      }
    };
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/bookings/${username}`
        );
        const bookings = response.data.bookings || [];
        const upcomingBookings = bookings.filter((booking) =>
          isItineraryWithinTwoDays(booking.bookingDate)
        );
        setBookedItineraries(upcomingBookings); // Set booked itineraries within 2 days
      } catch (err) {
        console.error("Error fetching bookings", err);
      }
    };
    const fetchItineraries = async (eventIds) => {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/itineraries/fetch",
          { eventIds }
        );
        setItineraries(response.data);
      } catch (err) {
        console.error("Error fetching itineraries", err);
      }
    };
    fetchBookings();
    fetchTouristProfile();
    fetchBookmarkedEvents();
  }, [username]);

  const handleRequest = async (username, role) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/Request/requestDelete/${username}/${role}`
      );
      window.alert(`Request sent successfully: ${response.data.message}`);
    } catch (error) {
      console.error("Error deleting user:", error);
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("An unexpected error occurred: " + error.message);
      }
    }
  };

  const handleUpdate = async (updatedTourist) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/tourist/${username}`,
        updatedTourist
      );
      setTourist(response.data);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update tourist profile");
    }
  };

  const handlePreferencesUpdate = (updatedPreferences) => {
    setTourist((prevTourist) => ({
      ...prevTourist,
      preferences: updatedPreferences,
    }));
    setIsPreferencesEditing(false);
  };

  const handleRedeemPoints = async () => {
    const redeemablePoints = Math.floor(tourist.currentPoints / 10000) * 10000;
    if (redeemablePoints === 0) {
      alert("You need at least 10,000 points to redeem.");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:3000/api/tourist/redeemPoints/${username}`,
        { points: redeemablePoints }
      );
      setTourist(response.data.tourist);
    } catch (err) {
      console.error("Error redeeming points", err);
    }
  };

  useEffect(() => {
    const sendEmail = async (to, subject, text) => {
      try {
        await axios.post("http://localhost:3000/auth/send-email", {
          to,
          subject,
          text,
        });
        console.log("Email sent successfully");
      } catch (error) {
        console.error("Failed to send email", error);
      }
    };
    if (tourist && bookedItineraries.length > 0) {
      bookedItineraries.forEach((itinerary) => {
        const subject = "Upcoming Itinerary Reminder";
        const text = `Dear ${
          tourist.username
        }, you have an upcoming itinerary "${
          itinerary.name
        }" scheduled for ${new Date(
          itinerary.timeline
        ).toLocaleDateString()}. Please make sure to review your plans.`;

        sendEmail(tourist.email, subject, text)
          .then((response) => console.log(`Email sent: ${response}`))
          .catch((error) => console.error("Error sending email:", error));
      });
    }
  }, [tourist, bookedItineraries]);

  const handleBookmark = async (eventId) => {
    try {
      // Add or remove the event from the bookmark list
      await axios.patch("http://localhost:3000/api/bookmarkEvent", {
        username,
        eventId,
      });
      setBookmarkedEvents((prevEvents) => {
        const isBookmarked = prevEvents.includes(eventId);
        if (isBookmarked) {
          return prevEvents.filter((id) => id !== eventId); // Remove bookmark
        } else {
          return [...prevEvents, eventId]; // Add bookmark
        }
      });
    } catch (err) {
      console.error("Error bookmarking event", err);
    }
  };

  const isItineraryWithinTwoDays = (bookingDate) => {
    const bookingDateObj = new Date(bookingDate);
    const currentDate = new Date();
    const twoDaysLater = new Date();
    twoDaysLater.setDate(currentDate.getDate() + 2);

    // Zero out the time components for accurate date-only comparison
    bookingDateObj.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    twoDaysLater.setHours(0, 0, 0, 0);

    return bookingDateObj >= currentDate && bookingDateObj <= twoDaysLater;
  };

  // const filteredBookedItineraries = bookedItineraries.filter(itinerary =>
  //     isItineraryWithinTwoDays(itinerary.timeline)
  // );

  // Filter bookmarked itineraries with 'changed' and 'activated' status
  const filteredBookmarkedItineraries = bookmarkedEvents.filter((eventId) => {
    // Find the itinerary by the eventId in the itineraries list
    const itinerary = itineraries.find((item) => item._id === eventId);
    return (
      itinerary && itinerary.changed === true && itinerary.activated === true
    );
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {isEditing ? (
        tourist ? (
          <TouristForm
            tourist={tourist}
            onUpdate={handleUpdate}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        ) : (
          <div>No tourist data available</div>
        )
      ) : (
        <div>
          <h1>{tourist.username}'s Profile</h1>
          <p>Username: {tourist.username}</p>
          <p>Email: {tourist.email}</p>
          <p>Mobile Number: {tourist.mobileNumber}</p>
          <p>Nationality: {tourist.nationality}</p>
          <p>
            Date of Birth: {new Date(tourist.dateOfBirth).toLocaleDateString()}
          </p>
          <p>Occupation: {tourist.occupation}</p>
          <p>Wallet: {tourist.wallet}</p>
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          <button onClick={() => setIsPreferencesEditing(true)}>
            Edit Preferences
          </button>{" "}
          {/* Edit preferences button */}
          <button
            className="delete-button"
            onClick={() => {
              handleRequest(tourist.username, userType);
            }} // Pass the correct user details
          >
            Request Delete
          </button>
          <Link to="/home">
            <button>Back</button>
          </Link>
        </div>
      )}

      {/* Show the PreferenceSelector component when editing preferences */}
      {isPreferencesEditing && tourist && (
        <PreferenceSelector
          username={tourist.username}
          currentPreferences={tourist.preferences}
          onPreferencesUpdate={handlePreferencesUpdate}
        />
      )}
      <div className="wallet-points-section">
        <h2>Wallet and Points</h2>
        <p>Wallet: {tourist.wallet}</p>
        <p>Points: {tourist.currentPoints}</p>
        <button onClick={handleRedeemPoints}>Redeem Points</button>
      </div>
      <h2>Bookmarked Events:</h2>
      <div className="itinerary-list">
        {itineraries.length > 0 ? (
          itineraries.map((itinerary) => (
            <ItineraryCard
              key={itinerary._id}
              itinerary={itinerary}
              onEdit={() => console.log("Edit", itinerary._id)}
              onDelete={() => console.log("Delete", itinerary._id)}
              userType={userType}
              onBook={() => console.log("Book", itinerary._id)}
              isBooked={false}
              onUnbook={() => console.log("Unbook", itinerary._id)}
              onActivationToggle={() =>
                console.log("Toggle Activation", itinerary._id)
              }
              onBookmark={handleBookmark}
              isBookmarked={bookmarkedEvents.includes(itinerary._id)}
              isProfilePage={isProfilePage}
            />
          ))
        ) : (
          <p>No bookmarked events</p>
        )}
      </div>

      <h2>Notifications (Bookmarked, Changed, Activated):</h2>
      <div className="itinerary-list">
        {filteredBookmarkedItineraries.length > 0 ? (
          filteredBookmarkedItineraries.map((eventId) => {
            const itinerary = itineraries.find((item) => item._id === eventId);
            return itinerary ? (
              <ItineraryCard
                key={itinerary._id}
                itinerary={itinerary}
                onBookmark={handleBookmark}
                isBookmarked={bookmarkedEvents.includes(itinerary._id)}
                isProfilePage={isProfilePage}
              />
            ) : null;
          })
        ) : (
          <p>No bookmarked itineraries with 'changed' and 'activated' status</p>
        )}
      </div>

      <h2>Booked Itineraries (Within 2 Days):</h2>
      <div className="itinerary-list">
        {bookedItineraries.length > 0 ? (
          bookedItineraries.map((itinerary) => (
            <ItineraryCard
              key={itinerary._id}
              itinerary={itinerary}
              onBookmark={handleBookmark}
              isBookmarked={bookmarkedEvents.includes(itinerary._id)}
              isProfilePage={isProfilePage}
            />
          ))
        ) : (
          <p>No booked itineraries within the next 2 days</p>
        )}
      </div>
      <div className="user-level-badge">
        {userLevel === 1 && <img src={level1Image} alt="Level 1 Badge" />}
        {userLevel === 2 && <img src={level2Image} alt="Level 2 Badge" />}
        {userLevel === 3 && <img src={level3Image} alt="Level 3 Badge" />}
      </div>
    </div>
  );
};

export default TouristProfile;
