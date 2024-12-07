import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProfileFormAdvertiser from '../components/ProfileFormAdvertiser';

const CreateProfilePageAdvertiser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username, isEditingProfile } = location.state || {};

  const [formData, setFormData] = useState({
    companyName: '',
    mobileNumber: '',
    dateOfBirth: '',
    website: '',
    hotline: '',
    companyProfile: null, // This will store the file itself (PDF)
    profilePicture: ''
  });

  // Fetch existing profile data if editing
  useEffect(() => {
    if (isEditingProfile && username) {
      const fetchProfile = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/adv/profileAdv/${username}`);
          const profile = response.data;

          // Initialize form data with fetched profile data
          setFormData({
            companyName: profile.companyName || '',
            mobileNumber: profile.mobileNumber || '',
            dateOfBirth: profile.dateOfBirth || '',
            website: profile.website || '',
            hotline: profile.hotline || '',
            companyProfile: null, // Reset for new file upload
            profilePicture: profile.profilePicture || ''
          });
        } catch (err) {
          console.error(err);
          alert('Error fetching profile data.');
        }
      };

      fetchProfile();
    }
  }, [isEditingProfile, username]);

  // Handle changes in the form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle PDF file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please upload a valid PDF file for the company profile.');
        return;
      }
      setFormData({ ...formData, companyProfile: file }); // Store the file directly
    }
  };

  // Handle image change (profile picture)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSizeMB = file.size / 1024 / 1024;
      if (fileSizeMB > 5) {
        alert('File size exceeds the limit of 5MB.');
        e.target.value = null;
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePicture: reader.result });
      };
      reader.readAsDataURL(file); // Convert image to base64 string
    }
  };

  const handleCancelEdit = (e) => {
    navigate('/home', { state: { username } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) {
      alert("Username is missing. Please log in again.");
      return;
    }

    // Prepare FormData for submission
    const formDataToSend = new FormData();
    formDataToSend.append('username', username);
    formDataToSend.append('mobileNumber', formData.mobileNumber);
    formDataToSend.append('companyName', formData.companyName);
    formDataToSend.append('website', formData.website);
    formDataToSend.append('hotline', formData.hotline);
    formDataToSend.append('dateOfBirth', formData.dateOfBirth);
    formDataToSend.append('profilePicture', formData.profilePicture);

    if (formData.companyProfile) {
      formDataToSend.append('companyProfile', formData.companyProfile); // Append PDF file
    }

    try {
      await axios.post('http://localhost:3000/api/adv/profileAdv', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Profile updated successfully!');

      navigate('/view-profileAdv', { state: { username } });
    } catch (err) {
      console.error(err.response.data);
      alert('Error updating profile: ' + (err.response.data.error || 'An error occurred.'));
    }
  };

  return (
    <div>
      <h2>{isEditingProfile ? 'Edit Advertiser Profile' : 'Create Advertiser Profile'}</h2>
      <ProfileFormAdvertiser
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleFileChange={handleFileChange} // Handle the PDF upload
        handleImageChange={handleImageChange} 
        buttonText={isEditingProfile ? 'Edit Profile' : 'Create Profile'}
        isEditing={isEditingProfile}
      />

      <button onClick={handleCancelEdit}>Cancel</button>
    </div>
  );
};

export default CreateProfilePageAdvertiser;
