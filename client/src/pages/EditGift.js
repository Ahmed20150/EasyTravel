import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditGift = () => {
  const { id } = useParams(); // Get gift ID from URL params
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: "",
    price: "",
    quantity: "",
    seller: "",  // Assuming seller is part of the data
  });
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchGiftDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/gift/${id}`);
        setFormData(response.data); // Pre-fill form with response data including seller
        setLoading(false);
      } catch (error) {
        console.error("Error fetching gift details:", error);
        toast.error("Error fetching gift details.");
        setLoading(false);
      }
    };

    fetchGiftDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:3000/admin/updateGiftItem/${id}`, formData);
      
      setTimeout(() => {
        toast.success("Gift updated successfully!", {
          position: "top-right",  // Set the position of the toast
          autoClose: 3000,        // Duration of the toast (in ms)
          hideProgressBar: false, // Show progress bar
          closeOnClick: true,     // Close on click
          pauseOnHover: true,     // Pause on hover
          draggable: true,        // Allow dragging of the toast
          progress: undefined,    // Progress of the toast (optional)
        });
      }, 1000); // 2 seconds timeout

      navigate("/productList");
    } catch (error) {
      console.error("Error updating gift:", error);
      toast.error("Error updating gift. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-no-repeat bg-cover"
      style={{
        backgroundImage:
          "url(https://cdn.wallpapersafari.com/14/85/cpBUeq.jpg)",
      }}
    >
      <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
      <div className="max-w-2xl w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
        <h2 className="text-2xl font-semibold text-center">Edit Gift Item</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-600 font-semibold">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="block w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 font-semibold">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full px-4 py-2 border rounded-lg"
            />
            {formData.image && (
              <div className="mt-4">
                <img src={formData.image} alt="Gift" className="w-32 h-32 object-cover rounded" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-600 font-semibold">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="block w-full px-4 py-2 border rounded-lg"
              rows="4"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 font-semibold">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="block w-full px-4 py-2 border rounded-lg"
              min="0" // Enforces positive values at the input level
             step="0.01" // Allows decimal values
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 font-semibold">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="block w-full px-4 py-2 border rounded-lg"
              min="1" // Enforces positive values at the input level
              step="1" // Allows decimal values

              required
            />
          </div>

          {/* Seller Information Display */}
          <div>
            <label className="block text-gray-600 font-semibold">Seller</label>
            <input
              type="text"
              name="seller"
              value={formData.seller}
              readOnly
              className="block w-full px-4 py-2 border rounded-lg bg-gray-100"
            />
          </div>

          <div className="flex space-x-4 justify-center">
            <button
              type="submit"
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-700"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => navigate("/productList")}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGift;
