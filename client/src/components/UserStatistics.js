import React, { useState } from "react";
import axios from "axios";
import { Modal, Spinner, Alert, Card, Badge } from "flowbite-react";
import { dynamicButtonStyle } from "../styles/AshrafStyles"; // Import the dynamic button style

const UserStatistics = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [userStats, setUserStats] = useState(null);
    const [openModal, setOpenModal] = useState(false); // State to toggle modal visibility

    // Fetch User Stats from API
    const fetchUserStats = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:3000/admin/stats");
            setUserStats(response.data);
            setLoading(false);
            setError(""); // Clear error on success
        } catch (err) {
            setError("Failed to fetch user statistics. Please try again later.");
            setLoading(false);
        }
    };

    // Open Modal and Fetch Data
    const handleViewStats = async () => {
        setOpenModal(true);
        await fetchUserStats(); // Fetch stats when modal opens
    };

    return (
        <div className = "w-full">
            {/* Button to open modal */}
            <button
                className = {`${dynamicButtonStyle} w-full`} // Apply the dynamic button style
                onClick={handleViewStats}
            >
                View Number of Users
            </button>

            {/* Modal for User Statistics */}
            <Modal
                show={openModal}
                size="lg"
                onClose={() => setOpenModal(false)}
            >
                <Modal.Header>User Statistics</Modal.Header>
                <Modal.Body>
                    {/* Loading Indicator */}
                    {loading && (
                        <div className="flex justify-center">
                            <Spinner size="lg" aria-label="Loading..." />
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <Alert color="failure">
                            <span>{error}</span>
                        </Alert>
                    )}

                    {/* Display User Statistics */}
                    {userStats && (
                        <div className="space-y-4">
                            <Card>
                                <h3 className="text-lg font-bold text-gray-800">
                                    Total Users: <Badge color="info">{userStats.totalUsers}</Badge>
                                </h3>
                            </Card>
                            <div className="grid grid-cols-2 gap-4">
                                <Card>
                                    <h3 className="text-lg font-bold text-gray-800">
                                        Total Tourists: <Badge color="purple">{userStats.totalTourists}</Badge>
                                    </h3>
                                </Card>
                                <Card>
                                    <h3 className="text-lg font-bold text-gray-800">
                                        Total Sellers: <Badge color="success">{userStats.totalSellers}</Badge>
                                    </h3>
                                </Card>
                                <Card>
                                    <h3 className="text-lg font-bold text-gray-800">
                                        Total Advertisers: <Badge color="warning">{userStats.totalAdvertisers}</Badge>
                                    </h3>
                                </Card>
                                <Card>
                                    <h3 className="text-lg font-bold text-gray-800">
                                        Total Tour Guides: <Badge color="indigo">{userStats.totalTourGuides}</Badge>
                                    </h3>
                                </Card>
                                <Card>
                                    <h3 className="text-lg font-bold text-gray-800">
                                        Total Tourism Governors: <Badge color="dark">{userStats.totalTourismGovernors}</Badge>
                                    </h3>
                                </Card>
                            </div>
                            <div className="mt-4">
                                <h4 className="text-lg font-semibold text-gray-800">
                                    New Users by Month:
                                </h4>
                                <ul className="list-disc list-inside text-gray-700">
                                    {Object.keys(userStats.totalNewUsersByMonth).map((month) => (
                                        <li key={month}>
                                            <span className="font-medium">{month}:</span>{" "}
                                            {userStats.totalNewUsersByMonth[month]}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </Modal.Body>

                {/* Back Button at the Bottom */}
                <Modal.Footer>
                    <button
                        className={`${dynamicButtonStyle}`}
                        onClick={() => setOpenModal(false)}
                    >
                        Back
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UserStatistics;
