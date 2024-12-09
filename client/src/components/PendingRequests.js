import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Button, Card, Modal, Table } from 'flowbite-react'; 
import {buttonStyle} from '../styles/GeneralStyles';

const PendingRequests = () => {
  const [pendingGuides, setPendingGuides] = useState([]);
  const [pendingAdvertisers, setPendingAdvertisers] = useState([]);
  const [pendingSellers, setPendingSellers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // State to hold the selected user data
  const [base64, setBase64] = useState(''); // holds base64 of uploaded pdf document
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
    <div className="p-4">
      <h1 className="text-3xl font-semibold mb-6 text-center">Pending Requests</h1>
      <Link to="/home">
        <Button className={buttonStyle}>Back</Button>
      </Link>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Pending Tour Guides</h2>
        <Table>
          <Table.Head>
            <Table.HeadCell>Username</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {pendingGuides.map(guide => (
              <Table.Row key={guide._id}>
                <Table.Cell>{guide.username}</Table.Cell>
                <Table.Cell>{guide.status}</Table.Cell>
                <Table.Cell>
                  <Button onClick={() => handleShow(guide)} color="gray" size="sm" className="ml-2">
                    Show
                  </Button>
                  <Button onClick={() => handleAccept('tour-guide', guide._id)} color="green" size="sm" className="ml-2">
                    Accept
                  </Button>
                  <Button onClick={() => handleReject('tour-guide', guide._id)} color="red" size="sm" className="ml-2">
                    Reject
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Pending Advertisers</h2>
        <Table>
          <Table.Head>
            <Table.HeadCell>Username</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {pendingAdvertisers.map(ad => (
              <Table.Row key={ad._id}>
                <Table.Cell>{ad.username}</Table.Cell>
                <Table.Cell>{ad.status}</Table.Cell>
                <Table.Cell>
                  <Button onClick={() => handleShow(ad)} color="gray" size="sm" className="ml-2">
                    Show
                  </Button>
                  <Button onClick={() => handleAccept('advertiser', ad._id)} color="green" size="sm" className="ml-2">
                    Accept
                  </Button>
                  <Button onClick={() => handleReject('advertiser', ad._id)} color="red" size="sm" className="ml-2">
                    Reject
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Pending Sellers</h2>
        <Table>
          <Table.Head>
            <Table.HeadCell>Username</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {pendingSellers.map(seller => (
              <Table.Row key={seller._id}>
                <Table.Cell>{seller.username}</Table.Cell>
                <Table.Cell>{seller.status}</Table.Cell>
                <Table.Cell>
                  <Button onClick={() => handleShow(seller)} color="gray" size="sm" className="ml-2">
                    Show
                  </Button>
                  <Button onClick={() => handleAccept('seller', seller._id)} color="green" size="sm" className="ml-2">
                    Accept
                  </Button>
                  <Button onClick={() => handleReject('seller', seller._id)} color="red" size="sm" className="ml-2">
                    Reject
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      {selectedUser && ( // Display user details if selected
        <Modal show={true} onClose={() => setSelectedUser(null)}>
          <Modal.Header>User Details</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              {selectedUser.companyName ? ( // Check if the user is an advertiser
                <>
                  <p><strong>Company Name:</strong> {selectedUser.companyName}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Hotline:</strong> {selectedUser.hotline}</p>
                  <p><strong>Website:</strong> <a href={selectedUser.website} target="_blank" rel="noopener noreferrer">{selectedUser.website}</a></p>
                  <p><strong>Profile Picture:</strong></p>
                  <img src={selectedUser.profilePicture} alt={selectedUser.username} className="w-24 h-24 object-cover rounded-full" />
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
                  <img src={selectedUser.profilePicture} alt={selectedUser.username} className="w-24 h-24 object-cover rounded-full" />
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
                  <img src={selectedUser.profilePicture} alt={selectedUser.username} className="w-24 h-24 object-cover rounded-full" />
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
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default PendingRequests;
