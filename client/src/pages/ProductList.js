import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCurrency } from "../components/CurrencyContext";
import { useCookies } from "react-cookie";
import ViewGiftItemCard from "../components/ViewGiftItemCard";
import "../css/ProductList.css";

const ProductList = () => {
  const [gifts, setGifts] = useState([]);
  const [loadingGifts, setLoadingGifts] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: "",
    price: 0,
    quantity: 0,
    date: "",
    seller: "",
  });
  const [editingId, setEditingId] = useState(null);

  const { selectedCurrency, convertPrice } = useCurrency();
  const [cookies] = useCookies(["userType", "username"]);
  const userType = cookies.userType;

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/gift");
        setGifts(response.data);
      } catch (error) {
        console.error("Error fetching gifts:", error);
      } finally {
        setLoadingGifts(false);
      }
    };
    fetchGifts();
  }, []);

  const handleAddGift = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/admin/addGiftItem",
        formData
      );
      setGifts([...gifts, response.data.newGiftItem]);
      setFormData({
        name: "",
        image: "",
        description: "",
        price: 0,
        quantity: 0,
        date: "",
        seller: "",
      });
    } catch (error) {
      console.error("Error adding gift:", error);
    }
  };

  const handleUpdateGift = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/admin/updateGiftItem/${editingId}`,
        formData
      );
      setGifts(
        gifts.map((gift) =>
          gift._id === editingId ? response.data.updatedGiftItem : gift
        )
      );
      setEditingId(null);
      setFormData({
        name: "",
        image: "",
        description: "",
        price: 0,
        quantity: 0,
        date: "",
        seller: "",
      });
    } catch (error) {
      console.error("Error updating gift:", error);
    }
  };

  const handleDeleteGift = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/admin/deleteGiftItem/${id}`);
      setGifts(gifts.filter((gift) => gift._id !== id));
    } catch (error) {
      console.error("Error deleting gift:", error);
    }
  };

  return (
    <div className="product-list-container">
      <h1>All Products</h1>
      <Link to="/home">
        <button className="back-button">Back</button>
      </Link>

      {userType === "admin" && (
        <div className="gift-form">
          <h2>{editingId ? "Update Gift Item" : "Add New Gift Item"}</h2>

          <label htmlFor="gift-name">Name</label>
          <input
            id="gift-name"
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <label htmlFor="gift-creator">Creator Name</label>
          <input
            id="gift-creator"
            type="text"
            placeholder="Creator Name"
            value={formData.seller}
            onChange={(e) =>
              setFormData({ ...formData, seller: e.target.value })
            }
          />

          <label htmlFor="image-upload">Image</label>
          <input
            id="image-upload"
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setFormData({ ...formData, image: reader.result });
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          {formData.image && (
            <img
              src={formData.image}
              alt="Uploaded Preview"
              className="uploaded-image-preview"
            />
          )}

          <label htmlFor="gift-description">Description</label>
          <input
            id="gift-description"
            type="text"
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <label htmlFor="gift-price">Price</label>
          <input
            id="gift-price"
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: Number(e.target.value) })
            }
          />

          <label htmlFor="gift-quantity">Quantity</label>
          <input
            id="gift-quantity"
            type="number"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: Number(e.target.value) })
            }
          />

          <label htmlFor="gift-date">Date</label>
          <input
            id="gift-date"
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
          />

          <button onClick={editingId ? handleUpdateGift : handleAddGift}>
            {editingId ? "Update Gift" : "Add Gift"}
          </button>
        </div>
      )}

      {loadingGifts ? (
        <div className="loader">Loading Gifts/Products...</div>
      ) : gifts.length > 0 ? (
        <div className="gift-items-grid">
          {gifts.map((gift) => (
            <div key={gift._id} className="gift-item-card">
              <ViewGiftItemCard
                giftItem={gift}
                userType={userType}
                convertPrice={convertPrice}
                selectedCurrency={selectedCurrency}
              />
              {userType === "admin" && (
                <div className="admin-buttons">
                  <button
                    onClick={() =>
                      setEditingId(gift._id) || setFormData(gift)
                    }
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDeleteGift(gift._id)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">No gifts/products available</div>
      )}
    </div>
  );
};

export default ProductList;
