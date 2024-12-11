import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


const ViewAllGifts = () => {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all gifts
  const fetchGifts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:3000/admin/all-gifts');
      setGifts(response.data);
    } catch (err) {
      setError('Failed to fetch gifts. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle archived status
  const toggleArchiveStatus = async (id) => {
    try {
      await axios.patch(`http://localhost:3000/admin/all-gifts/archive/${id}`);
      // Update the UI after toggling
      setGifts((prevGifts) =>
        prevGifts.map((gift) =>
          gift._id === id ? { ...gift, archived: !gift.archived } : gift
        )
      );
    } catch (err) {
      setError('Failed to update archive status. Please try again.');
      console.error(err);
    }
  };

  // Fetch gifts on component mount
  useEffect(() => {
    fetchGifts();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
       <Link to="/home">
        <button className={`${buttonStyle} mt-4`}>Back</button>
      </Link>
      {/* All Gifts Heading */}
    <h2 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '20px' }}>All Gifts</h2>


      {loading && <p>Loading gifts...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && gifts.length === 0 && <p>No gifts found.</p>}

      {!loading && gifts.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Description</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Price</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Archived</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {gifts.map((gift) => (
              <tr key={gift._id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{gift.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{gift.description}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>${gift.price}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {gift.archived ? 'Yes' : 'No'}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <button
                    onClick={() => toggleArchiveStatus(gift._id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: gift.archived ? '#4caf50' : '#f44336',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    {gift.archived ? 'Unarchive' : 'Archive'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewAllGifts;