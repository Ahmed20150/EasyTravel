import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextInput, Label, Toast, Spinner, Card } from 'flowbite-react'; // Import Flowbite components
import { HiCheck, HiX } from 'react-icons/hi'; // Import icons for success/error toast
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

import { buttonStyle } from "../styles/GeneralStyles";

const CreatePromoCode = () => {
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Track loading state

    const navigate = useNavigate();

    const handlePromoCodeSubmit = async (e) => {
        e.preventDefault();

        // Check if the fields are valid
        if (!promoCode || !discount || !expiryDate) {
            toast.error('All fields are required!');
            return;
        }

        setIsLoading(true); // Show loading spinner when submitting the form

        const formattedExpiryDate = new Date(expiryDate).toISOString();

        try {
            const response = await fetch('http://localhost:3000/promo-codes/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    promoCode,
                    discount: Number(discount),
                    expiryDate: formattedExpiryDate,
                }),
            });

            const result = await response.json();

            // If the response is not OK, handle the specific error message
            if (!response.ok) {
                throw new Error(result.message || 'Failed to create promo code.');
            }

            // If successful, show the success message from the backend
            toast.success(result.message); // Display success message
            setError(''); // Clear any previous error messages
        } catch (error) {
            // Handle error by setting the error message
            toast.error(error.message);
            setSuccess(''); // Clear any previous success messages
        } finally {
            setIsLoading(false); // Hide loading spinner after submission
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
            <ToastContainer />
            <Card className="w-full max-w-md shadow-md">
                <h2 className="text-2xl font-bold text-center mb-4">Create Promo Code</h2>

                {/* Back Button */}
                <Button
                    onClick={() => navigate(-1)}
                    className={`${buttonStyle} w-full mb-4`}
                >
                    Back
                </Button>

                {/* Promo Code Form */}
                <form onSubmit={handlePromoCodeSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="promoCode" value="Promo Code" />
                        <TextInput
                            id="promoCode"
                            type="text"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            placeholder="Enter promo code"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="discount" value="Discount (%)" />
                        <TextInput
                            id="discount"
                            type="number"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                            placeholder="Enter discount percentage"
                            required
                            min="1"
                        />
                    </div>

                    <div>
                        <Label htmlFor="expiryDate" value="Expiry Date" />
                        <TextInput
                            id="expiryDate"
                            type="date"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className={`${buttonStyle} w-full`}
                        disabled={isLoading}
                    >
                        {isLoading ? <Spinner aria-label="Loading spinner" /> : 'Create Promo Code'}
                    </Button>
                </form>
            </Card>

            {/* Display Toast Notifications for Success or Error */}
            {error && (
                <div className="absolute top-5 right-5">
                    <Toast>
                        <HiX className="h-5 w-5 text-red-500" />
                        <div className="ml-3 text-sm font-normal">{error}</div>
                        <Button
                            className={`${buttonStyle} ml-auto`}
                            size="xs"
                            onClick={() => setError('')}
                        >
                            Close
                        </Button>
                    </Toast>
                </div>
            )}

            {success && (
                <div className="absolute top-5 right-5">
                    <Toast>
                        <HiCheck className="h-5 w-5 text-green-500" />
                        <div className="ml-3 text-sm font-normal">{success}</div>
                        <Button
                            className={`${buttonStyle} ml-auto`}
                            size="xs"
                            onClick={() => setSuccess('')}
                        >
                            Close
                        </Button>
                    </Toast>
                </div>
            )}
        </div>
    );
};

export default CreatePromoCode;
