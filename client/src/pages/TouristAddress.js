import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
// import "./AddAddressPage.css";

const AddAddressPage = () => {
  const [cookies] = useCookies(["username"]);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [label, setLabel] = useState("Home");
  const [message, setMessage] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [defaultAddress, setDefaultAddress] = useState(null); // Track the default address

  const navigate = useNavigate();
  const username = cookies.username;

  useEffect(() => {
    if (username) {
      axios
        .get(`http://localhost:3000/api/tourists/${username}/addresses`)
        .then((response) => setAddresses(response.data))
        .catch(() => setMessage("Failed to fetch addresses"));
    } else {
      setMessage("User not logged in");
    }
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const addressData = {
      street,
      city,
      state,
      postalCode,
      country,
      label,
    };

    try {
      if (editingAddress) {
        await axios.put(
          `http://localhost:3000/api/tourists/${username}/addresses/${editingAddress._id}`,
          addressData
        );
        setMessage("Address updated successfully!");
        setEditingAddress(null);
      } else {
        await axios.post(
          `http://localhost:3000/api/tourists/${username}/addresses`,
          addressData
        );
        setMessage("Address added successfully!");
      }

      const response = await axios.get(
        `http://localhost:3000/api/tourists/${username}/addresses`
      );
      setAddresses(response.data);

      setStreet("");
      setCity("");
      setState("");
      setPostalCode("");
      setCountry("");
      setLabel("Home");
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to save address.");
    }
  };

  const handleEdit = (address) => {
    setStreet(address.street);
    setCity(address.city);
    setState(address.state);
    setPostalCode(address.postalCode);
    setCountry(address.country);
    setLabel(address.label);
    setEditingAddress(address);
    setMessage("Editing address...");
  };

  const handleCancelEdit = () => {
    setStreet("");
    setCity("");
    setState("");
    setPostalCode("");
    setCountry("");
    setLabel("Home");
    setEditingAddress(null);
    setMessage("Edit canceled.");
  };

  const handleRemoveAddress = (address) => {
    const updatedAddresses = addresses.filter(
      (addr) => addr._id !== address._id
    ); // Remove address locally
    setAddresses(updatedAddresses); // Update state immediately

    axios
      .delete(
        `http://localhost:3000/api/tourists/${username}/addresses/${address.label}`
      )
      .then(() => {
        setMessage("Address removed successfully!");
        // Optional: Refetch the addresses from the backend to ensure consistency
        axios
          .get(`http://localhost:3000/api/tourists/${username}/addresses`)
          .then((response) => {
            setAddresses(response.data); // Update the address list after deletion
          })
          .catch((error) => {
            setMessage("Failed to fetch updated addresses.");
            console.error(error);
          });
      })
      .catch((error) => {
        // In case of failure, roll back the state update
        setAddresses(addresses); // Restore the previous state
        setMessage("Failed to remove address.");
        console.error(error);
      });
  };


  const handleSelectAddress = (address) => {
    setDefaultAddress(address); // Set the selected address as default
    setMessage(
      `You have successfully selected "${address.label}" as the default address.`
    );
  };

  return (
    <div>
      <button onClick={() => navigate("/home")}>Back</button>
      <h1>Addresses</h1>
      {username ? (
        <div>
          <h2>{editingAddress ? "Edit Address" : "Enter Address Details"}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Postal Code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Label (e.g., Home)"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
            <button type="submit">
              {editingAddress ? "Update Address" : "Add Address"}
            </button>
            {editingAddress && (
              <button type="button" onClick={handleCancelEdit}>
                Cancel
              </button>
            )}
          </form>

          <h3>Available Addresses</h3>
          {addresses.length > 0 ? (
            <ul>
              {addresses.map((address, index) => (
                <li key={index}>
                  {address.label}: {address.street}, {address.city},{" "}
                  {address.state}, {address.postalCode}, {address.country}
                  <button className="edit-button" onClick={() => handleEdit(address)}>Edit</button>
                  <button className="delete-button" onClick={() => handleRemoveAddress(address)}>
                    Delete
                  </button>
                  <button className="select-button" onClick={() => handleSelectAddress(address)}>
                    Select
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No addresses added yet.</p>
          )}
          {defaultAddress && (
            <p>
              Default Address: {defaultAddress.label} - {defaultAddress.street},{" "}
              {defaultAddress.city}
            </p>
          )}
        </div>
      ) : (
        <p>Please log in to manage your addresses.</p>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddAddressPage;
