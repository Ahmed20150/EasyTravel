import React, { useState } from 'react';
import axios from 'axios';

const AddTourismGoverner = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted!"); // Check if the form is submitted

    const governer = { username, password };

    try {
      const response = await axios.post('http://localhost:3000/admin/add-tourismGoverner', governer);
      console.log('Tourism Governer Added:', response.data);
      window.alert(`Tourism Governer added successfully: ${response.data.message}`);
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      window.alert(`Error adding tourism governer: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Add New Tourism Governer</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
          Add Tourism Governer
        </button>
      </form>
    </div>
  );
};

export default AddTourismGoverner;
