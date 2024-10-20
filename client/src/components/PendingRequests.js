import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import Cookies from 'js-cookie';

const PendingRequests = () => {
    const [pendingGuides, setPendingGuides] = useState([]);
    const [pendingAdvertisers, setPendingAdvertisers] = useState([]);
    const [pendingSellers, setPendingSellers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null); // State to hold the selected user data
    const [base64, setBase64] = useState(''); //holds base64 of uploaded pdf document
    const [uploadedFile, setUploadedFile] = useState(null);

    useEffect(() => {
        const fetchPendingRequests = async () => {
            try {
                const [guidesResponse, advertisersResponse, sellersResponse] = await Promise.all([
                    axios.get('http://localhost:3000/admin/pending-tour-guides'),
                    axios.get('http://localhost:3000/admin/pending-advertisers'),
                    axios.get('http://localhost:3000/admin/pending-sellers'),
                ]);
                setPendingGuides(guidesResponse.data);
                setPendingAdvertisers(advertisersResponse.data);
                setPendingSellers(sellersResponse.data);
            } catch (error) {
                console.error('Error fetching pending requests:', error);
            }
        };

        fetchPendingRequests();
    }, []);

    const handleAccept = async (type, id) => {
        try {
            await axios.put(`http://localhost:3000/admin/accept-${type}/${id}`);
            updatePendingRequests(type, id);
        } catch (error) {
            console.error(`Error accepting ${type}:`, error);
        }
    };

    const handleReject = async (type, id) => {
        try {
            await axios.put(`http://localhost:3000/admin/reject-${type}/${id}`);
            updatePendingRequests(type, id);
        } catch (error) {
            console.error(`Error rejecting ${type}:`, error);
        }
    };

    const handleShow = (user) => {
        setSelectedUser(user); // Set the selected user data to display
        fetchBase64(user.username);
    };

    const updatePendingRequests = (type, id) => {
        switch (type) {
            case 'tour-guide':
                setPendingGuides(pendingGuides.filter(guide => guide._id !== id));
                break;
            case 'advertiser':
                setPendingAdvertisers(pendingAdvertisers.filter(ad => ad._id !== id));
                break;
            case 'seller':
                setPendingSellers(pendingSellers.filter(seller => seller._id !== id));
                break;
            default:
                break;
        }
    };

    const fetchBase64 = async (username) => {
        try {
          const response = await axios.get(`http://localhost:3000/api/files/getbasestring`, {
            params: { username: username }
          });      
          setBase64(response.data.base64);
          setUploadedFile(response.data);
        } catch (error) {
          console.error('Error fetching file:', error);
          alert('Error fetching file');
        }
    };


    return (
        <div>
            <h1>Pending Requests</h1>
            <Link to="/home"><button>Back</button></Link>

            <h2>Pending Tour Guides</h2>
            <ul>
                {pendingGuides.map(guide => (
                    <li key={guide._id}>
                        {guide.username} - {guide.status}
                        <button onClick={() => handleShow(guide)}>Show</button>
                        <button onClick={() => handleAccept('tour-guide', guide._id)}>Accept</button>
                        <button onClick={() => handleReject('tour-guide', guide._id)}>Reject</button>
                    </li>
                ))}
            </ul>

            <h2>Pending Advertisers</h2>
            <ul>
                {pendingAdvertisers.map(ad => (
                    <li key={ad._id}>
                        {ad.username} - {ad.status}
                        <button onClick={() => handleShow(ad)}>Show</button>
                        <button onClick={() => handleAccept('advertiser', ad._id)}>Accept</button>
                        <button onClick={() => handleReject('advertiser', ad._id)}>Reject</button>
                    </li>
                ))}
            </ul>

            <h2>Pending Sellers</h2>
            <ul>
                {pendingSellers.map(seller => (
                    <li key={seller._id}>
                        {seller.username} - {seller.status}
                        <button onClick={() => handleShow(seller)}>Show</button>
                        <button onClick={() => handleAccept('seller', seller._id)}>Accept</button>
                        <button onClick={() => handleReject('seller', seller._id)}>Reject</button>
                    </li>
                ))}
            </ul>

            {selectedUser && ( // Display user details if selected
                <div>
                    <h3>User Details</h3>
                    {selectedUser.companyName ? ( // Check if the user is an advertiser
                        <>
                            <p><strong>Company Name:</strong> {selectedUser.companyName}</p>
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <p><strong>Hotline:</strong> {selectedUser.hotline}</p>
                            <p><strong>Website:</strong> <a href={selectedUser.website} target="_blank" rel="noopener noreferrer">{selectedUser.website}</a></p>
                            <p><strong>Profile Picture:</strong></p>
                            <img src={selectedUser.profilePicture} alt={selectedUser.username} style={{ width: '100px', height: '100px' }} />
                            <p><strong>Uploaded Document:</strong></p>
                            <iframe
                            src={`data:application/pdf;base64,${base64}`}
                            width="100%"
                            height="600px"
                            title="PDF Viewer"
                            />
                        </>
                    ) : selectedUser.mobileNumber ? ( // Check if the user is a seller
                        <>
                            <p><strong>Username:</strong> {selectedUser.username}</p>
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <p><strong>Mobile Number:</strong> {selectedUser.mobileNumber}</p>
                            <p><strong>Profile Picture:</strong></p>
                            <img src={selectedUser.profilePicture} alt={selectedUser.username} style={{ width: '100px', height: '100px' }} />
                            <p><strong>Uploaded Document:</strong></p>
                            <iframe
                            src={`data:application/pdf;base64,${base64}`}
                            width="100%"
                            height="600px"
                            title="PDF Viewer"
                            />
                        </>
                    ) : ( // Otherwise, it’s a tour guide
                        <>
                            <p><strong>Username:</strong> {selectedUser.username}</p>
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <p><strong>Date of Birth:</strong> {new Date(selectedUser.dateOfBirth).toLocaleDateString()}</p>
                            <p><strong>Description:</strong> {selectedUser.description}</p>
                            <p><strong>Mobile Number:</strong> {selectedUser.mobileNumber}</p>
                            <img src={selectedUser.profilePicture} alt={selectedUser.username} style={{ width: '100px', height: '100px' }} />
                            <p><strong>Uploaded Document:</strong></p>
                            <iframe
                            src={`data:application/pdf;base64,${base64}`}
                            width="100%"
                            height="600px"
                            title="PDF Viewer"
                            />
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default PendingRequests;
