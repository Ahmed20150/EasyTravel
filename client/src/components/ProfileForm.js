import React from 'react';

const ProfileForm = ({ formData, handleChange, handleSubmit, buttonText }) => {
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="mobile"
        placeholder="Mobile"
        value={formData.mobile}
        onChange={handleChange}
        disabled={!!formData.mobile} 
        required
      />
      <input
        type="number"
        name="yearsOfExperience"
        placeholder="Years of Experience"
        value={formData.yearsOfExperience}
        onChange={handleChange}
        required
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
        required
      />
      <button type="submit">{buttonText}</button>
    </form>
  );
};

export default ProfileForm;
