import React, { useState } from "react";
// import "../css/TravelerForm.css";
import countries from "../data/countries";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@material-ui/core/Box";

const TravelerForm = ({ show, onClose, onSubmit, numberOfTravelers }) => {
  const [errors, setErrors] = useState({});
  const [travelers, setTravelers] = useState(
    Array(numberOfTravelers)
      .fill()
      .map(() => ({
        dateOfBirth: "",
        firstName: "",
        lastName: "",
        gender: "MALE",
        email: "",
        phoneNumber: "",
        countryCode: "",
        // Passport details
        passportNumber: "",
        passportIssuanceDate: "",
        passportExpiryDate: "",
        passportIssuanceLocation: "",
        passportIssuanceCountry: "",
        nationality: "",
        birthPlace: "",
      }))
  );
  const [loading, setLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null); // 'success' or 'error'
  const [bookingMessage, setBookingMessage] = useState('');

  // Add validation rules
  const validationRules = {
    passportNumber: /^[A-Z][0-9]{8}$/, // One letter followed by 8 numbers
    countryCode: /^\d{1,3}$/, // 1-3 digit number
    phoneNumber: /^\d{9,15}$/, // 9-15 digits
    nationality: countries.map(country => country.code) // Array of valid country codes
  };

  const validateForm = (travelers) => {
    const newErrors = {};

    travelers.forEach((traveler, index) => {
      // Passport number validation
      if (!validationRules.passportNumber.test(traveler.passportNumber)) {
        newErrors[`${index}-passportNumber`] =
          "Passport number must be 1 letter followed by 8 numbers";
      }

      // Country code validation
      if (!validationRules.countryCode.test(traveler.countryCode)) {
        newErrors[`${index}-countryCode`] = "Country code must be 1-3 digits";
      }

      // Phone number validation
      if (!validationRules.phoneNumber.test(traveler.phoneNumber)) {
        newErrors[`${index}-phoneNumber`] = "Phone number must be 9-15 digits";
      }

      // Nationality validation - check if nationality exists in countries list
      if (!countries.some(country => country.code === traveler.nationality)) {
        newErrors[`${index}-nationality`] = "Please select a valid country";
      }

      // Date validations
      const today = new Date();
      const birthDate = new Date(traveler.dateOfBirth);
      const expiryDate = new Date(traveler.passportExpiryDate);
      const issuanceDate = new Date(traveler.passportIssuanceDate);

      if (birthDate >= today) {
        newErrors[`${index}-dateOfBirth`] = "Birth date must be in the past";
      }

      if (expiryDate <= today) {
        newErrors[`${index}-passportExpiryDate`] =
          "Passport must not be expired";
      }

      if (issuanceDate >= today) {
        newErrors[`${index}-passportIssuanceDate`] =
          "Issuance date must be in the past";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm(travelers)) {
      try {
        setLoading(true);
        const formattedTravelers = travelers.map((traveler) => ({
          ...traveler,
          nationality: traveler.nationality.toUpperCase(),
          issuanceCountry: traveler.nationality.toUpperCase(),
          validityCountry: traveler.nationality.toUpperCase(),
        }));
        
        await onSubmit(formattedTravelers);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTravelerChange = (index, field, value) => {
    const newTravelers = [...travelers];
    newTravelers[index] = { ...newTravelers[index], [field]: value };
    setTravelers(newTravelers);
  };

  // Add a new handler for country selection
  const handleCountrySelection = (index, value) => {
    const newTravelers = [...travelers];
    if (value) {
      newTravelers[index] = {
        ...newTravelers[index],
        nationality: value.code,
        countryCode: value.phone // Set the country code directly from selection
      };
    } else {
      newTravelers[index] = {
        ...newTravelers[index],
        nationality: "",
        countryCode: ""
      };
    }
    setTravelers(newTravelers);
  };

  // Add new function to handle closing error state
  const handleErrorClose = () => {
    setBookingStatus(null);
    setBookingMessage('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {loading ? (
          <div className="booking-loader">
            <div className="loader-spinner"></div>
            <h3>Processing your booking...</h3>
            <p>Please wait while we confirm your reservation</p>
          </div>
        ) : bookingStatus ? (
          <div className={`booking-status ${bookingStatus}`}>
            <div className="status-icon">
              {bookingStatus === 'success' ? '✓' : '✗'}
            </div>
            <h3>{bookingMessage}</h3>
            {bookingStatus === 'error' && (
              <button onClick={handleErrorClose} className="error-close-btn">
                Try Again
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {travelers.map((traveler, index) => (
              <div key={index} className="traveler-section">
                <h3>Traveler {index + 1}</h3>
                <div className="form-grid">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={traveler.firstName}
                    onChange={(e) =>
                      handleTravelerChange(index, "firstName", e.target.value)
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={traveler.lastName}
                    onChange={(e) =>
                      handleTravelerChange(index, "lastName", e.target.value)
                    }
                    required
                  />
                  <input
                    type="date"
                    placeholder="Date of Birth"
                    value={traveler.dateOfBirth}
                    onChange={(e) =>
                      handleTravelerChange(index, "dateOfBirth", e.target.value)
                    }
                    required
                  />
                  {errors[`${index}-dateOfBirth`] && (
                    <div className="error-message">
                      {errors[`${index}-dateOfBirth`]}
                    </div>
                  )}
                  <select
                    value={traveler.gender}
                    onChange={(e) =>
                      handleTravelerChange(index, "gender", e.target.value)
                    }
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                  <input
                    type="email"
                    placeholder="Email"
                    value={traveler.email}
                    onChange={(e) =>
                      handleTravelerChange(index, "email", e.target.value)
                    }
                    required
                  />
                  <div className="phone-group">
                    <input
                      type="text"
                      placeholder="Country Code"
                      value={traveler.countryCode} // Changed from countryCode to traveler.countryCode
                      onChange={(e) =>
                        handleTravelerChange(index, "countryCode", e.target.value)
                      }
                      required
                    />
                    {errors[`${index}-countryCode`] && (
                      <div className="error-message">
                        {errors[`${index}-countryCode`]}
                      </div>
                    )}
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={traveler.phoneNumber}
                      onChange={(e) =>
                        handleTravelerChange(index, "phoneNumber", e.target.value)
                      }
                      required
                    />
                    {errors[`${index}-phoneNumber`] && (
                      <div className="error-message">
                        {errors[`${index}-phoneNumber`]}
                      </div>
                    )}
                  </div>

                  {/* Passport Details */}
                  <input
                    type="text"
                    placeholder="Passport Number (e.g., A12345678)"
                    value={traveler.passportNumber}
                    onChange={(e) =>
                      handleTravelerChange(
                        index,
                        "passportNumber",
                        e.target.value.toUpperCase()
                      )
                    }
                    pattern={validationRules.passportNumber.source}
                    required
                  />
                  {errors[`${index}-passportNumber`] && (
                    <div className="error-message">
                      {errors[`${index}-passportNumber`]}
                    </div>
                  )}
                  <input
                    type="date"
                    placeholder="Passport Issuance Date"
                    value={traveler.passportIssuanceDate}
                    onChange={(e) =>
                      handleTravelerChange(
                        index,
                        "passportIssuanceDate",
                        e.target.value
                      )
                    }
                    required
                  />
                  {errors[`${index}-passportIssuanceDate`] && (
                    <div className="error-message">
                      {errors[`${index}-passportIssuanceDate`]}
                    </div>
                  )}
                  <input
                    type="date"
                    placeholder="Passport Expiry Date"
                    value={traveler.passportExpiryDate}
                    onChange={(e) =>
                      handleTravelerChange(
                        index,
                        "passportExpiryDate",
                        e.target.value
                      )
                    }
                    required
                  />
                  {errors[`${index}-passportExpiryDate`] && (
                    <div className="error-message">
                      {errors[`${index}-passportExpiryDate`]}
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Passport Issuance Location"
                    value={traveler.passportIssuanceLocation}
                    onChange={(e) =>
                      handleTravelerChange(
                        index,
                        "passportIssuanceLocation",
                        e.target.value
                      )
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Birth Place"
                    value={traveler.birthPlace}
                    onChange={(e) =>
                      handleTravelerChange(index, "birthPlace", e.target.value)
                    }
                    required
                  />
                  <Autocomplete
                    id="country-select-demo"
                    sx={{ width: 300 }}
                    options={countries}
                    autoHighlight
                    getOptionLabel={(option) => option.label}
                    onChange={(event, value) => handleCountrySelection(index, value)}
                    renderOption={(props, option) => (
                      <Box
                        component="li"
                        sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                        {...props}
                      >
                        <img
                          loading="lazy"
                          width="20"
                          src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                          srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                          alt=""
                        />
                        {option.label} ({option.code}) +{option.phone}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Choose a country"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: "new-password", // disable autocomplete and autofill
                        }}
                      />
                    )}
                  />
                  {errors[`${index}-nationality`] && (
                    <div className="error-message">
                      {errors[`${index}-nationality`]}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div className="button-group">
              <button type="submit" className="submit-btn">
                Book Flight
              </button>
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TravelerForm;
