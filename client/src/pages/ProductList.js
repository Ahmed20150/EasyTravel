import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useCurrency } from "../components/CurrencyContext";
import { useCookies } from "react-cookie";
import ViewGiftItemCard from "../components/ViewGiftItemCard";
// import "../css/ProductList.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";


const ProductList = () => {
  const [gifts, setGifts] = useState([]);
  const [loadingGifts, setLoadingGifts] = useState(true);
  
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedGiftId, setSelectedGiftId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: "",
    price: "",
    quantity: "",
    seller: "",
  });

  const openModal = async (id) => {
    setSelectedGiftId(id);
    setModalIsOpen(true);
  };


const closeModal = () => {
setModalIsOpen(false);
setSelectedGiftId(null);
// setAvailableDates([]);
// setSelectedDate(null);
// setSelectedTime(null);
};


const handleWalletPurchase = async () => {
  try {
    let gift;

    try {
      gift = await axios.get(
        `http://localhost:3000/gift/${selectedGiftId}`
      );
    } catch (error) {
      console.error("Gift not found, searching for activity...", error);
    }


    const today = new Date();
    const productName = gift.data.name;
    const purchaseDate = today;
    const quantity = 1;
    const totalPrice = gift.data.price * quantity;

    await axios.patch("http://localhost:3000/api/wallet/purchaseProduct", {
      username,
      totalPrice
    })


      const response = await axios.post("http://localhost:3000/purchase/createPurchase", {
          touristUsername: username,
          productId: selectedGiftId,
          productName,
          purchaseDate,
          quantity,
          totalPrice,
          });


  toast.success("Product Purchased Successfully!");

  closeModal();
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      "Error Purchasing Product. Please try again.";
    toast.error(errorMessage);
  }
};


const handleCreditCardPurchase = async () => {
  let gift;


  try {
   gift = await axios.get(
     `http://localhost:3000/gift/${selectedGiftId}`
   );
 } catch (error) {
   console.error("Gift not found, searching for activity...", error);
 }

   const today = new Date();
   const productName = gift.data.name;
   const purchaseDate = today;
   const quantity = 1;
   const totalPrice = gift.data.price * quantity;

   try {
       const response = await axios.post(
         "http://localhost:3000/payment/product/create-checkout-session",
         {
           productId: selectedGiftId,
           productName: gift.data.name,
           price: totalPrice,
         },
       //   {
       //     headers: { Authorization: `Bearer ${cookies.token}` },
       //   }
       );
       console.log("RESPONSE : ", response);
       window.location.href = response.data.url;
     } catch (error) {
       console.error("Error during credit card purchase:", error);
       toast.error(
         "An error occurred during the credit card purchase. Please try again."
       );
     }





 closeModal();
  
 };


  const [editingId, setEditingId] = useState(null);

  // Error State
  const [errors, setErrors] = useState({
    name: "",
    image: "",
    description: "",
    price: "",
    quantity: "",
    seller: "",
  });

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const { selectedCurrency, exchangeRates } = useCurrency();
  const [cookies] = useCookies(["userType", "username"]);
  const userType = cookies.userType;
  const username = cookies.username;

  const [promoCodes, setPromoCodes] = useState([]); // Store promo codes
  const [promoCode, setPromoCode] = useState(''); // Store the entered promo code
  const [promoDiscount, setPromoDiscount] = useState(0); // Store the promo discount

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

  useEffect(() => {
    if (userType === "seller") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        seller: username,
      }));
    }
  }, [userType, username]);

  useEffect(() => {
    const fetchGiftsAndPromoCodes = async () => {
        try {
            // Fetch gifts
            const giftsResponse = await axios.get('http://localhost:3000/gift');
            setGifts(giftsResponse.data);

            // Fetch promo codes
            const promoResponse = await axios.get('http://localhost:3000/api/promo-codes');
            setPromoCodes(promoResponse.data || []);
        } catch (error) {
            console.error('Error fetching gifts or promo codes:', error);
        }
    };
    fetchGiftsAndPromoCodes();
}, []);

