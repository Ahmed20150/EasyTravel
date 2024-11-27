const express = require("express");
const router = express.Router();
const axios = require("axios");
const Tourist = require("../models/tourist.model"); // Adjust the path as needed

router.post("/", async (req, res) => {
  const {
    cityCode,
    checkInDate,
    checkOutDate,
    adults,
    roomQuantity,
    currency,
    countryOfResidence,
    priceRange,
    paymentPolicy,
    boardType,
    includeClosed,
    bestRateOnly,
    lang,
  } = req.body;

  // Validate dates
  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regex)) return false;
    const date = new Date(dateString);
    const timestamp = date.getTime();
    if (typeof timestamp !== "number" || Number.isNaN(timestamp)) return false;
    return dateString === date.toISOString().split("T")[0];
  };

  if (!isValidDate(checkInDate) || !isValidDate(checkOutDate)) {
    return res
      .status(400)
      .json({ error: "Invalid date format. Use YYYY-MM-DD." });
  }

  try {
    // Get access token
    const API_KEY = "HPqf3pVyphn2AvaeiS91Bs8nOaGVHGGk";
    const API_SECRET = "tacunKixDcMglp0q";

    const tokenResponse = await axios.post(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: API_KEY,
        client_secret: API_SECRET,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const accessToken = tokenResponse.data.access_token;
    console.log("Access Token Response:", tokenResponse.data);

    // Get list of hotels by city code
    const hotelsByCityResponse = await axios.get(
      "https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city",
      {
        params: { cityCode },
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    console.log("Hotels By City Response:", hotelsByCityResponse.data);

    const hotelsByCity = hotelsByCityResponse.data.data;
    if (hotelsByCity.length === 0) {
      return res
        .status(404)
        .json({ error: "No hotels found for the given city code" });
    }

    // Use the geocode from the first hotel to get the list of hotels by geocode
    const { latitude, longitude } = hotelsByCity[0].geoCode;

    const hotelsByGeocodeResponse = await axios.get(
      "https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-geocode",
      {
        params: { latitude, longitude },
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    console.log("Hotels By Geocode Response:", hotelsByGeocodeResponse.data);

    const hotelsByGeocode = hotelsByGeocodeResponse.data.data;
    if (hotelsByGeocode.length === 0) {
      return res
        .status(404)
        .json({ error: "No hotels found for the given geocode" });
    }

    // Get list of available offers by hotel IDs in chunks
    const hotelIds = hotelsByGeocode.map((hotel) => hotel.hotelId);
    const chunkSize = 50; // Adjust chunk size if necessary
    const hotelOffers = [];

    for (let i = 0; i < hotelIds.length; i += chunkSize) {
      const chunk = hotelIds.slice(i, i + chunkSize).join(",");
      const hotelOffersResponse = await axios.get(
        "https://test.api.amadeus.com/v3/shopping/hotel-offers",
        {
          params: {
            hotelIds: chunk,
            adults,
            checkInDate,
            checkOutDate,
            roomQuantity,
            currency,
            countryOfResidence,
            priceRange,
            paymentPolicy,
            boardType,
            includeClosed,
            bestRateOnly,
            lang,
          },
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.log("Hotel Offers Response for chunk:", hotelOffersResponse.data);
      hotelOffers.push(...hotelOffersResponse.data.data);
    }

    // Print the details of the offers
    hotelOffers.forEach((offer, index) => {
      console.log(`Offer ${index + 1} Details:`, offer);
    });

    res.json({ data: hotelOffers });
  } catch (error) {
    console.error(
      "Error fetching hotel offers:",
      error.response?.data || error.message
    );

    if (error.response) {
      if (error.response.status === 404) {
        if (
          error.response.data.errors &&
          error.response.data.errors[0].code === 38196
        ) {
          return res.status(404).json({
            error: "Resource not found: The targeted resource doesn't exist",
          });
        }
        return res.status(404).json({ error: "Resource not found" });
      }
      if (error.response.status === 400) {
        if (
          error.response.data.errors &&
          error.response.data.errors[0].code === 425
        ) {
          return res
            .status(400)
            .json({ error: "Invalid date: Amadeus Error - INVALID DATE" });
        }
      }
    }

    res
      .status(500)
      .json({ error: error.response?.data || "Failed to fetch hotel offers" });
  }
});

router.put("/bookHotels", async (req, res) => {
  try {
    console.log("Raw request body:", req.body);
    console.log("Content-Type:", req.headers["content-type"]);

    const { username, newBookedHotelId } = req.body;
    console.log("Parsed request:", { username, newBookedHotelId });

    if (!username || !newBookedHotelId) {
      console.log("Missing fields:", { username, newBookedHotelId });
      return res.status(400).json({
        message: "Missing required fields",
        received: { username, newBookedHotelId },
      });
    }

    // Get current tourist data
    const tourist = await Tourist.findOne({ username });
    console.log("Found tourist:", tourist);

    if (!tourist) {
      return res.status(404).json({
        message: "Tourist not found",
        username: username,
      });
    }

    // Ensure BookedHotels is initialized as an array
    const currentHotels = tourist.BookedHotels || [];
    const updatedHotels = [...currentHotels, newBookedHotelId];

    console.log("Current hotels:", currentHotels);
    console.log("Updated hotels:", updatedHotels);

    const updatedTourist = await Tourist.findOneAndUpdate(
      { username },
      { $set: { BookedHotels: updatedHotels } },
      { new: true }
    );

    console.log("Updated tourist:", updatedTourist);

    res.status(200).json({
      message: "Hotel booked successfully",
      bookedHotels: updatedTourist.BookedHotels,
    });
  } catch (error) {
    console.error("Detailed error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;
