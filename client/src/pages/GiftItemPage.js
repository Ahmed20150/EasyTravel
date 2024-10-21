import React from 'react';
import axios from 'axios';

const GiftItemForm = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const giftItem = {
      name: 'Teddy Bear',
      image: 'https://example.com/teddy-bear.jpg',
      description: 'A soft and cuddly teddy bear.',
      price: 19.99,
      purchases: 0
    };

    try {
      const response = await axios.post('http://localhost:3000/api/giftitems', giftItem);
      console.log('Gift item added:', response.data);
      alert('Gift item added successfully!');
    } catch (error) {
      console.error('Error adding gift item:', error);
      alert('Failed to add gift item.');
    }
  };

  return (
    <div>
      <h1>Add Gift Item</h1>
      <form onSubmit={handleSubmit}>
        <button type="submit">Add Gift Item</button>
      </form>
    </div>
  );
};

export default GiftItemForm;
