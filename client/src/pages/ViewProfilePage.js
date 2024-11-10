import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import ProfileDetails from '../components/ProfileDetails';

const ViewProfilePage = () => {
  const location = useLocation(); // Access location object
  const navigate = useNavigate(); // Initialize navigate
  const { username } = location.state || {}; // Retrieve username from location state
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (username) {
      const fetchProfile = async () => {
        try {
          const res = await axios.get(`http://localhost:3000/api/profile/${username}`); // Fetch profile by username
          setProfile(res.data);
        } catch (err) {
          console.error(err);
          alert('Error fetching profile');
        }
      };
      fetchProfile();
    }
  }, [username]); // Fetch profile when username is available

  const handleEditClick = () => {
    if (profile) {
      navigate('/edit-profile/', { state: { username, isEditingProfile: true } }); // Use navigate to go to edit profile
    }
  };

  return profile ? (
    <ProfileDetails profile={profile} onEditClick={handleEditClick} />
  ) : (
    <p>Loading...</p>
  );
};

export default ViewProfilePage;
