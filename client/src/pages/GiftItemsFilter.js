import React, { useState } from 'react';
import axios from 'axios';

const GiftItemsFilter = () => {
  const [filterType, setFilterType] = useState('month'); // Default filter type is 'month'
  const [month, setMonth1] = useState('');
  const [date, setDate1] = useState('');
  const [giftItems, setGiftItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchGiftItems = async () => {
    try {
      setError('');
      setLoading(true);
      if (filterType === 'month') {
        // Validate month input
        if (!month || isNaN(month) || month < 1 || month > 12) {
          setError('Please enter a valid month (1-12).');
          return;
        }
        const response = await axios.get(`http://localhost:3000/gift/filter/byMonth`, {
          params: { month },
        });
        setGiftItems(response.data || []);
      } else if (filterType === 'date') {
        // Validate date input
        if (!date) {
          setError('Please select a valid date.');
          return;
        }
        const response = await axios.get(`http://localhost:3000/gift/filter/byDate`, {
          params: { date },
        });
        setGiftItems(response.data || []);
      } else if (filterType === 'product') {
        // Fetch all gift items along with their revenue
        const response = await axios.get(`http://localhost:3000/gift/filter/itemsWithRevenue`);
        setGiftItems(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching gift items:', err);
      setError(err.response?.data?.message || 'Failed to fetch gift items.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Gift Items Filter</h2>

      <div>
        <label>
          Select Filter Type: 
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ marginLeft: '10px' }}>
            <option value="month">Month</option>
            <option value="date">Date</option>
            <option value="product">Product</option> {/* New 'Product' option */}
          </select>
        </label>
      </div>

      {filterType === 'month' && (
        <div>
          <label>
            Enter Month (1-12): 
            <input
              type="number"
              value={month}
              onChange={(e) => setMonth1(e.target.value)}
              placeholder="Enter month"
              min="1"
              max="12"
            />
          </label>
        </div>
      )}

      {filterType === 'date' && (
        <div>
          <label>
            Select Date: 
            <input
              type="date"
              value={date}
              onChange={(e) => setDate1(e.target.value)}
              placeholder="Enter date"
            />
          </label>
        </div>
      )}

      <button
        onClick={fetchGiftItems}
        style={{ marginTop: '10px', padding: '10px 20px' }}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Fetch Gift Items'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginTop: '20px' }}>
        <h3>Filtered Gift Items:</h3>
        {giftItems.length > 0 ? (
          <ul>
            {giftItems.map((item) => (
              <li key={item._id}>
                <strong>Name:</strong> {item.name} | <strong>Revenue:</strong> ${item.revenue || 0}
                {item.date && ` | Date: ${new Date(item.date).toLocaleDateString()}`}
              </li>
            ))}
          </ul>
        ) : (
          <p>No items found for the selected {filterType === 'month' ? 'month' : filterType === 'date' ? 'date' : 'product'}.</p>
        )}
      </div>
    </div>
  );
};

export default GiftItemsFilter;
