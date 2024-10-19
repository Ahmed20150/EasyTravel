import React from 'react';

const ProfileForm = ({ formData, handleChange, handleSubmit, handleImageChange, buttonText, isEditing }) => {
  const handleMobileChange = (e) => {
    if (/^\d*$/.test(e.target.value) && e.target.value.length <= 11) {
      handleChange(e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="tel"
        name="mobileNumber"
        placeholder="Mobile"
        value={formData.mobileNumber}
        onChange={handleMobileChange}
        required={!isEditing} // Make it not required when editing
      />
      <input
        type="number"
        name="yearsOfExperience"
        placeholder="Years of Experience"
        value={formData.yearsOfExperience}
        onChange={handleChange}
        required={!isEditing} // Make it not required when editing
      />
      <input
        type="text"
        name="previousWork"
        placeholder="Previous Work"
        value={formData.previousWork}
        onChange={handleChange}
      />
      <input
        type="date"
        name="dateOfBirth"
        value={formData.dateOfBirth}
        onChange={handleChange}
        required={!isEditing} // Make it not required when editing
      />
      {isEditing && (
        <p style={{ color: 'gray' }}>
          You do not need to change the date of birth as it is already saved.
        </p>
      )}
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
      <button type="submit">{buttonText}</button>
    </form>
  );
};

export default ProfileForm;
