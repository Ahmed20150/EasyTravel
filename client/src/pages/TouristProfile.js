// client/src/pages/TouristProfile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PreferenceSelector from '../components/PreferenceSelector';  // Import the new component
import { useLocation, Link } from 'react-router-dom';
import { useCookies } from "react-cookie";
import ItineraryCard from "../components/ItineraryItem";
import TouristForm from "../components/TouristForm";
import level1Image from "../images/Level_1.avif"; // Adjust the path as needed
import level2Image from "../images/Level_2.avif"; // Adjust the path as needed
import level3Image from "../images/Level_3.webp"; // Adjust the path as needed

const TouristProfile = () => {
    const [cookies] = useCookies(["userType", "username"]);
    const userType = cookies.userType;
    const [tourist, setTourist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isPreferencesEditing, setIsPreferencesEditing] = useState(false); // State to toggle preferences editing
    const location = useLocation();
    const [promoCodes, setPromoCodes] = useState([]);  // State to store promo codes
    const { username } = location.state || {};
      const [bookmarkedEvents, setBookmarkedEvents] = useState([]);
      const [itineraries, setItineraries] = useState([]);
      const [bookedItineraries, setBookedItineraries] = useState([]); // New state for booked itineraries
      const isProfilePage = true;
      const [userLevel, setUserLevel] = useState(null); // State to store user level


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
      const fetchPromoCodes = async () => {  // New function to fetch promo codes
        try {
          const response = await axios.get(
            "http://localhost:3000/api/promo-codes"
          );
          setPromoCodes(response.data || []);
        } catch (err) {
          console.error("Error fetching promo codes", err);
        }
      };

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
      fetchPromoCodes();
    }, [username]);


    const handleRequest = async (username, role) => {
        try {
            const response = await axios.post(`http://localhost:3000/Request/requestDelete/${username}/${role}`);
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
            const response = await axios.put(`http://localhost:3000/api/tourist/${username}`, updatedTourist);
            setTourist(response.data);
            setIsEditing(false);
        } catch (err) {
            setError('Failed to update tourist profile');
        }
    };

    const handlePreferencesUpdate = (updatedPreferences) => {
        setTourist(prevTourist => ({
            ...prevTourist,
            preferences: updatedPreferences
        }));
        setIsPreferencesEditing(false);
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
     const filteredPromoCodes = 0;
     useEffect(() => {
      if (!tourist) return; // Ensure tourist data is available before proceeding
    
      const dob = new Date(tourist.dateOfBirth);
    
      const filteredPromoCodes = promoCodes.filter((promo) => {
        const expiryDate = new Date(promo.expiryDate);
        const today = new Date();
        const dobMonthDay = `${dob.getMonth()}-${dob.getDate()}`;
        const todayMonthDay = `${today.getMonth()}-${today.getDate()}`;
        const isBirthday = dobMonthDay === todayMonthDay;
        const isPromoValid = expiryDate > today;
    
        return isBirthday && isPromoValid;
      });
    
      console.log(
        filteredPromoCodes.length > 0
          ? `Available promo codes: ${filteredPromoCodes}`
          : "No available promo codes for today."
      );
    
      // Additional operations like sending emails based on filtered promo codes
    }, [tourist, promoCodes]); // Runs whenever tourist or promoCodes changes

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
    
      if (tourist && filteredPromoCodes.length > 0) {
        // Check if today is the tourist's birthday
        const today = new Date();
        const birthday = new Date(tourist.dateOfBirth);
    
        if (today.getDate() === birthday.getDate() && today.getMonth() === birthday.getMonth()) {
          const promoDetails = filteredPromoCodes
            .map(
              (promo) =>
                `Promo Code: ${promo.promoCode}\nDiscount: ${promo.discount}%\nExpires on: ${new Date(promo.expiryDate).toLocaleDateString()}\n`
            )
            .join("\n\n");
    
          const subject = "Happy Birthday! Here are your Promo Codes";
          const text = `Dear ${tourist.username},\n\nHappy Birthday! 🎉\n\nWe have some special promo codes for you:\n\n${promoDetails}\n\nEnjoy your special day!`;
    
          // Send the email with promo details
          sendEmail(tourist.email, subject, text)
            .then((response) => console.log(`Email sent: ${response}`))
            .catch((error) => console.error("Error sending email:", error));
        }
      }
    }, [tourist, filteredPromoCodes]);

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
     const filteredBookmarkedItineraries = bookmarkedEvents.filter(
       (eventId) => {
         // Find the itinerary by the eventId in the itineraries list
         const itinerary = itineraries.find((item) => item._id === eventId);
         return (
           itinerary &&
           itinerary.changed === true &&
           itinerary.activated === true
         );
       }
     );


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
        <div>
          <h1>{tourist.username}'s Profile</h1>
          <p><strong>Username:</strong> {tourist.username}</p>
          <p><strong>Email:</strong> {tourist.email}</p>
          <p><strong>Mobile Number:</strong> {tourist.mobileNumber}</p>
          <p><strong>Nationality:</strong> {tourist.nationality}</p>
          <p>
            <strong>Date of Birth:</strong>{" "}
            {new Date(tourist.dateOfBirth).toLocaleDateString()}
          </p>
          <p><strong>Occupation:</strong> {tourist.occupation}</p>
          <p><strong>Wallet:</strong> {tourist.wallet}</p>
          <div className="flex flex-wrap gap-4 mt-4">
            <button
              onClick={() => setIsEditing(true)}
              className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Edit Profile
            </button>
            <button
              onClick={() => setIsPreferencesEditing(true)}
              className="py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Edit Preferences
            </button>
            <button
              className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
              onClick={() => handleRequest(tourist.username, userType)}
            >
              Request Delete
            </button>
            <Link to="/home">
              <button className="py-2 px-4 bg-gray-300 rounded-lg hover:bg-gray-400">
                Back
              </button>
            </Link>
          </div>
        </div>

        {isPreferencesEditing && tourist && (
          <PreferenceSelector
            username={tourist.username}
            currentPreferences={tourist.preferences}
            onPreferencesUpdate={handlePreferencesUpdate}
          />
        )}

        <div className="wallet-points-section">
          <h2 className="text-2xl font-bold mt-6">Wallet and Points</h2>
          <p><strong>Wallet:</strong> {tourist.wallet}</p>
          <p><strong>Points:</strong> {tourist.currentPoints}</p>
          <button
            onClick={handleRedeemPoints}
            className="mt-4 py-2 px-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            Redeem Points
          </button>
        </div>

        <h2 className="text-2xl font-bold mt-6">Bookmarked Events:</h2>
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

        <h2 className="text-2xl font-bold mt-6">Notifications (Bookmarked, Changed, Activated):</h2>
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
            <p>
              No bookmarked itineraries with 'changed' and 'activated' status
            </p>
          )}
        </div>

        <h2 className="text-2xl font-bold mt-6">Booked Itineraries (Within 2 Days):</h2>
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

        <div>
          <h2 className="text-2xl font-bold mt-6">Promo Codes:</h2>
          {filteredPromoCodes.length > 0 ? (
            <ul>
              {filteredPromoCodes.map((promo, index) => (
                <li key={index} className="mb-4">
                  <strong>Promo Code:</strong> {promo.promoCode} <br />
                  <strong>Discount:</strong> {promo.discount}% <br />
                  <strong>Expires on:</strong> {new Date(promo.expiryDate).toLocaleDateString()} <br />
                </li>
              ))}
            </ul>
          ) : (
            <p>No valid promo codes available</p>
          )}
        </div>

        <div className="user-level-badge mt-6">
          {userLevel === 1 && <img src={level1Image} alt="Level 1 Badge" />}
          {userLevel === 2 && <img src={level2Image} alt="Level 2 Badge" />}
          {userLevel === 3 && <img src={level3Image} alt="Level 3 Badge" />}
        </div>
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
              const itinerary = itineraries.find(
                (item) => item._id === eventId
              );
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
            <p>
              No bookmarked itineraries with 'changed' and 'activated' status
            </p>
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
        <div>
        <h2>Promo Codes:</h2>
        {filteredPromoCodes.length > 0 ? (
          <ul>
            {filteredPromoCodes.map((promo, index) => (
              <li key={index}>
                <strong>Promo Code:</strong> {promo.promoCode} <br />
                <strong>Discount:</strong> {promo.discount}% <br />
                <strong>Expires on:</strong> {new Date(promo.expiryDate).toLocaleDateString()} <br />
              </li>
            ))}
          </ul>
        ) : (
          <p>No valid promo codes available</p>
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