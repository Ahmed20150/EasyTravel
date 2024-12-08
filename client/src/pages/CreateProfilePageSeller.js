import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const CreateProfilePageSeller = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username, isEditingProfile } = location.state || {};
  const [formData, setFormData] = useState({
    mobileNumber: '',
    firstLastName: '',
    description: '',
    dateOfBirth: '',
    profilePicture: ''
  });

  useEffect(() => {
    if (isEditingProfile && username) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/seller/profileSeller/${username}`);
          setFormData(response.data);
        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
      };
      fetchData();
    }
  }, [isEditingProfile, username]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSizeMB = file.size / 1024 / 1024;
      if (fileSizeMB > 5) {
        alert('File size exceeds the limit of 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) {
      alert("Username is missing. Please log in again.");
      return;
    }
    try {
      await axios.post('http://localhost:3000/api/seller/profileSeller', {
        username,
        ...formData
      });
      alert('Profile updated successfully!');
      navigate('/view-profileSeller', { state: { username } });
    } catch (err) {
      alert('Error updating profile: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleCancelEdit = () => {
    navigate('/home', { state: { username } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 p-8">
          <button
            onClick={() => navigate('/home')}
            className="absolute left-4 top-4 text-white hover:bg-white/20 p-2 rounded-full transition"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-4xl font-extrabold text-white text-center">
            {isEditingProfile ? 'Edit Profile' : 'Create Profile'}
          </h2>
          <p className="text-center text-white/80 mt-2">
            {isEditingProfile
              ? 'Update your personal information'
              : 'Set up your seller profile'}
          </p>
        </div>

        {/* Form Container */}
        <div className="p-10 space-y-6">
          <form className="space-y-6">
            {/* Form Inputs */}
            {[
              { label: 'Full Name', name: 'firstLastName', type: 'text' },
              { label: 'Mobile Number', name: 'mobileNumber', type: 'tel' },
              { label: 'Description', name: 'description', type: 'text' },
              { label: 'Date of Birth', name: 'dateOfBirth', type: 'date' },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label htmlFor={name} className="block text-gray-700 font-semibold mb-2">
                  {label}
                </label>
                <input
                  id={name}
                  name={name}
                  type={type}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
            ))}

            {/* Profile Picture */}
            <div>
              <label htmlFor="profilePicture" className="block text-gray-700 font-semibold mb-2">
                Profile Picture
              </label>
              <input
                id="profilePicture"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 border rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col space-y-4">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white py-3 rounded-lg hover:opacity-90 transition font-semibold"
              >
                {isEditingProfile ? 'Update Profile' : 'Create Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProfilePageSeller;
