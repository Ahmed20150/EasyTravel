import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCurrency } from "../components/CurrencyContext";
import { useCookies } from "react-cookie";
import ViewGiftItemCard from "../components/ViewGiftItemCard";
// import "../css/ProductList.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import { fadeIn, buttonStyle ,promoCodeListStyle,cardStyle } from "../styles/HipaStyles"; // Import styles


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
    date: "",
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
    date: "",
    seller: "",
  });

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // Sorting by ratings (asc/desc)

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
    if (!formData.date) newErrors.date = "Date is required.";
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
      <h1 className="text-center text-2xl font-bold mb-4">Gift Items</h1>
      <ToastContainer />
      {userType === "tourist" && (
        <div className="relative">
          <Link to="/productOrders">
            <button className={`${buttonStyle} absolute top-4 right-4 px-4 py-2`}>
              View Your Orders
            </button>
          </Link>
        </div>
      )}
      <Link to="/home">
        <button className={`${buttonStyle} mt-4`}>Back</button>
      </Link>
  
      {/* Promo Code Section */}
      <div className={`${promoCodeListStyle} mt-6`}>
        <label className="block text-sm font-semibold">
          Promo Code:
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="border border-gray-300 rounded-md p-2 mt-1 w-full"
          />
        </label>
        <button
          type="button"
          onClick={handlePromoCodeCheck}
          className={`${buttonStyle} mt-2 px-4 py-2`}
        >
          Apply Promo Code
        </button>
      </div>
  
      {/* Search and Filter Section */}
      <div className="search-filter-sort mt-6 flex flex-col gap-4">
        <input
          type="text"
          placeholder="Search by product name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        />
  
        <div className="price-filter flex gap-4">
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          />
        </div>
  
        <select
          onChange={(e) => setSortOrder(e.target.value)}
          value={sortOrder}
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="asc">Sort by Rating (Low to High)</option>
          <option value="desc">Sort by Rating (High to Low)</option>
        </select>
      </div>
  
      {/* Gift Form (for Admin and Seller) */}
      {(userType === "admin" || userType === "seller") && (
        <div className={`${promoCodeListStyle} mt-6`}>
          <h2 className="text-xl font-bold mb-4">
            {editingId ? "Update Gift Item" : "Add New Gift Item"}
          </h2>
          <div className="flex flex-col gap-4">
            <label>
              Name
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border border-gray-300 rounded-md p-2"
              />
            </label>
            {errors.name && <p className="error-message">{errors.name}</p>}
  
            <label>
              Creator Name
              <input
                type="text"
                placeholder="Creator Name"
                value={userType === "seller" ? username : formData.seller}
                onChange={(e) =>
                  setFormData({ ...formData, seller: e.target.value })
                }
                disabled={userType === "seller" || editingId}
                className="border border-gray-300 rounded-md p-2"
              />
            </label>
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

          <label htmlFor="gift-date">Date</label>
          <input
            id="gift-date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          {errors.date && <p className="error-message">{errors.date}</p>}

            
            <button
              onClick={editingId ? handleUpdateGift : handleAddGift}
              className={`${buttonStyle} px-4 py-2`}
            >
              {editingId ? "Update Gift" : "Add Gift"}
            </button>
          </div>
        </div>
      )}
  
      {/* Display Gifts */}
      {loadingGifts ? (
        <div className={`${fadeIn} text-center mt-4`}>Loading Gifts/Products...</div>
      ) : filteredGifts.length > 0 ? (
        <div className="gift-items-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredGifts.map((gift) => (
            <div key={gift._id} className={cardStyle}>
              <ViewGiftItemCard
                giftItem={gift}
                userType={userType}
                convertPrice={convertPrice(applyPromoDiscount(gift.price))}
                selectedCurrency={selectedCurrency}
              />
              {(userType === "admin" || userType === "seller") && (
                <div className="admin-buttons mt-2">
                  <button
                    onClick={() => setEditingId(gift._id) || setFormData(gift)}
                    className={`${buttonStyle} mr-2 px-2 py-1`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteGift(gift._id)}
                    className={`${buttonStyle} px-2 py-1`}
                  >
                    Delete
                  </button>
                </div>
              )}
              {userType === "tourist" && (
                <div className="buttons mt-2">
                  <button
                    onClick={() => openModal(gift._id)}
                    className={`${buttonStyle} mr-2 px-2 py-1`}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => handleAddToWishlist(gift.name)}
                    className={`${buttonStyle} mr-2 px-2 py-1`}
                  >
                    Add to Wishlist
                  </button>
                  <button
                    onClick={() => handleAddToCart(gift.name)}
                    className={`${buttonStyle} px-2 py-1`}
                  >
                    Add to cart
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-4">No products found.</div>
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
