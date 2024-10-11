import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ActivityList = () => {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchActivities = async () => {
            const response = await axios.get('http://localhost:3500/activities');
            setActivities(response.data);
        };
        fetchActivities();
    }, []);

    return (
        <div>
            <h2>Activities</h2>
            <ul>
                {activities.map(activity => (
                    <li key={activity._id}>
                        {activity.date} - {activity.category}: {activity.location.address}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ActivityList;