const handlePromoCodeCheck = () => {
  const promo = promoCodes.find((code) => code.promoCode === promoCode);

  if (promo && new Date(promo.expiryDate) > new Date()) {
      setPromoDiscount(promo.discount); // Apply discount
      alert(`Promo code applied! You get ${promo.discount}% off.`);
  } else {
      setPromoDiscount(0); // No discount if invalid or expired
      alert('Invalid or expired promo code.');
  }
};

    // Function to apply promo code discount to price
    const applyPromoDiscount = (price) => {
      if (promoDiscount) {
          return (price - (price * promoDiscount) / 100).toFixed(2); // Apply discount
      }
      return price.toFixed(2); // Return original price if no discount
  };

  // Validate Form Data
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.image) newErrors.image = "Image is required.";
    if (!formData.description)
      newErrors.description = "Description is required.";
    if (!formData.price) newErrors.price = "Price is required.";
    if (!formData.quantity) newErrors.quantity = "Quantity is required.";
    if (userType === "admin" && !formData.seller)
      newErrors.seller = "Seller name is required for admins.";
    if (userType === "admin" && !formData.seller)
      newErrors.seller = "Seller name is required for admins.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle Add Gift
  const handleAddGift = async () => {
    if (!validateForm()) return; // Do not submit if validation fails

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
        price: "",
        quantity: "",
        seller: "",
      });

      toast.success("Gift added successfully!"); // Show success toast
    } catch (error) {
      console.error("Error adding gift:", error);
    }
  };

  // Handle Update Gift
  const handleUpdateGift = async () => {
    if (!validateForm()) return; // Do not submit if validation fails
    if (userType==="seller" && formData.seller!==username){
      alert("you do not have access to edit this product");
      return;
    }
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
        seller: "",
      });

      toast.success("Gift updated successfully!"); // Show success toast
    } catch (error) {
      console.error("Error updating gift:", error);
    }
  };

  // Handle Delete Gift
  const handleDeleteGift = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/admin/deleteGiftItem/${id}`);
      setGifts(gifts.filter((gift) => gift._id !== id));

      toast.success("Gift deleted successfully!"); // Show success toast
    } catch (error) {
      console.error("Error deleting gift:", error);
    }
  };

  // Handle Purchase
  const handlePurchase = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/gift/purchase/${id}`
      );
      console.log(response.data.message);

      // Update the local state to increment the purchase count for the specific gift
      setGifts((prevGifts) =>
        prevGifts.map((gift) =>
          gift._id === id
            ? { ...gift, purchases: Number(gift.purchases) + 1 }
            : gift
        )
      );
    } catch (error) {
      console.error("Error purchasing gift:", error);
    }
  };

  // Handle Add to Wishlist
  const handleAddToWishlist = async (giftName) => {
    if (!username) {
      alert("user not found");
      console.log("No username found in cookies");
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:3000/api/tourist/${username}/addToWishlist`,
        { giftName }
      );
      alert("Added " + giftName + " to your wishlist");
      console.log(response.data.message);

      // Optionally, you can update the UI or inform the user that the gift was added to the wishlist
    } catch (error) {
      console.error("Error adding gift to wishlist:", error);
    }
  };

  // Handle Add to Cart
  const handleAddToCart = async (giftName) => {
    if (!username) {
      alert("user not found");
      console.log("No username found in cookies");
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:3000/api/tourist/${username}/addToCart`,
        { giftName }
      );
      alert("Added " + giftName + " to your Cart");
      console.log(response.data.message);

      // Optionally, you can update the UI or inform the user that the gift was added to the cart
    } catch (error) {
      console.error("Error adding gift to Cart:", error);
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
          const totalRating = gift.reviews.reduce(
            (acc, review) => acc + review.rating,
            0
          );
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

  // Function to convert price to selected currency
  const convertPrice = (price) => {
    if (exchangeRates[selectedCurrency]) {
      return (price * exchangeRates[selectedCurrency]).toFixed(2); // Convert price based on exchange rate
    }
    return price.toFixed(2); // Return original price if no exchange rate found
  };

  return (
    <div className="product-list-container">
      <ToastContainer/>
      <h1>Gift Items</h1>
      <ToastContainer/>
      {userType === "tourist" && (
        <>
      <Link to="/productOrders">
        <button style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          padding: "10px 20px",
        }}>
          View Your Orders
        </button>
        </Link></>)}
      <Link to="/home">
        <button className="back-button">Back</button>
      </Link>

         {/* Promo Code Section */}
         <div>
                <label>
                    Promo Code:
                    <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                    />
                </label>
                <button type="button" onClick={handlePromoCodeCheck}>
                    Apply Promo Code
                </button>
            </div>

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
          <select
            onChange={(e) => setSortOrder(e.target.value)}
            value={sortOrder}
          >
            <option value="asc">Sort by Rating (Low to High)</option>
            <option value="desc">Sort by Rating (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Gift Form (for Admin and Seller) */}
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
            value={userType === "seller" ? username : formData.seller}
            onChange={(e) =>
              setFormData({ ...formData, seller: e.target.value })
            }
            disabled={userType === "seller" || editingId} // Disable input for sellers
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
                  setFormData((prevData) => ({
                    ...prevData,
                    image: reader.result,
                  }));
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
          {errors.description && (
            <p className="error-message">{errors.description}</p>
          )}

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
          {errors.quantity && (
            <p className="error-message">{errors.quantity}</p>
          )}

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
                convertPrice={convertPrice(applyPromoDiscount(gift.price))}
                selectedCurrency={selectedCurrency}
              />
              {(userType === "admin" || userType === "seller") && (
                <div className="admin-buttons">
                  <button
                    onClick={() => setEditingId(gift._id) || setFormData(gift)}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDeleteGift(gift._id)}>
                    Delete
                  </button>
                </div>
              )}
              {userType === "tourist" && (
                <div className="buttons">
                  <button onClick={() => openModal(gift._id)}>Buy</button>
                  <button onClick={() => handleAddToWishlist(gift.name)}>
                    Add to Wishlist
                  </button>
                  <button onClick={() => handleAddToCart(gift.name)}>
                    Add to cart
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div>No products found.</div>
      )}

<Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "60%", // Increase width
            height: "80%", // Increase height
            padding: "40px", // Increase padding
          },
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <h2>Payment Method</h2>
          <h3 style={{ marginBottom: "40px" }}>
            Please Choose your Payment Method
          </h3>
          <div style={{ display: "flex" }}>
            
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "30px",
            }}
          >
            <button onClick={handleWalletPurchase}>by Wallet</button>
            <button onClick={handleCreditCardPurchase}>by Credit Card</button>
          </div>
          <button style={{ marginTop: "50px" }} onClick={closeModal}>
            Close
          </button>
        </div>
      </Modal>
    </div>

    
  );
};

export default ProductList;


