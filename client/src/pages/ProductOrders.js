import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { toast, ToastContainer } from 'react-toastify';
import Modal from 'react-modal';
import 'react-toastify/dist/ReactToastify.css';

const ProductOrders = () => {
  const [cookies] = useCookies(["username"]);
  const username = cookies.username;
  const [purchases, setPurchases] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [currentProductId, setCurrentProductId] = useState(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/purchase/user/${username}`);
        setPurchases(response.data);
      } catch (error) {
        console.error("Error fetching purchases:", error);
      }
    };

    if (username) {
      fetchPurchases();
    }
  }, [username]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredPurchases = purchases.filter((purchase) => {
    if (filter === "all") return true;
    return purchase.status.toLowerCase() === filter;
  });

  const handleCancelPurchase = async (productId) => {
    try {
      await axios.delete(`http://localhost:3000/purchase/deletePurchase/${productId}/${username}`);
      toast.success("Purchase cancelled successfully, Amount has been refunded in your wallet!");
      const response = await axios.get(`http://localhost:3000/purchase/user/${username}`);
      setPurchases(response.data);
    } catch (error) {
      console.error("Error cancelling purchase:", error);
      toast.error("Error cancelling purchase");
    }
  };

  const openModal = (productId) => {
    setCurrentProductId(productId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setRating(0);
    setReview("");
  };

  const handleSubmitReview = async () => {
    try {
      await axios.post(`http://localhost:3000/gift/${currentProductId}/review`, {
        username,
        rating,
        review,
      });
      toast.success("Review submitted successfully");
      closeModal();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Error submitting review");
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Product Orders</h1>

      <Link to="/productList">
        <button
          style={styles.backButton}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#000'}
        >
          Back
        </button>
      </Link>
      
      <ToastContainer />

      <div style={styles.filterContainer}>
        <label style={styles.dropdownLabel}>
          <select
            style={styles.dropdown}
            value={filter}
            onChange={handleFilterChange}
          >
            <option value="all">All products</option>
            <option value="pending">Pending products (Current)</option>
            <option value="completed">Completed products (Past)</option>
          </select>
        </label>
      </div>

      <div style={{ marginTop: '20px' }}>
        {filteredPurchases.length > 0 ? (
          filteredPurchases.map((purchase) => (
            <div key={purchase._id} style={styles.card}>
              <h3 style={styles.cardTitle}>{purchase.productName}</h3>
              <p><strong>Quantity:</strong> {purchase.quantity}</p>
              <p><strong>Total Price:</strong> ${purchase.totalPrice}</p>
              <p><strong>Purchase Date:</strong> {new Date(purchase.purchaseDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {purchase.status}</p>
              {purchase.status.toLowerCase() !== "completed" && (
                <button style={styles.actionButton} onClick={() => handleCancelPurchase(purchase.productId)}>Cancel Order</button>
              )}
              {purchase.status.toLowerCase() === "completed" && (
                <button style={styles.actionButton} onClick={() => openModal(purchase.productId)}>Rate Product</button>
              )}
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#777' }}>No purchases found.</p>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Rate Product"
        style={styles.modalStyle}
      >
        <h2 style={{ textAlign: 'center', color: '#333' }}>Rate Product</h2>
        <div style={styles.modalContent}>
          <div style={styles.formGroup}>
            <label>Rating:</label>
            <select style={styles.select} value={rating} onChange={(e) => setRating(e.target.value)}>
              <option value={0}>Select Rating</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label>Review:</label>
            <textarea
              style={styles.textarea}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows="5"
            />
          </div>
          <button style={styles.submitButton} onClick={handleSubmitReview}>Submit Review</button>
          <button style={styles.closeButton} onClick={closeModal}>Close</button>
        </div>
      </Modal>
    </div>
  );
};

const styles = {
  backButton: {
    backgroundColor: '#000',
    color: 'white',
    border: 'none',
    padding: '12px 25px', // Increased padding for better text fitting
    borderRadius: '8px',  // Rounded edges for a more modern look
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
    position: 'absolute',
    top: '20px',
    right: '20px',
    display: 'inline-flex', // Ensures the button size adapts well to content
    alignItems: 'center',  // Vertically centers the content
    justifyContent: 'center',  // Horizontally centers the content
  },
  filterContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  dropdownLabel: {
    fontSize: '12px',
    color: '#555',
  },
  dropdown: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px', // Adjust font size for readability
    width: '230px', // Increased width to avoid text clipping by the arrow
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  cardTitle: {
    marginBottom: '10px',
    color: '#333',
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '10px 12px', // Increased padding for better text fitting
    borderRadius: '8px',  // Rounded edges for a more modern look
    cursor: 'pointer',
    marginRight: '11px',
  },
  modalStyle: {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '400px',
      padding: '20px',
      borderRadius: '8px',
    },
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  select: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  textarea: {
    padding: '6px',
    borderRadius: '2px',
    border: '1px solid #ccc',
    width: '90%',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  closeButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default ProductOrders;
