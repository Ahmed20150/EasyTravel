import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Button, Card, Input, Label, Select, Checkbox, Modal, TextInput, Blockquote, Table } from "flowbite-react";// import "./AddAddressPage.css";
import { buttonStyle, cardStyle, linkStyle, centerVertically, fadeIn,stepStyle, stepIconStyle, stepTitleStyle, stepDescriptionStyle , centerContent} from "../styles/gasserStyles"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const AddAddressPage = () => {
  const [cookies] = useCookies(["username"]);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [label, setLabel] = useState("Home");
  const [message, setMessage] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();
  const username = cookies.username;

  useEffect(() => {
    if (username) {
      axios
        .get(`http://localhost:3000/api/tourists/${username}/addresses`)
        .then((response) => setAddresses(response.data))
        .catch(() => toast.info("Failed to fetch addresses"));
    } else {
      toast.info("User not logged in");
    }
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpenModal(false);
    const addressData = {
      street,
      city,
      state,
      postalCode,
      country,
      label,
    };

    try {
      if (editingAddress) {
        await axios.put(
          `http://localhost:3000/api/tourists/${username}/addresses/${editingAddress._id}`,
          addressData
        );
        toast.info("Address updated successfully!");
        setEditingAddress(null);
      } else {
        await axios.post(
          `http://localhost:3000/api/tourists/${username}/addresses`,
          addressData
        );
        toast.info("Address added successfully!");
      }

      const response = await axios.get(
        `http://localhost:3000/api/tourists/${username}/addresses`
      );
      setAddresses(response.data);

      setStreet("");
      setCity("");
      setState("");
      setPostalCode("");
      setCountry("");
      setLabel("Home");
    } catch (error) {
      toast.info(error.response?.data?.error || "Failed to save address.");
    }
  };

  const handleEdit = (address) => {
    setOpenModal(true);
    setStreet(address.street);
    setCity(address.city);
    setState(address.state);
    setPostalCode(address.postalCode);
    setCountry(address.country);
    setLabel(address.label);
    setEditingAddress(address);
    toast.info("Editing address...");
  };

  const handleCancelEdit = () => {
    setOpenModal(false);
    setStreet("");
    setCity("");
    setState("");
    setPostalCode("");
    setCountry("");
    setLabel("Home");
    setEditingAddress(null);
    toast.info("Edit canceled.");
  };

  const handleRemoveAddress = (address) => {
    const updatedAddresses = addresses.filter(
      (addr) => addr._id !== address._id
    ); // Remove address locally
    setAddresses(updatedAddresses); // Update state immediately

    axios
      .delete(
        `http://localhost:3000/api/tourists/${username}/addresses/${address.label}`
      )
      .then(() => {
        toast.info("Address removed successfully!");
        // Optional: Refetch the addresses from the backend to ensure consistency
        axios
          .get(`http://localhost:3000/api/tourists/${username}/addresses`)
          .then((response) => {
            setAddresses(response.data); // Update the address list after deletion
          })
          .catch((error) => {
            toast.info("Failed to fetch updated addresses.");
            console.error(error);
          });
      })
      .catch((error) => {
        // In case of failure, roll back the state update
        setAddresses(addresses); // Restore the previous state
        toast.info("Failed to remove address.");
        console.error(error);
      });
  };


  const handleSelectAddress = (address) => {
    setDefaultAddress(address); // Set the selected address as default
    toast.info(
      `You have successfully selected "${address.label}" as the default address.`
    );
  };

  return (
    <div className = "flex flex-col items-center justify-center">
    <div className="absolute top-4 left-4">
        <Button
          onClick={() => navigate("/home")}
          className={buttonStyle}
        >
          Back
        </Button>
        </div>
        <div className="flex flex-col items-center text-3xl font-bold mb-8 mt-10">
      <h1  className="text-4xl font-bold ">Addresses</h1>
      </div>

      <figure className="mx-auto max-w-screen-md text-center mb-5">
      <svg
        className="mx-auto mb-3 h-10 w-10 text-gray-400 dark:text-gray-600"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 18 14"
      >
        <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
      </svg>
      <Blockquote>
        <p className="text-2xl font-medium italic text-gray-900 dark:text-white">
          "EasyTravel does not sell or store your personal data and information. We are committed to protecting your privacy and security."
        </p>
      </Blockquote>
      <figcaption className="mt-6 flex items-center justify-center space-x-3">
        <div className="flex items-center divide-x-2 divide-gray-500 dark:divide-gray-700">
          <cite className="pr-3 font-medium text-gray-900 dark:text-white">Data Protection Board</cite>
          <cite className="pl-3 text-sm text-gray-500 dark:text-gray-400">EasyTravel</cite>
        </div>
      </figcaption>
    </figure>

      <Button className={buttonStyle} onClick={() => setOpenModal(true)}>Add Address</Button>
      {username ? (
        <div>
          {/* <h2>{editingAddress ? "Edit Address" : "Enter Address Details"}</h2> */}

          <h3 className="text-3xl font-bold mt-9 mb-9 ">Available Addresses</h3>
          {addresses.length > 0 ? (
            <ul>
              {addresses.map((address, index) => (
                
                <li key={index}>

{/*                   
{address.label}: {address.street}, {address.city},{" "}
                  {address.state}, {address.postalCode}, {address.country}
                  <button className="edit-button" onClick={() => handleEdit(address)}>Edit</button>
                  <button className="delete-button" onClick={() => handleRemoveAddress(address)}>
                    Delete
                  </button>
                  <button className="select-button" onClick={() => handleSelectAddress(address)}>
                    Select
                  </button> */}
 <Table>
        <Table.Head>
          <Table.HeadCell>Address Label</Table.HeadCell>
          <Table.HeadCell>Street</Table.HeadCell>
          <Table.HeadCell>City</Table.HeadCell>
          <Table.HeadCell>State</Table.HeadCell>
          <Table.HeadCell>Postal Code</Table.HeadCell>
          <Table.HeadCell>Country</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              {address.label}
            </Table.Cell>
            <Table.Cell>{address.street}</Table.Cell>
            <Table.Cell>{address.city}</Table.Cell>
            <Table.Cell>{address.state}</Table.Cell>
            <Table.Cell>{address.postalCode}</Table.Cell>
            <Table.Cell>{address.country}</Table.Cell>
             
            <Table.Cell> 
            <Button className={buttonStyle} onClick={() => handleSelectAddress(address)}>
                    Select
            </Button>            </Table.Cell>
            
            <Table.Cell> 
            <Button className={buttonStyle}onClick={() => handleEdit(address)}>Edit</Button>
            </Table.Cell>
            <Table.Cell>
            <Button className={buttonStyle}onClick={() => handleRemoveAddress(address)}>
                    Delete</Button>           
            </Table.Cell>
            <Table.Cell>
            <Button className={buttonStyle} onClick={() => handleSelectAddress(address)}>
                    Set as Default
                  </Button>            
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>






                </li>
              ))}
            </ul>
          ) : (
            <p>No addresses added yet.</p>
          )}
          {defaultAddress && (
            <p>
              Default Address: {defaultAddress.label} - {defaultAddress.street},{" "}
              {defaultAddress.city}
            </p>
          )}
        </div>
      ) : (
        <p>Please log in to manage your addresses.</p>
      )}
      {message && <p>{message}</p>}




    {/* Address Form Modal */}
    <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)}>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              {editingAddress ? "Edit Address" : "Add New Address"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Street */}
              <div>
                <Label htmlFor="street" value="Street" />
                <TextInput
                  id="street"
                  type="text"
                  placeholder="123 Main St"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                  className="mt-1 block w-full"
                />
              </div>

              {/* City */}
              <div>
                <Label htmlFor="city" value="City" />
                <TextInput
                  id="city"
                  type="text"
                  placeholder="New York"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="mt-1 block w-full"
                />
              </div>

              {/* State */}
              <div>
                <Label htmlFor="state" value="State" />
                <TextInput
                  id="state"
                  type="text"
                  placeholder="NY"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                  className="mt-1 block w-full"
                />
              </div>

              {/* Postal Code */}
              <div>
                <Label htmlFor="postalCode" value="Postal Code" />
                <TextInput
                  id="postalCode"
                  type="text"
                  placeholder="10001"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  className="mt-1 block w-full"
                />
              </div>

              {/* Country */}
              <div>
                <Label htmlFor="country" value="Country" />
                <Select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  className="mt-1 block w-full"
                >
                  <option value="">Select a country</option>
                  <option value="USA">USA</option>
                  <option value="Canada">Canada</option>
                  <option value="UK">UK</option>
                  {/* Add more countries as needed */}
                </Select>
              </div>

              {/* Label */}
              <div>
                <Label htmlFor="label" value="Label" />
                <TextInput
                  id="label"
                  type="text"
                  placeholder="Home"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  required
                  className="mt-1 block w-full"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-between">
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  {editingAddress ? "Update Address" : "Add Address"}
                </Button>
                {editingAddress && (
                  <Button
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
      <ToastContainer/>
    </div>
  );
};

export default AddAddressPage;
