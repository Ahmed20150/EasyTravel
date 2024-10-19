import React from 'react';

const ProfileFormAdvertiser = ({ formData, handleChange, handleSubmit, handleImageChange, handleFileChange, buttonText, isEditing }) => {
  // Custom handleChange to monitor the mobile number length
  const handleMobileChange = (e) => {
    // Ensure the input is numeric and within the length limit
    if (/^\d*$/.test(e.target.value) && e.target.value.length <= 11) {
      handleChange(e); // Only update state if the value is a number and <= 11 digits
    }
  };

  // Custom handleChange for hotline
  const handleHotlineChange = (e) => {
    // Ensure the input is numeric
    if (/^\d*$/.test(e.target.value)) {
      handleChange(e); // Only update state if the value is a number
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Mobile Number Input */}
      <input
        type="tel"
        name="mobileNumber"
        placeholder="Mobile"
        value={formData.mobileNumber}
        onChange={handleMobileChange} // Custom handler for mobile number length
        required
      />

      {/* Date of Birth Input */}
       {/* Date of Birth Input */}
       <input
        type="date"
        name="dateOfBirth"
        value={formData.dateOfBirth}
        onChange={handleChange}
        required={!isEditing} // Make it required only if not editing
      />
      {isEditing && (
        <p style={{ color: 'gray' }}>
          You do not need to change the date of birth as it is already saved.
        </p>
      )}

      {/* Company Name Input */}
      <input
        type="text"
        name="companyName"
        placeholder="Company Name"
        value={formData.companyName}
        onChange={handleChange}
        required
      />

      {/* Website Input */}
      <input
        type="text"
        name="website"
        placeholder="Website"
        value={formData.website}
        onChange={handleChange}
      />

      {/* Hotline Input */}
      <input
        type="text"
        name="hotline"
        placeholder="Hotline"
        value={formData.hotline}
        onChange={handleHotlineChange}
      />

      {/* PDF Company Profile Input (Only for new profiles) */}
      {isEditing ? (
        <p>Current PDF uploaded. To change, please upload a new one.</p>
      ) : (
        <input
          type="file"
          name="companyProfile"
          accept="application/pdf" // Accept PDF files
          onChange={handleFileChange} // Handle PDF file change
          required
        />
      )}
      {isEditing ? (
        <input
        type="file"
        name="companyProfile"
        accept="application/pdf" // Accept PDF files
        onChange={handleFileChange} // Handle PDF file change
      />
      ) : null}

      {/* Profile Picture Input */}
      {isEditing ? (
        <p>Current Picture uploaded. To change, please upload a new one.</p>
      ):(
      <input
        type="file"
        name="profilePicture"
        accept="image/*"
        onChange={handleImageChange} // Handle image change
        required
      />
      )}
      {isEditing ? (
      <input
      type="file"
      name="profilePicture"
      accept="image/*"
      onChange={handleImageChange} // Handle image change
    />
      ):null}

      {/* Submit Button */}
      <button type="submit">{buttonText}</button>
    </form>
  );
};

export default ProfileFormAdvertiser;
