import React from 'react';

const ProfileFormSeller = ({ formData, handleChange, handleSubmit, handleImageChange, buttonText }) => {
  // Custom handleChange to monitor the mobile number length
  const handleMobileChange = (e) => {
    if (e.target.value.length <= 11) {
      handleChange(e); // Only update state if the value is less than or equal to 11 digits
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="firstLastName"
        placeholder="Name"
        value={formData.firstLastName}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
      />
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
        type="file"
        name="profilePicture"
        accept="image/*"
        onChange={handleImageChange} // Handle image change
      />
      <button type="submit">{buttonText}</button>
    </form>
  );
};

export default ProfileFormSeller;
