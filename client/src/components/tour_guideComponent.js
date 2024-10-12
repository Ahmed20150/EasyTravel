import { useState } from 'react';

const TouristGuideForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    experience: '',
    previousWork: '',
    dateOfBirth: '',
    occupation: '',
    nationality: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="mobileNumber"
        placeholder="Mobile Number"
        value={formData.mobileNumber}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="experience"
        placeholder="Years of Experience"
        value={formData.experience}
        onChange={handleChange}
        required
      />
      <textarea
        name="previousWork"
        placeholder="Previous Work"
        value={formData.previousWork}
        onChange={handleChange}
      />
      <input
        type="date"
        name="dateOfBirth"
        placeholder="Date of Birth"
        value={formData.dateOfBirth}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="occupation"
        placeholder="Occupation"
        value={formData.occupation}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="nationality"
        placeholder="Nationality"
        value={formData.nationality}
        onChange={handleChange}
        required
      />
      <button type="submit">Create Tourist Guide</button>
    </form>
  );
};

export default TouristGuideForm;
