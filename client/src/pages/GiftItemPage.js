import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GiftItemForm = () => {
  const [giftItems, setGiftItems] = useState([]);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [purchases, setPurchases] = useState('');

  // Fetch gift items when the component mounts
  useEffect(() => {
    const fetchGiftItems = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/giftitems');
        setGiftItems(response.data);
      } catch (error) {
        console.error('Error fetching gift items:', error);
      }
    };

    fetchGiftItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const giftItem = {
      name,
      image,
      description,
      price: parseFloat(price), // Convert to number
      purchases: parseInt(purchases), // Convert to integer
    };

    try {
      const response = await axios.post('http://localhost:3000/api/giftitems', giftItem);
      console.log('Gift item added:', response.data);
      alert('Gift item added successfully!');

      // Clear the form fields after submission
      setName('');
      setImage('');
      setDescription('');
      setPrice('');
      setPurchases('');

      // Fetch updated gift items list
      const updatedResponse = await axios.get('http://localhost:3000/api/giftitems');
      setGiftItems(updatedResponse.data);
    } catch (error) {
      console.error('Error adding gift item:', error);
      alert('Failed to add gift item.');
    }
  };

  return (
    <div>
      <h1>Add Gift Item</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Image URL:
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Description:
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Price:
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Purchases:
            <input
              type="number"
              value={purchases}
              onChange={(e) => setPurchases(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Add Gift Item</button>
      </form>

      <h2>Gift Items</h2>
      <ul>
        {giftItems.map((item) => (
          <li key={item._id}>
            <h3>{item.name}</h3>
            <img src={item.image} alt={item.name} style={{ width: '100px' }} />
            <p>{item.description}</p>
            <p>Price: ${item.price.toFixed(2)}</p>
            <p>Purchases: {item.purchases}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GiftItemForm;