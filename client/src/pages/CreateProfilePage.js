import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom'; // Import useNavigate
import ProfileForm from '../components/ProfileForm';

const CreateProfilePage = () => {
  const location = useLocation(); // Get the location state
  const navigate = useNavigate(); // Initialize navigate
  const { username, isEditingProfile, existingData } = location.state || {}; // Include existing data

  const [formData, setFormData] = useState({
    mobileNumber: '',
    yearsOfExperience: '',
    previousWork: '',
    dateOfBirth: '',
    profilePicture: ''
  });

  useEffect(() => {
    if (isEditingProfile && username) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/profile/${username}`);
          setFormData(response.data); // Set the existing data
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
      await axios.post('http://localhost:3000/api/profile', {
        username,
        ...formData
      });
      alert('Profile updated successfully!');
      navigate('/view-profile', { state: { username } });
    } catch (err) {
      console.error(err.response.data);
      alert('Error updating profile: ' + err.response.data.error);
    }
  };

  const handleCancelEdit = (e) => {
    navigate('/view-profile', { state: { username } });
  };

  return (
    <div>
      <h2>{isEditingProfile ? 'Edit Profile' : 'Create Profile'}</h2> 
      <ProfileForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleImageChange={handleImageChange}
        buttonText={isEditingProfile ? 'Edit Profile' : 'Create Profile'}
        isEditing={isEditingProfile}
      />
      <button onClick={handleCancelEdit}>Cancel</button>

    </div>
  );
};

export default CreateProfilePage;
