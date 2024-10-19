import React from 'react';

const ProfileDetailsAdvertiser = ({ profile, onEditClick }) => {

  // Create a URL for the base64 PDF
  const downloadPDF = () => {
    if (profile.companyProfile) {
      // Ensure that the profile.companyProfile is a valid base64 string without the data URL prefix
      const base64Data = profile.companyProfile;
      
      // Create a link source for the base64 data
      const linkSource = `data:application/pdf;base64,${base64Data}`;
      
      // Create a download link element
      const downloadLink = document.createElement('a');
      const fileName = 'company_profile.pdf';
  
      // Set the download link attributes
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
  
      // Append the link to the body to ensure it works in all browsers
      document.body.appendChild(downloadLink);
      
      // Programmatically click the link to trigger the download
      downloadLink.click();
  
      // Remove the link from the DOM
      document.body.removeChild(downloadLink);
    } else {
      alert('No company profile available for download.');
    }
  };
  

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

      {/* Downloadable link for company profile PDF */}
      {profile.companyProfile ? (
        <p>
          Company Profile: <button onClick={downloadPDF}>Download PDF</button>
        </p>
      ) : (
        <p>Company Profile: Not provided</p>
      )}
      
      <button onClick={onEditClick}>Edit Profile</button>
    </div>
  );
};

export default ProfileDetailsAdvertiser;
