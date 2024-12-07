import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { toast, ToastContainer } from 'react-toastify';
import Modal from 'react-modal';

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
    <div>
      <h1>Product Orders</h1>
      <Link to="/productList"><button>Back</button> </Link>
      <ToastContainer/>

      <div>
        <label>
          <input
            type="radio"
            value="all"
            checked={filter === "all"}
            onChange={handleFilterChange}
          />
          All products
        </label>
        <label>
          <input
            type="radio"
            value="pending"
            checked={filter === "pending"}
            onChange={handleFilterChange}
          />
          Pending products (Current)
        </label>
        <label>
          <input
            type="radio"
            value="completed"
            checked={filter === "completed"}
            onChange={handleFilterChange}
          />
          Completed products (Past)
        </label>
      </div>
      <div>
      {filteredPurchases.length > 0 ? (
          filteredPurchases.map((purchase) => (
            <div key={purchase._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              <h3>{purchase.productName}</h3>
              <p><strong>Quantity:</strong> {purchase.quantity}</p>
              <p><strong>Total Price:</strong> ${purchase.totalPrice}</p>
              <p><strong>Purchase Date:</strong> {new Date(purchase.purchaseDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {purchase.status}</p>
              {purchase.status.toLowerCase() !== "completed" && (
                <button onClick={() => handleCancelPurchase(purchase.productId)}>Cancel Order</button>
              )}   
                {purchase.status.toLowerCase() === "completed" && (
                <button onClick={() => openModal(purchase.productId)}>Rate Product</button>
              )}        
            </div>
          ))
        ) : (
          <p>No purchases found.</p>
        )}
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Rate Product"
        style={{
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
            width: '50%',
            padding: '20px',
          },
        }}
      >
        <h2>Rate Product</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label>Rating:</label>
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              <option value={0}>Select Rating</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </div>
          <div>
            <label>Review:</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows="5"
              style={{ width: '100%' }}
            />
          </div>
          <button onClick={handleSubmitReview}>Submit Review</button>
          <button onClick={closeModal}>Close</button>
        </div>
      </Modal>
    </div>
  );
};

export default ProductOrders;