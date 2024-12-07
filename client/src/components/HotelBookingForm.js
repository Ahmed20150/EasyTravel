import React, { useState } from "react";
// import "../css/TravelerForm.css"; // Reuse existing styles

const HotelBookingForm = ({
  show,
  onClose,
  onSubmit,
  numberOfGuests,
  offerId,
}) => {
  const [guests, setGuests] = useState(
    Array(numberOfGuests)
      .fill()
      .map(() => ({
        title: "MR",
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
      }))
  );

  const [payment, setPayment] = useState({
    vendorCode: "VI",
    cardNumber: "",
    expiryDate: "",
  });

  const [specialRequest, setSpecialRequest] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Validate card number (basic Luhn algorithm could be added)
    if (!/^\d{16}$/.test(payment.cardNumber)) {
      newErrors.cardNumber = "Card number must be 16 digits";
    }

    // Validate expiry date
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(payment.expiryDate)) {
      newErrors.expiryDate = "Invalid expiry date format (YYYY-MM)";
    }

    // Validate guests
    guests.forEach((guest, index) => {
      if (!guest.email?.includes("@")) {
        newErrors[`guest-${index}-email`] = "Invalid email address";
      }
      if (!/^\+\d{10,15}$/.test(guest.phone)) {
        newErrors[`guest-${index}-phone`] =
          "Phone must start with + and have 10-15 digits";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const bookingData = {
      data: {
        offerId,
        guests: guests.map((guest, index) => ({
          id: index + 1,
          name: {
            title: guest.title,
            firstName: guest.firstName.toUpperCase(),
            lastName: guest.lastName.toUpperCase(),
          },
          contact: {
            phone: guest.phone,
            email: guest.email,
          },
        })),
        payments: [
          {
            id: 1,
            method: "creditCard",
            card: payment,
          },
        ],
        rooms: [
          {
            guestIds: guests.map((_, index) => index + 1),
            paymentId: 1,
            specialRequest,
          },
        ],
      },
    };

    onSubmit(bookingData);
  };

  // Move the show check inside the component function
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Hotel Booking Details</h2>
        <form onSubmit={handleSubmit}>
          {/* Guest Information */}
          {guests.map((guest, index) => (
            <div key={index} className="traveler-section">
              <h3>Guest {index + 1}</h3>
              <div className="form-grid">
                <select
                  value={guest.title}
                  onChange={(e) => {
                    const newGuests = [...guests];
                    newGuests[index].title = e.target.value;
                    setGuests(newGuests);
                  }}
                >
                  <option value="MR">Mr</option>
                  <option value="MS">Ms</option>
                  <option value="MRS">Mrs</option>
                </select>
                <input
                  type="text"
                  placeholder="First Name"
                  value={guest.firstName}
                  onChange={(e) => {
                    const newGuests = [...guests];
                    newGuests[index].firstName = e.target.value;
                    setGuests(newGuests);
                  }}
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={guest.lastName}
                  onChange={(e) => {
                    const newGuests = [...guests];
                    newGuests[index].lastName = e.target.value;
                    setGuests(newGuests);
                  }}
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone (e.g., +33679278416)"
                  value={guest.phone}
                  onChange={(e) => {
                    const newGuests = [...guests];
                    newGuests[index].phone = e.target.value;
                    setGuests(newGuests);
                  }}
                  required
                />
                {errors[`guest-${index}-phone`] && (
                  <div className="error-message">
                    {errors[`guest-${index}-phone`]}
                  </div>
                )}
                <input
                  type="email"
                  placeholder="Email"
                  value={guest.email}
                  onChange={(e) => {
                    const newGuests = [...guests];
                    newGuests[index].email = e.target.value;
                    setGuests(newGuests);
                  }}
                  required
                />
                {errors[`guest-${index}-email`] && (
                  <div className="error-message">
                    {errors[`guest-${index}-email`]}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Payment Information */}
          <div className="traveler-section">
            <h3>Payment Details</h3>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Card Number"
                value={payment.cardNumber}
                onChange={(e) =>
                  setPayment({ ...payment, cardNumber: e.target.value })
                }
                required
              />
              {errors.cardNumber && (
                <div className="error-message">{errors.cardNumber}</div>
              )}
              <input
                type="month"
                placeholder="Expiry Date (YYYY-MM)"
                value={payment.expiryDate}
                onChange={(e) =>
                  setPayment({ ...payment, expiryDate: e.target.value })
                }
                required
              />
              {errors.expiryDate && (
                <div className="error-message">{errors.expiryDate}</div>
              )}
            </div>
          </div>

          {/* Special Request */}
          <div className="traveler-section">
            <h3>Special Request</h3>
            <textarea
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              placeholder="Enter any special requests..."
              rows="3"
            />
          </div>

          <div className="button-group">
            <button type="submit" className="submit-btn">
              Confirm Booking
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Make sure to use a default export
export default HotelBookingForm;
