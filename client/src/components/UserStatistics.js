// src/components/UserStatistics.js
import React, { useState } from 'react';
import axios from 'axios';

const UserStatistics = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [userStats, setUserStats] = useState(null);

    const fetchUserStats = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3000/admin/stats');
            setUserStats(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch user statistics');
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={fetchUserStats}>View Number of Users</button>

            {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}

            {userStats && (
                <div>
                    <h2>Total Users: {userStats.totalUsers}</h2>
                    <h3>Total Tourists: {userStats.totalTourists}</h3>
                    <h3>Total Sellers: {userStats.totalSellers}</h3>
                    <h3>Total Advertisers: {userStats.totalAdvertisers}</h3>
                    <h3>Total Tour Guides: {userStats.totalTourGuides}</h3>
                    <h3>Total Tourism Governors: {userStats.totalTourismGovernors}</h3>
                    <h4>New Users by Month:</h4>
                    <ul>
                        {Object.keys(userStats.totalNewUsersByMonth).map((month) => (
                            <li key={month}>
                                {month}: {userStats.totalNewUsersByMonth[month]}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UserStatistics;
