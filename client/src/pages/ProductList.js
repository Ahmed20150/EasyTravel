import React, { useEffect, useState } from "react";
import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
import { useCurrency } from "../components/CurrencyContext";
import { useCookies } from "react-cookie";
import ViewGiftItemCard from "../components/ViewGiftItemCard";
// import "../css/ProductList.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";

import * as styles from "../styles/HossStyles.js"; // Importing styles from HossStyles.js
import { buttonStyle } from "../styles/GeneralStyles.js"; // Importing buttonStyle from GeneralStyles.js


import { Link } from "react-router-dom";



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
            const promoResponse = await axios.get('http://localhost:3000/promo-codes');
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
    toast.success(`Promo code applied! You get ${promo.discount}% off.`); // Success toast
  } else {
    setPromoDiscount(0); // Reset discount if invalid or expired
    toast.error('Invalid or expired promo code.'); // Error toast
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
      toast.error("User not found", { autoClose: 2000 });
      console.log("No username found in cookies");
      return;
    }
  

    try {
      const response = await axios.patch(
        `http://localhost:3000/api/tourist/${username}/addToWishlist`,
        { giftName }
      );
        setTimeout(() => {
          toast.success(`Added "${giftName}" to your wishlist!`, { autoClose: 2000 });
        }, 1000);

      // Optionally, you can update the UI or inform the user that the gift was added to the wishlist
    } catch (error) {
      console.error("Error adding gift to wishlist:", error);
    }
  };

  // Handle Add to Cart
  const handleAddToCart = async (giftName) => {
    if (!username) {
      toast.error("User not found", { autoClose: 2000 });
      console.log("No username found in cookies");
      return;
    }
  
    try {
      await axios.patch(
        `http://localhost:3000/api/tourist/${username}/addToCart`,
        { giftName }
      );
      setTimeout(() => {
        toast.success(`Added "${giftName}" to your cart!`, { autoClose: 2000 });
      }, 1000);
    } catch (error) {
      console.error("Error adding gift to cart:", error);
      toast.error("Failed to add gift to cart.", { autoClose: 2000 });
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
    <div className={styles.pageContainer}>
      <ToastContainer />
      <h1 className={styles.header}>Gift Items</h1>
      {userType === "tourist" && (
        <Link to="/productOrders">
          <button className={styles.promoCodeButton} style={{ position: "absolute", top: "10px", right: "10px", padding: "10px 20px" }}>
            View Your Orders
          </button>
        </Link>
      )}

      {/* Back button with buttonStyle applied */}
        <Link to="/home">
          <button
            className={buttonStyle}
            style={{
              fontSize: '18px',         // Increase font size
              padding: '12px 24px',     // Increase padding for larger button
              borderRadius: '8px',      // Optional: smooth corners
              fontWeight: 'bold',       // Optional: make text bold
            }}
          >
            Back
          </button>
        </Link>


      {/* Promo Code Section */}
      {/* <div className={styles.promoCodeContainer}>
        <label>
          Promo Code:
          <input
            type="text"
            className={styles.promoCodeInput}
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
        </label>
        <button className={styles.promoCodeButton} onClick={handlePromoCodeCheck}>
          Apply Promo Code
        </button>
      </div> */}

      {/* Search and Filter Section */}
      <div className={styles.searchFilterSortContainer}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search by product name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className={styles.priceFilterContainer}>
          <input
            type="number"
            className={styles.priceInput}
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            className={styles.priceInput}
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
        <div className={styles.sortSelect}>
          <select
            onChange={(e) => setSortOrder(e.target.value)}
            value={sortOrder}
          >
            <option value="asc">Sort by Rating (Low to High)</option>
            <option value="desc">Sort by Rating (High to Low)</option>
          </select>
        </div>
      </div>

      {(userType === "admin" || userType === "seller") && (
  <div style={{ marginBottom: "20px" }}>
    <Link to="/create-gift">
      <button className={styles.giftFormButton}>
        Create Gift
      </button>
    </Link>
  </div>
)}



          {/* Display Gifts */}
          {loadingGifts ? (
            <div className={styles.loaderText}>Loading Gifts/Products...</div>
          ) : filteredGifts.length > 0 ? (
            <div className={styles.giftItemGrid}>
              {filteredGifts.map((gift) => (
                <div key={gift._id} className={styles.giftItemCard}>
                  
                  <ViewGiftItemCard
                    giftItem={gift}
                    userType={userType}
                    convertPrice={convertPrice(applyPromoDiscount(gift.price))}
                    selectedCurrency={selectedCurrency}
                  />
               {userType === 'admin' || userType === 'seller' ? (
  <div className={styles.adminButtons}>
    <Link to={`/edit-gift/${gift._id}`}>
      <button
        className={buttonStyle}
        style={{
          fontSize: '16px',
          padding: '10px 20px',
          margin: '5px',
          backgroundColor: '#000000', //  for better visibility
          color: 'white',
          borderRadius: '8px', // Smooth corners
        }}
      >
        Edit
      </button>
    </Link>
    <button
      className={buttonStyle}
      style={{
        fontSize: '16px',
        padding: '10px 20px',
        margin: '5px',
        backgroundColor: '#000000', //   for better visibility
        color: 'white',
        borderRadius: '8px', // Smooth corners
      }}
      onClick={() => handleDeleteGift(gift._id)}
    >
      Delete
    </button>
  </div>

  
) : null}


              {userType === "tourist" && (
                <div className={styles.productButtons}>
                  <button className={buttonStyle} onClick={() => openModal(gift._id)}>Buy</button>
                  <button className={buttonStyle} onClick={() => handleAddToWishlist(gift.name)}>Add to Wishlist</button>
                  <button className={buttonStyle} onClick={() => handleAddToCart(gift.name)}>Add to Cart</button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div>No products found.</div>
      )}

      {/* Modal for payment */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Payment Method"
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.75)" },
          content: { width: "60%", height: "80%", margin: "auto", padding: "40px" },
        }}
      >
        <div className={styles.modalContainer}>
          <h2 className={styles.modalHeader}>Payment Method</h2>
          <button className={styles.modalButton} onClick={handleWalletPurchase}>by Wallet</button>
          <button className={styles.modalButton} onClick={handleCreditCardPurchase}>by Credit Card</button>
          <button className={styles.modalButton} onClick={closeModal}>Close</button>
        </div>
      </Modal>
    </div>
  );
};

export default ProductList;   


//last working ciode ...  for edit .. .. .. .. .. .. . . 