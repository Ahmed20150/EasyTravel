// GiftCard.js
import React from "react";
import PropTypes from "prop-types";
import { Card } from "flowbite-react";

const GiftCard = ({ index, itemName, image, description, price }) => {
  return (
    <Card>
      <img
        src={image}
        alt={`${itemName} Image`}
        className="w-full h-48 object-cover rounded-lg"
      />
      <h5 className="text-xl font-semibold mt-4">{itemName}</h5>
      <p className="text-gray-600 mt-2">{description}</p>
      <p className="text-gray-800 font-bold mt-4">Price: {price}</p>
    </Card>
  );
};

GiftCard.propTypes = {
  index: PropTypes.number.isRequired,
  itemName: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  description: PropTypes.string,
  price: PropTypes.string.isRequired,
};

GiftCard.defaultProps = {
  description: "No description available.",
};

export default GiftCard;