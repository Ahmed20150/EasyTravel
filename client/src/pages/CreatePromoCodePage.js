import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const CreatePromoCode = () => {
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    const handlePromoCodeSubmit = async (e) => {
        e.preventDefault();
    
        const formattedExpiryDate = new Date(expiryDate).toISOString();
    
        try {
            const response = await fetch('http://localhost:3000/api/promo-codes/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ promoCode, discount: Number(discount), expiryDate: formattedExpiryDate }),
            });
    
            const result = await response.json();
    
            // If the response is not OK, throw an error with the message from the backend
            if (!response.ok) {
                throw new Error(result.message || 'Failed to create promo code.');
            }
    
            // If successful, show the success message from the backend
            setSuccess(result.message); // Display success message
            setError(''); // Clear any previous error messages
        } catch (error) {
            // Handle error by setting the error message
            setError(error.message);
            setSuccess(''); // Clear any previous success messages
        }
    };

    return (
        <div className="container">
            <h1>Create Promo Code</h1>
            <button onClick={() => navigate(-1)}>Back</button> {/* Back Button */}
            <form onSubmit={handlePromoCodeSubmit}>
                <div>
                    <label htmlFor="promoCode">Promo Code:</label>
                    <input
                        type="text"
                        id="promoCode"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="discount">Discount (%):</label>
                    <input
                        type="number"
                        id="discount"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="expiryDate">Expiry Date:</label>
                    <input
                        type="date"
                        id="expiryDate"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                    />
                </div>
                <button type="submit">Create Promo Code</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    );
};

export default CreatePromoCode;