// import './Cart.css'; 
import React, { useEffect, useState,useMemo } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useCurrency } from '../components/CurrencyContext'; 
import { useNavigate } from 'react-router-dom';
import { Card , Button, Modal} from "flowbite-react";
import { buttonStyle, cardStyle, linkStyle, centerVertically, fadeIn,stepStyle, stepIconStyle, stepTitleStyle, stepDescriptionStyle , centerContent} from "../styles/gasserStyles"; 
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from 'react-router-dom';


function Cart() {
    const [cookies] = useCookies(["username"]);
    const username = cookies.username;
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { selectedCurrency, exchangeRates } = useCurrency();
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [selectedGiftId, setSelectedGiftId] = useState(null);
    const [enteredPromoCode, setEnteredPromoCode] = useState("");
    const [promoCodeDiscount, setPromoCodeDiscount] = useState(0);
    const [discountFlag, setDiscountFlag] = useState(false);
    const [totalPriceDisplay, setTotalPriceDisplay] = useState(0);


    // Fetch cart data from API
    useEffect(() => {
        const fetchCart = async () => {
            try {
                if (!username) {
                    throw new Error("Username not available in cookies.");
                }
                const response = await axios.get(
                    `http://localhost:3000/api/tourist/${username}/cart`
                );

                const cart = response.data.cart;
                if (Array.isArray(cart) && cart.length > 0) {
                    console.log(cart[0]);
                    setSelectedGiftId(cart[0].giftItem._id);         
                    setCartItems(cart);
                } else {
                    setCartItems([]);
                }
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching cart:", error);
                setIsLoading(false);
            }
        };

        fetchCart();
    }, [username]);
    

    useEffect(() => {
      if (username) {
        axios
          .get(`http://localhost:3000/api/tourists/${username}/addresses`)
          .then((response) => setAddresses(response.data))
          .catch(() => toast.info("Failed to fetch addresses"));
      } else {
        toast.info("User not logged in");
      }
    }, [username]);

    // Convert price to selected currency
    const convertPrice = (price) => {
        if (!price || isNaN(price)) {
            return "Invalid price"; // Handle invalid price
        }
        if (exchangeRates && selectedCurrency && exchangeRates[selectedCurrency]) {
            return (price * exchangeRates[selectedCurrency]).toFixed(2);
        }
        return price.toFixed(2);
    };

const calculateTotalPrice = (promoCode) => {
    if (!cartItems || cartItems.length === 0) return 0;
    if(!promoCode===0) {
      return cartItems.reduce((total, item) => {
        const itemPrice = convertPrice(item.giftItem.price); // Convert price based on selected currency
        return (total + itemPrice * item.quantity) * (1-promoCode);
      }, 0);
    }
  
    return cartItems.reduce((total, item) => {
      const itemPrice = convertPrice(item.giftItem.price); // Convert price based on selected currency
      return total + itemPrice * item.quantity;
    }, 0);
  };

    // Handle item removal
    const removeItem = async (itemId) => {
        try {
            console.log("Removing item with ID:", itemId);  // Add logging to verify item ID

            const response = await axios.patch(
                `http://localhost:3000/api/tourist/${username}/removeFromCart`,
                { giftName: itemId }
            );

            console.log("Delete response:", response.data);  // Log the response status to debug

            if (response.status === 200) {
                // Remove the item from the cart state
                setCartItems(response.data.cart);
            }
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    };

    // Handle item quantity update
    const updateItemQuantity = async (itemId, newQuantity) => {
        try {
            const response = await axios.patch(
                `http://localhost:3000/api/tourist/${username}/updateItemQuantity`,
                { giftName: itemId, newQuantity }
            );

            console.log("Update quantity response:", response.data);

            if (response.status === 200) {
                // Update the cart state with the new quantity
                setCartItems(response.data.cart);
            }
        } catch (error) {
            console.error("Error updating item quantity:", error);
        }
    };

    // Handle back navigation
    const handleBack = () => {
        navigate('/home');
    };
 //TODO Fix price conversion & display  

    // Handle checkout
    const handleCheckout = () => {
        navigate('/address');
    };

    let totalPrice = useMemo(() => calculateTotalPrice(promoCodeDiscount), [cartItems, exchangeRates, selectedCurrency]); 


    const handleSelectAddress = (addressId) => {
      setSelectedAddressId(addressId);
      console.log(addressId)
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
        
        if(selectedAddressId === null){
          toast.error("Please Select your address before proceeding")
          return;  
        }
  
    
        const today = new Date();
        const productName = gift.data.name;
        const purchaseDate = today;
        const quantity = cartItems.length; 
        const totalPrice = discountFlag ? totalPriceDisplay : calculateTotalPrice();

        console.log("PRICE: ", totalPrice)

        await axios.patch("http://localhost:3000/api/wallet/purchaseProduct", {
          username,
          totalPrice
        })

  if(cartItems.length>0 && cartItems.length<=1){
          const response = await axios.post("http://localhost:3000/purchase/createPurchase", {
              touristUsername: username,
              productId: selectedGiftId,
              productName,
              purchaseDate,
              quantity,
              totalPrice,
              });
  }
  else if(cartItems.length>1){
    const response = await axios.post("http://localhost:3000/purchase/cart/createPurchase", {
      touristUsername: username,
      productId: selectedGiftId,
      productIds: cartItems,
      productName,
      purchaseDate,
      quantity,
      totalPrice,
      });
  }
  
    await axios.post(`http://localhost:3000/gift/purchase/${gift.data._id}`);

      toast.success("Product Purchased Successfully!");
    
      setOpenModal(false);

      await axios.delete(`http://localhost:3000/api/${username}/deleteCart`);
      
      setTimeout(() => {
        navigate("/payment-success");
      }, 3000); 
    
    
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


    if(selectedAddressId === null){
      toast.error("Please Select your address before proceeding")
      return;  
    }
      const today = new Date();
      const productName = gift.data.name;
      const purchaseDate = today;
      const quantity = cartItems.length; //TODO make quantity required
      const totalPrice = calculateTotalPrice();

      try {
          const response = await axios.post(
            "http://localhost:3000/payment/product/create-checkout-session",
            {
              products: cartItems,
              totalPriceDisplay,
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


    setOpenModal(false);
     
    };

    // const fetchPromoCodes = async () => {
    //   try {
    //     const response = await axios.get("http://localhost:3000/promo-codes");
    //     setPromoCodes(response.data || []);
    //   } catch (err) {
    //     console.error("Error fetching promo codes", err);
    //   }
    // };

    const applyPromoCode = async (promoCode) => {
    
      const response = await axios.get("http://localhost:3000/promo-codes");
      console.log(response.data)
      const promo = response.data.find((promo) => promo.promoCode === promoCode);
      if (promo) {
        const currentDate = new Date();
        const expiryDate = new Date(promo.expiryDate);
  
        if (currentDate <= expiryDate) {
          setPromoCodeDiscount( promo.discount / 100);
          calculateTotalPrice(promoCodeDiscount);
          setTotalPriceDisplay(totalPrice * (1-promo.discount / 100));
          
          toast.success(`Promo code applied! You saved ${promo.discount}%`);
          setDiscountFlag(true);
        } else {
          toast.error("Promo code has expired.");
          setPromoCodeDiscount(0);
          setDiscountFlag(false);
        }
      } else {
        toast.error("Invalid promo code.");
      }
    
    
    
    } 
  
    return (
        <div className="flex flex-col cart-container">
           <div className="flex flex-col items-center text-3xl font-bold mb-8 mt-10">
      <h1  className="text-4xl font-bold ">My Cart</h1>
      <div className="absolute top-4 left-4">
        <Button
          onClick={() => navigate("/home")}
          className={buttonStyle}
        >
          Back
        </Button>
        </div>
      </div>

            {isLoading ? (
                <p>Loading...</p>
            ) : cartItems.length > 0 ? (
     <div className="flex flex-wrap justify-center gap-6">
          {cartItems.map((item, index) => (
            <Card
              key={index}
              className="w-80" // Fixed width for smaller cards
              imgAlt={item.giftItem.name}
              imgSrc={item.giftItem.image}
            >
              <div>
                <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  {item.giftItem.name}
                </h5>
              </div>
              <div className="mb-5 mt-2.5 flex items-center">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {item.giftItem.price} {selectedCurrency}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-lg">Qty: x{item.quantity}</p>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={() => updateItemQuantity(item.giftItem.name, item.quantity + 1)}
                    className={buttonStyle}
                  >
                    +
                  </Button>

                  <Button
                    onClick={() => updateItemQuantity(item.giftItem.name, item.quantity - 1)}
                    className={buttonStyle}
                  >
                    -
                  </Button>
                  
                  <Button
                    onClick={() => removeItem(item.giftItem.name)}
                    className={buttonStyle}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </Card>
          ))}
  
        </div>
                
            ) : (
              <div className="flex flex-col items-center text-3xl font-bold mb-8 mt-10">

              <h1  className="text-4xl font-bold ">Oops! Your Cart is Empty</h1>
              <h1  className="text-2xl font-bold ">Visit our Shop and fill your cart with souveniers from all around the world!!</h1>


              <div className="flex justify-center mt-4 mb-7">
                <Button className={buttonStyle} onClick={() => navigate("/productList")}>
                    Go to Shop
                </Button>

            </div>
              </div>

            )}



{cartItems.length > 0 ? (
    <>
        {/* Total Price Section */}
        <div className="flex flex-col items-center text-3xl font-bold mb-8 mt-10">
            <h1 className="text-4xl font-bold">
                Total Price: {discountFlag
                    ? `${selectedCurrency}${totalPriceDisplay.toFixed(2)}`
                    : `${selectedCurrency}${totalPrice.toFixed(2)}`}
            </h1>
        </div>

        {/* Promo Code Section */}
        <div className="flex justify-center mt-4 mb-7">
            <input
                type="text"
                placeholder="Enter Promo Code"
                value={enteredPromoCode}
                onChange={(e) => setEnteredPromoCode(e.target.value)}
                className="border-2 border-gray-300 p-2 mr-6"
            />
            <Button
                className={buttonStyle}
                onClick={()=>applyPromoCode(enteredPromoCode)}
            >
                Add Promo Code
            </Button>
        </div>

        {/* Proceed to Checkout Button */}
        <div className="flex justify-center mt-4 mb-7">
            <Button
                className={buttonStyle}
                onClick={() => setOpenModal(true)}
            >
                Check Out
            </Button>
        </div>
    </>
) : (
    <div>
    </div>
)}



  
            <Modal
        show={openModal}
        position="Center"
        onClose={() => setOpenModal(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'fixed',

        }}
      >
        <Modal.Header>Payment Processing</Modal.Header>
        <Modal.Body>
          <div className="space-y-6 p-6">
          <FormControl component="fieldset">
            <FormLabel component="legend">Choose an address for your order</FormLabel>
            <RadioGroup
              aria-label="shipping-address"
              name="shipping-address"
              value={selectedAddressId}
              onChange={(e) => handleSelectAddress(e.target.value)}
            >
              {addresses.map((address) => (
                <FormControlLabel
                  key={address.id}
                  value={address.street + address.street}
                  control={<Radio />}
                  label={
                    <div>
                      <strong>{address.label}</strong>: {address.street}, {address.city},{' '}
                      {address.state}, {address.postalCode}, {address.country}
                    </div>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>

          <Link to ="/address"><Button className={`${buttonStyle} mt-4`}> Manage Addresses</Button></Link>
          <div>
                      <strong className="mb-7">Choose your Payment Method</strong>

                      <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
    <Button className={buttonStyle} onClick={handleWalletPurchase}>by Wallet</Button>
    <Button className={buttonStyle} onClick={handleCreditCardPurchase}>by Credit Card</Button>
  </div>
           </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer/>
        </div>
    );
}

export default Cart;
