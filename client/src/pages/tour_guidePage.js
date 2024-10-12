// pages/TouristGuidePage.js
import { useEffect, useState } from 'react';
import TouristGuideForm from '../components/tour_guideComponent';

const TouristGuidePage = () => {
  const [touristGuides, setTouristGuides] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all tourist guides
  const fetchTouristGuides = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/tour_guide');
      const data = await response.json();
      setTouristGuides(data);
    } catch (error) {
      console.error('Error fetching tourist guides:', error);
    }
  };

  // Create a new tourist guide
  const handleCreateTouristGuide = async (formData) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/tour_guide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const newGuide = await response.json();
      setTouristGuides([...touristGuides, newGuide]);
    } catch (error) {
      console.error('Error creating tourist guide:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTouristGuides();
  }, []);

  return (
    <div>
      <h1>Tourist Guides</h1>
      <TouristGuideForm onSubmit={handleCreateTouristGuide} />
      {loading && <p>Loading...</p>}
      <h2>Existing Tourist Guides</h2>
      <ul>
        {touristGuides.map((guide) => (
          <li key={guide._id}>
            <strong>{guide.name}</strong> ({guide.experience} years of experience)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TouristGuidePage;
