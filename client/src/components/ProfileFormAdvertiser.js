import React from 'react';

const ProfileFormAdvertiser = ({ formData, handleChange, handleSubmit, handleImageChange,buttonText }) => {
  // Custom handleChange to monitor the mobile number length
  const handleMobileChange = (e) => {
    if (e.target.value.length <= 11) {
      handleChange(e); // Only update state if the value is less than or equal to 11 digits
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="tel"
        name="mobileNumber"
        placeholder="Mobile"
        value={formData.mobileNumber}
        onChange={handleMobileChange} // Use the custom handler for mobile number
        disabled={formData.mobileNumber.length === 11} // Disable if 11 digits reached
        required
      />
      <input
        type="date"
        name="dateOfBirth"
        value={formData.dateOfBirth}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="companyName"
        placeholder="Company Name"
        value={formData.companyName}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="website"
        placeholder="Website"
        value={formData.website}
        onChange={handleChange}
      />
      <input
        type="text"
        name="hotline"
        placeholder="Hotline"
        value={formData.hotline}
        onChange={handleChange}
      />
      <input
        type="url" // Change to URL input type for company profile
        name="companyProfile"
        placeholder="Company Profile Link" // Update placeholder to reflect the change
        value={formData.companyProfile}
        onChange={handleChange} // Handle link change
        required
      />
      <input
        type="file"
        name="profilePicture"
        accept="image/*"
        onChange={handleImageChange} // Handle image change
      />
      <button type="submit">{buttonText}</button>
    </form>
  );
};

export default ProfileFormAdvertiser;
