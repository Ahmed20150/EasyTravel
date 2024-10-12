import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ProfileDetails from '../components/ProfileDetails';

const ViewProfilePage = ({ mobile }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/profile/${mobile}`);
        setProfile(res.data);
      } catch (err) {
        console.error(err);
        alert('Error fetching profile');
      }
    };
    fetchProfile();
  }, [mobile]);

  const handleEditClick = () => {
    window.location.href = `/edit-profile/${profile.mobile}`;
  };

  return profile ? (
    <ProfileDetails profile={profile} onEditClick={handleEditClick} />
  ) : (
    <p>Loading...</p>
  );
};

export default ViewProfilePage;
