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
    price: "",
    quantity: "",
    date: "",
    seller: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Error State
  const [errors, setErrors] = useState({
    name: "",
    image: "",
    description: "",
    price: "",
    quantity: "",
    date: "",
    seller: "",
  });

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // Sorting by ratings (asc/desc)

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

  // Validate Form Data
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.image) newErrors.image = "Image is required.";
    if (!formData.description) newErrors.description = "Description is required.";
    if (!formData.price) newErrors.price = "Price is required.";
    if (!formData.quantity) newErrors.quantity = "Quantity is required.";
    if (!formData.date) newErrors.date = "Date is required.";
    if (userType === "admin" && !formData.seller) newErrors.seller = "Seller name is required for admins.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle Add Gift
  const handleAddGift = async () => {
    if (!validateForm()) return; // Do not submit if validation fails

    try {
      const response = await axios.post("http://localhost:3000/admin/addGiftItem", formData);
      setGifts([...gifts, response.data.newGiftItem]);
      setFormData({
        name: "",
        image: "",
        description: "",
        price: "",
        quantity: "",
        date: "",
        seller: "",
      });
    } catch (error) {
      console.error("Error adding gift:", error);
    }
  };

  // Handle Update Gift
  const handleUpdateGift = async () => {
    if (!validateForm()) return; // Do not submit if validation fails

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
        price: "",
        quantity: "",
        date: "",
        seller: "",
      });
    } catch (error) {
      console.error("Error updating gift:", error);
    }
  };

  // Handle Delete Gift
  const handleDeleteGift = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/admin/deleteGiftItem/${id}`);
      setGifts(gifts.filter((gift) => gift._id !== id));
    } catch (error) {
      console.error("Error deleting gift:", error);
    }
  };

  // Filter and Sort Gifts
  const filteredGifts = gifts
    .filter((gift) => {
      return gift.name.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .filter((gift) => {
      return (
        (minPrice ? gift.price >= minPrice : true) &&
        (maxPrice ? gift.price <= maxPrice : true)
      );
    })
    .sort((a, b) => {
      const getAverageRating = (gift) => {
        if (gift.reviews && gift.reviews.length > 0) {
          const totalRating = gift.reviews.reduce((acc, review) => acc + review.rating, 0);
          return totalRating / gift.reviews.length;
        }
        return 0;
      };

      const avgRatingA = getAverageRating(a);
      const avgRatingB = getAverageRating(b);

      if (sortOrder === "asc") {
        return avgRatingA - avgRatingB;
      } else {
        return avgRatingB - avgRatingA;
      }
    });

  return (
    <div className="product-list-container">
      <h1>All Products</h1>
      <Link to="/home">
        <button className="back-button">Back</button>
      </Link>

      {/* Search and Filter Section */}
      <div className="search-filter-sort">
        <input
          type="text"
          placeholder="Search by product name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="price-filter">
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        <div className="rating-sort">
          <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
            <option value="asc">Sort by Rating (Low to High)</option>
            <option value="desc">Sort by Rating (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Gift Form (for Admin) */}
      {(userType === "admin" || userType === "seller") && (
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
          {errors.name && <p className="error-message">{errors.name}</p>}

          <label htmlFor="gift-creator">Creator Name</label>
          <input
            id="gift-creator"
            type="text"
            placeholder="Creator Name"
            value={formData.seller}
            onChange={(e) => setFormData({ ...formData, seller: e.target.value })}
          />
          {errors.seller && <p className="error-message">{errors.seller}</p>}

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
          {errors.image && <p className="error-message">{errors.image}</p>}

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
          {errors.description && <p className="error-message">{errors.description}</p>}

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
          {errors.price && <p className="error-message">{errors.price}</p>}

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
          {errors.quantity && <p className="error-message">{errors.quantity}</p>}

          <label htmlFor="gift-date">Date</label>
          <input
            id="gift-date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          {errors.date && <p className="error-message">{errors.date}</p>}

          <button onClick={editingId ? handleUpdateGift : handleAddGift}>
            {editingId ? "Update Gift" : "Add Gift"}
          </button>
        </div>
      )}

      {/* Display Gifts */}
      {loadingGifts ? (
        <div className="loader">Loading Gifts/Products...</div>
      ) : filteredGifts.length > 0 ? (
        <div className="gift-items-grid">
          {filteredGifts.map((gift) => (
            <div key={gift._id} className="gift-item-card">
              <ViewGiftItemCard
                giftItem={gift}
                userType={userType}
                convertPrice={convertPrice}
                selectedCurrency={selectedCurrency}
              />
              {(userType === "admin" || userType === "seller") && (
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
        <div>No products found.</div>
      )}
    </div>
  );
};

export default ProductList;
