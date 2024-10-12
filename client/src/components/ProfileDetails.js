import React from 'react';

const ProfileDetails = ({ profile, onEditClick }) => {
  return (
    <div>
      <h2>Profile Details</h2>
      <p>Mobile: {profile.mobile}</p>
      <p>Years of Experience: {profile.yearsOfExperience}</p>
      <p>Previous Work: {profile.previousWork || 'None'}</p>
      <p>Date of Birth: {new Date(profile.dateOfBirth).toLocaleDateString()}</p>
      <button onClick={onEditClick}>Edit Profile</button>
    </div>
  );
};

export default ProfileDetails;
