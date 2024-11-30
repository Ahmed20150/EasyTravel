import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddAddressPage = () => {
  const [username, setUsername] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [label, setLabel] = useState('Home');
  const [message, setMessage] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);

  const navigate = useNavigate(); // Initialize navigate hook

   // To avoid sending too many requests
   useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (username) {
        axios
          .get(`http://localhost:3000/api/tourists/${username}/addresses`)
          .then((response) => {
            setAddresses(response.data);
            setMessage('');
          })
          .catch((error) => {
            setMessage('Failed to fetch addresses');
          });
      } else {
        setAddresses([]);
      }
    }, 500); // Delay for 500ms after the user stops typing

    return () => clearTimeout(timeoutId); // Cleanup the timeout on each change
  }, [username]);

  

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username) {
      setIsFormVisible(true);
    } else {
      setMessage('Please enter a valid username');
    }
  };

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
      setAddresses([...addresses, addressData]);

      await axios.post(
        `http://localhost:3000/api/tourists/${username}/addresses`,
        addressData
      );

      setStreet('');
      setCity('');
      setState('');
      setPostalCode('');
      setCountry('');
      setLabel('Home');
      setMessage('Address added successfully!');

      // Optionally, refetch the updated addresses after adding
      axios
        .get(`http://localhost:3000/api/tourists/${username}/addresses`)
        .then((response) => {
          setAddresses(response.data); // Update the address list
        })
        .catch((error) => {
          setMessage('Failed to fetch updated addresses.');
        });
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to add address.');
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setIsDefaultAddress(false);
  };

  const handleSetDefault = async (address) => {
    setMessage('');  // Clear any previous messages before setting a new one
    setIsDefaultAddress(false); // Reset the default address state
  
    try {
      // Send the request to set the address as default
      const response = await axios.put(
        `http://localhost:3000/api/tourists/${username}/addresses/${address._id}/default`
      );
  
      // If successful, set the default address and show success message
      setIsDefaultAddress(true);
      setMessage(`You have successfully set "${address.label}" as the default address.`);
      
    } catch (error) {
      // Handle error case if the address wasn't found or other errors occur
      console.error('Error setting default address:', error);
      setMessage(error.response?.data?.error || 'Address not found!');
    }
  };
  
  
  const handleEditAddress = (address) => {
    setStreet(address.street);
    setCity(address.city);
    setState(address.state);
    setPostalCode(address.postalCode);
    setCountry(address.country);
    setLabel(address.label);
    setAddresses(addresses.filter(addr => addr._id !== address._id));
  };

  const handleRemoveAddress = (address) => {
    const updatedAddresses = addresses.filter(addr => addr._id !== address._id); // Remove address locally
    setAddresses(updatedAddresses); // Update state immediately
  
    axios.delete(
      `http://localhost:3000/api/tourists/${username}/addresses/${address.label}`
    )
    .then(() => {
      setMessage('Address removed successfully!');
      // Optional: Refetch the addresses from the backend to ensure consistency
      axios.get(`http://localhost:3000/api/tourists/${username}/addresses`)
        .then((response) => {
          setAddresses(response.data); // Update the address list after deletion
        })
        .catch((error) => {
          setMessage('Failed to fetch updated addresses.');
          console.error(error);
        });
    })
    .catch((error) => {
      // In case of failure, roll back the state update
      setAddresses(addresses); // Restore the previous state
      setMessage('Failed to remove address.');
      console.error(error);
    });
  };
  


  // Define the styles
  const containerStyle = {
    padding: '20px',
    margin: '0 auto',
    maxWidth: '600px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  };

  const backButtonStyle = {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '20px',
  };

  const buttonStyle = (type) => {
    let backgroundColor = '#007bff'; // Default blue
    let textColor = 'white';

    if (type === 'default') {
      backgroundColor = '#28a745'; // Green for 'Set as Default'
    } else if (type === 'remove') {
      backgroundColor = '#dc3545'; // Red for 'Remove'
    } else if (type === 'edit') {
      backgroundColor = '#ffc107'; // Yellow for 'Edit'
    }

    return {
      padding: '5px 10px',
      backgroundColor,
      color: textColor,
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      margin: '5px',
    };
  };

  return (
    <div style={containerStyle}>
      {/* Back Button */}
      <button
        style={backButtonStyle}
        onClick={() => navigate("/home")}
      >
        Back
      </button>

      <div>
        <h1>Addresses</h1>
        {!isFormVisible ? (
          <form onSubmit={handleUsernameSubmit}>
            <input
              type="text"
              placeholder="Enter Your Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <button type="submit">Add Address</button>
          </form>
        ) : (
          <div>
            <h2>Enter Address Details</h2>
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
              <button type="submit">Add Address</button>
            </form>
          </div>
        )}
      </div>

      {/* Show the list of addresses added */}
      <div>
        <h3>Available Addresses</h3>
        {addresses.length > 0 ? (
          <ul>
            {addresses.map((address, index) => (
              <li key={index}>
                {address.label}: {address.street}, {address.city}, {address.state}, {address.postalCode}, {address.country}
                <button onClick={() => handleSelectAddress(address)} style={buttonStyle('select')}>Select</button>
                <button onClick={() => handleSetDefault(address)} style={buttonStyle('default')}>Set as Default</button>
                <button onClick={() => handleEditAddress(address)} style={buttonStyle('edit')}>Edit</button>
                <button onClick={() => handleRemoveAddress(address)} style={buttonStyle('remove')}>Remove</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No addresses added yet.</p>
        )}
      </div>

      {/* Show selected address details and message */}
      {selectedAddress && (
        <div>
          <h4>Selected Address:</h4>
          <p>{selectedAddress.label}: {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.postalCode}, {selectedAddress.country}</p>
          {isDefaultAddress && <p>This is your default address.</p>}
        </div>
      )}

      {/* Show any messages */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddAddressPage;
