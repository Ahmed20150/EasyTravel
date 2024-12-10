// src/components/CardLink.js
import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { linkStyle } from "../styles/gasserStyles";

const HomeCard = ({ title, description, linkRoute, imageSrc }) => {
  return (
    <div
      className="relative rounded-lg -skew-x-6 -translate-y-2 hover:-translate-y-1 hover:-translate-x-0 hover:skew-x-0 duration-500 w-72 h-44 p-2 bg-neutral-50 card-compact hover:bg-base-200 transition-all duration-200 [box-shadow:12px_12px] hover:[box-shadow:4px_4px]"
    >
      <Link to={linkRoute} className={linkStyle}>
        <figure className="w-full h-full">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={`${title} Image`}
              className="object-cover w-full h-full rounded-lg border border-opacity-5"
            />
          ) : (
            <div
              className="bg-neutral-800 text-neutral-50 min-h-full rounded-lg border border-opacity-5 flex items-center justify-center"
              aria-label={`${title} Placeholder`}
            >

            </div>
          )}
        </figure>
        <div className="absolute text-neutral-50 bottom-4 left-0 px-4">
          <span className="font-bold">{title}</span>
          <p className="text-sm opacity-60 line-clamp-2">{description}</p>
        </div>
      </Link>
    </div>
  );
};

// Define PropTypes for type checking
HomeCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  linkRoute: PropTypes.string.isRequired,
  imageSrc: PropTypes.string, 
};

// Define default props
HomeCard.defaultProps = {
  imageSrc: null,
};

export default HomeCard;