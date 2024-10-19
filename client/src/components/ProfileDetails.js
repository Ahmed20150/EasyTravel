import React from 'react';
import { Link } from 'react-router-dom';

const ProfileDetails = ({ profile, onEditClick }) => {
  return (
    <div>
      <h2>Profile Details</h2>
      {profile.profilePicture && (
        <img
          src={profile.profilePicture}
          alt="Profile"
          style={{ width: '150px', height: '150px', objectFit: 'cover' }}
        />
      )}
      <p>Username: {profile.username}</p>
      <p>Mobile: {profile.mobileNumber ? `0${profile.mobileNumber}` : 'Not provided'}</p>
      <p>Years of Experience: {profile.yearsOfExperience || 'None'}</p>
      <p>Previous Work: {profile.previousWork || 'None'}</p>
      <p>Date of Birth: {new Date(profile.dateOfBirth).toLocaleDateString()}</p>
      <button onClick={onEditClick}>Edit Profile</button>
      <Link to="/home"><button>Back</button></Link>
    </div>
  );
};

export default ProfileDetails;
