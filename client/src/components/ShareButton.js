import React, { useState } from 'react';
import axios from 'axios';

const ShareButton = ({ resourceType, resourceId, userName }) => {
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [shareMethod, setShareMethod] = useState('link'); // Default is link
  
  const handleShareClick = () => {
    setShowModal(true);  // Show modal when share button is clicked
  };

  const handleSend = async () => {
    // Data to send to backend
    const data = {
      recipientEmail: email,
      resourceType,
      resourceId,
      userName,
      shareVia: shareMethod,
    };

    try {
      // Send a POST request to your backend API to share
      const response = await axios.post('/api/share', data);
      alert(response.data.message);
    } catch (error) {
      alert('Error sharing resource.');
    }

    // Close modal after sharing
    setShowModal(false);
  };

  return (
    <div>
      <button onClick={handleShareClick}>Share</button>

      {/* Modal for share options */}
      {showModal && (
        <div className="modal">
          <h2>Share this {resourceType}</h2>
          <div>
            <label>
              <input
                type="radio"
                name="shareMethod"
                value="link"
                checked={shareMethod === 'link'}
                onChange={() => setShareMethod('link')}
              />
              Share via link
            </label>
            <label>
              <input
                type="radio"
                name="shareMethod"
                value="email"
                checked={shareMethod === 'email'}
                onChange={() => setShareMethod('email')}
              />
              Share via email
            </label>
          </div>

          {shareMethod === 'email' && (
            <div>
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          <button onClick={handleSend}>Send</button>
          <button onClick={() => setShowModal(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default ShareButton;