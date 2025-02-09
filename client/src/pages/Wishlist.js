
// import './Wishlist.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useCurrency } from '../components/CurrencyContext';
import { Card, Button } from 'flowbite-react';
import { buttonStyle, cardStyle, smallCardStyle, linkStyle, centerVertically, fadeIn,stepStyle, stepIconStyle, stepTitleStyle, stepDescriptionStyle } from "../styles/gasserStyles"; 
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';


function Wishlist() {
    const [cookies] = useCookies(["username"]);
    const username = cookies.username;
    const [wishlistItems, setWishlistItems] = useState([]);
    const [giftDetails, setGiftDetails] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const { selectedCurrency, exchangeRates } = useCurrency();

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                if (!username) {
                    throw new Error("Username not available in cookies.");
                }
                const response = await axios.get(
                    `http://localhost:3000/api/tourist/${username}/wishlist`
                );
                const wishlist = response.data.wishlist;

                if (Array.isArray(wishlist) && wishlist.length > 0) {
                    setWishlistItems(wishlist);
                    fetchAllGiftDetails(wishlist); // Fetch details for all items
                } else {
                    setWishlistItems([]);
                }
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching wishlist:", error);
                setIsLoading(false);
            }
        };

        fetchWishlist();
    }, [username]);

    const fetchGiftDetails = async (name) => {
        try {
            const response = await axios.get(
                `http://localhost:3000/gift/search/${name}`
            );
    
            // Assuming the first item in the array is the relevant gift
            const gift = response.data[0];
            //alert(JSON.stringify(gift, null, 2)); // Alert details of the first gift
            return gift; // Return the first gift
        } catch (error) {
            console.error(`Error fetching details for gift ${name}:`, error);
            return null; // Return null if an error occurs
        }
    };
    

    const fetchAllGiftDetails = async (items) => {
        const details = {};
        for (const item of items) {
            const gift = await fetchGiftDetails(item); // Fetch details for each item
            if (gift) {
                details[item] = gift; // Map item name to its details
                
                // Access attributes properly
                const { description, price, image } = gift; // Destructure for clarity
            } else {
                alert(`Failed to fetch details for item: ${item}`);
            }
        }
        setGiftDetails(details); // Update state with fetched details
    };
    
    
    
    

    const convertPrice = (price) => {
        if (exchangeRates[selectedCurrency]) {
            return (price * exchangeRates[selectedCurrency]).toFixed(2);
        }
        return price.toFixed(2);
    };

    const removeItem = async (item) => {
        try {
            const response = await axios.patch(
                `http://localhost:3000/api/tourist/${username}/removeFromWishlist`,
                { giftName: item }
            );

            if (response.status === 200) {
                setWishlistItems((prevItems) => prevItems.filter((i) => i !== item));
                setGiftDetails((prevDetails) => {
                    const updatedDetails = { ...prevDetails };
                    delete updatedDetails[item];
                    return updatedDetails;
                });
            }
        } catch (error) {
            console.error("Error removing item from wishlist:", error);
        }
    };

    const addToCart = async (item) => {
        try {
            const response = await axios.patch(
                `http://localhost:3000/api/tourist/${username}/addToCartFromWishlist`,
                { giftName: item }
            );

            if (response.status === 200) {
                alert(`${item} successfully added to cart.`);
            }
        } catch (error) {
            console.error("Error adding item to cart:", error);
        }
    };

    // Log the gift details before rendering to check what we have
    console.log("Current gift details:", giftDetails);

    return (
        <div className="App">
             <div className="flex flex-col items-center text-3xl font-bold mb-8 mt-2">
            <h1 className="mt-7">❤</h1>
            <h1 className="mt-7">My Wishlist</h1>
            </div>

            <div className="fixed top-4 right-4">
    <Link to="/cart">
        <Button className={buttonStyle}>
            <ShoppingCartIcon />
        </Button>
    </Link>
</div>


            {isLoading ? (
                <p>Loading...</p>
            ) : wishlistItems.length > 0 ? (
                <ul>
                    <div className="flex justify-center gap-8 ">
                    {wishlistItems.map((item, index) => (
                            <>
                            {giftDetails[item] ? (
                                <Card className={`${smallCardStyle} w-56`}
                                imgAlt="Historic Areas"
                                imgSrc={giftDetails[item].image}>
                                   <h2>{item}</h2>

                                    <p>Description: {giftDetails[item].description}</p>
                                    <p>
                                        Price:{" "}
                                        {convertPrice(giftDetails[item].price)}{" "}
                                        {selectedCurrency}
                                    </p>
                                    <Button
                                onClick={() => removeItem(item)}
                                className={buttonStyle}
                            >
                                Remove
                            </Button>
                            <Button
                                onClick={() => addToCart(item)}
                                className={buttonStyle}
                            >
                                Add to Cart
                            </Button>
                                </Card>
                      
                            ) : (
                                <p>Loading details...</p>
                            )}
                         
                         </>
                 
                    ))}
                           </div>
                </ul>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-screen">
                <h2 className="flex flex-col items-center text-2xl font-bold mb-7 mt-2">Oops! Your Wishlist is empty!</h2> 
                <h2 className="flex flex-col items-center text-2xl font-bold mb-7 mt-2"> Visit our gift shop and find your dream products!!</h2>

                <Link to="/productList"><Button className={buttonStyle}>Go to Shop</Button></Link>
                </div>
            )}

            <div className="absolute top-4 left-4">
                <Link to="/home">
                    <Button className={buttonStyle}>Back</Button>
                </Link>
            </div>
        </div>
    );
}

export default Wishlist;
