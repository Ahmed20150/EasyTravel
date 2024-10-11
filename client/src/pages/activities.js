import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ActivityManager = () => {
    // State for form data
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        location: { address: '', coordinates: { lat: '', lng: '' } },
        price: { min: '', max: '' },
        category: '',
        tags: '',
        specialDiscounts: '',
        isBookingOpen: true
    });

    // State for storing activities
    const [activities, setActivities] = useState([]);

    // Fetch activities when the component is loaded
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get('http://localhost:3000/activities');
                setActivities(response.data);
            } catch (error) {
                console.error('Error fetching activities:', error);
            }
        };
        fetchActivities();
    }, []);

    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle nested location or price updates
        if (name.includes('location') || name.includes('price')) {
            const keys = name.split('.');
            setFormData((prev) => ({
                ...prev,
                [keys[0]]: {
                    ...prev[keys[0]],
                    [keys[1]]: value
                }
            }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/activities', formData);
            console.log('Activity created:', response.data);
            // Fetch activities again to reflect the newly created one
            setActivities([...activities, response.data]);
        } catch (error) {
            console.error('Error creating activity:', error);
        }
    };

    return (
        <div>
            <h1>Activity Manager</h1>
            {/* Activity Form */}
            <form onSubmit={handleSubmit}>
                <input type="date" name="date" onChange={handleChange} value={formData.date} required />
                <input type="time" name="time" onChange={handleChange} value={formData.time} required />
                
                <input type="text" name="location.address" placeholder="Address" onChange={handleChange} value={formData.location.address} required />
                
                <input type="number" name="price.min" placeholder="Min Price" onChange={handleChange} value={formData.price.min} required />
                <input type="number" name="price.max" placeholder="Max Price" onChange={handleChange} value={formData.price.max} required />

                <input type="text" name="category" placeholder="Category" onChange={handleChange} value={formData.category} required />
                
                <input type="text" name="tags" placeholder="Tags (comma separated)" onChange={handleChange} value={formData.tags} required />
                
                <input type="text" name="specialDiscounts" placeholder="Special Discounts" onChange={handleChange} value={formData.specialDiscounts} />

                <label>
                    Booking Open:
                    <input type="checkbox" name="isBookingOpen" checked={formData.isBookingOpen} onChange={() => setFormData({ ...formData, isBookingOpen: !formData.isBookingOpen })} />
                </label>
                
                <button type="submit">Create Activity</button>
            </form>

            {/* Activity List */}
            <div>
                <h2>Activities</h2>
                {activities.length > 0 ? (
                    <ul>
                        {activities.map(activity => (
                            <li key={activity._id}>
                                {activity.date} - {activity.category}: {activity.location.address}, {activity.price.min}-{activity.price.max} $
                                <br /> Special Discount: {activity.specialDiscounts || 'None'}
                                <br /> Booking Open: {activity.isBookingOpen ? 'Yes' : 'No'}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No activities found</p>
                )}
            </div>
        </div>
    );
};

export default ActivityManager;
