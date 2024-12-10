import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateGift = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["userType", "username"]);
  const userType = cookies.userType;
  const username = cookies.username;

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: "",
    price: "",
    quantity: "",
    seller: userType === "seller" ? username : "", // Automatically set seller for sellers
  });

  const [errors, setErrors] = useState({
    name: "",
    image: "",
    description: "",
    price: "",
    quantity: "",
    seller: "",
  });

  // Validate Form Data
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.image) newErrors.image = "Image is required.";
    if (!formData.description) newErrors.description = "Description is required.";
    if (!formData.price) newErrors.price = "Price is required.";
    if (!formData.quantity) newErrors.quantity = "Quantity is required.";
    if (userType === "admin" && !formData.seller) newErrors.seller = "Seller name is required for admins.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Add Gift
  const handleAddGift = async () => {
    if (!validateForm()) return;

    try {
      await axios.post("http://localhost:3000/admin/addGiftItem", formData);


      setTimeout(() => {
        toast.success("Gift added successfully! 🎉", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }, 1000); // 1 second delay




      navigate("/productlist"); // Redirect back to the product list
    } catch (error) {
      console.error("Error adding gift:", error);
      toast.error("Error adding gift. Please try again."); // Display error toast
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-no-repeat bg-cover"
      style={{
        backgroundImage:
          "url(https://cdn.wallpapersafari.com/14/85/cpBUeq.jpg)", // New background image URL
      }}
    >
      <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
      <div className="max-w-2xl w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
        <h2 className="text-2xl font-semibold text-center">Create Gift Item</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddGift();
          }}
          className="space-y-6"
        >
          <div>
            <label className="block text-gray-600 font-semibold">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="block w-full px-4 py-2 border rounded-lg"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-gray-600 font-semibold">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => setFormData({ ...formData, image: reader.result });
                  reader.readAsDataURL(file);
                }
              }}
              className="block w-full px-4 py-2 border rounded-lg"
            />
            {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
          </div>

          <div>
            <label className="block text-gray-600 font-semibold">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="block w-full px-4 py-2 border rounded-lg"
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-gray-600 font-semibold">Price</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="block w-full px-4 py-2 border rounded-lg"
              min="0" // Enforces positive values at the input level
              step="0.01" // Allows decimal values

            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-gray-600 font-semibold">Quantity</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
              className="block w-full px-4 py-2 border rounded-lg"
              min="1" // Enforces positive values at the input level
              step="1" // Allows decimal values

            />
            {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
          </div>

          
          <div>
            <label className="block text-gray-600 font-semibold">Seller</label>
            <input
              type="text"
              value={formData.seller}
              onChange={(e) => setFormData({ ...formData, seller: e.target.value })}
              className="block w-full px-4 py-2 border rounded-lg"
              disabled={userType === "seller"}
            />
            {errors.seller && <p className="text-red-500 text-sm">{errors.seller}</p>}
          </div>

          <div className="flex space-x-4 justify-center">
            <button
              type="submit"
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-700"
            >
              Add Gift
            </button>
            <button
              type="button"
              onClick={() => navigate("/productlist")}
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

export default CreateGift;
