import React from 'react';

const ProfileDetailsAdvertiser = ({ profile, onEditClick }) => {
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
      <p>Company name: {profile.companyName}</p>
      <p>Mobile: {profile.mobileNumber ? `0${profile.mobileNumber}` : 'Not provided'}</p>
      <p>Date of Birth: {new Date(profile.dateOfBirth).toLocaleDateString()}</p>
      
      {/* Company Information */}
      <h3>Company Information</h3>
      <p>
        Website: <a href={profile.website} target="_blank" rel="noopener noreferrer">{profile.website || 'Not provided'}</a>
      </p>
      <p>Hotline: {profile.hotline || 'Not provided'}</p>
      <p>
        Company Profile: <a href={profile.companyProfile} target="_blank" rel="noopener noreferrer">{profile.website || 'Not provided'}</a>
      </p>
      
      <button onClick={onEditClick}>Edit Profile</button>
    </div>
  );
};

export default ProfileDetailsAdvertiser;
