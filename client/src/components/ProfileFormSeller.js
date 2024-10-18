import React from 'react';

const ProfileFormSeller = ({ formData, handleChange, handleSubmit, handleImageChange, buttonText, isEditing }) => {
  const handleMobileChange = (e) => {
    if (/^\d*$/.test(e.target.value) && e.target.value.length <= 11) {
      handleChange(e);
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
        required={isEditing ? false : true} // Make required only if not editing
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required={isEditing ? false : true} // Make required only if not editing
      />
      <input
        type="tel"
        name="mobileNumber"
        placeholder="Mobile"
        value={formData.mobileNumber}
        onChange={handleMobileChange}
        required={isEditing ? false : true} // Make required only if not editing
      />
      <input
        type="date"
        name="dateOfBirth"
        value={formData.dateOfBirth}
        onChange={handleChange}
        required={isEditing ? false : true} // Make required only if not editing
      />
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
      <button type="submit">{buttonText}</button>
    </form>
  );
};

export default ProfileFormSeller;
