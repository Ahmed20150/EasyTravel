import axios from 'axios';
import React, { useState } from 'react';
import ProfileForm from '../components/ProfileForm';

const CreateProfilePage = () => {
  const [formData, setFormData] = useState({
    mobile: '',
    yearsOfExperience: '',
    previousWork: '',
    dateOfBirth: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/profile', formData);
      alert('Profile created successfully!');
    } catch (err) {
      console.error(err);
      alert('Error creating profile');
    }
  };

  return (
    <div>
      <h2>Create Profile</h2>
      <ProfileForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        buttonText="Create Profile"
      />
    </div>
  );
};

export default CreateProfilePage;
