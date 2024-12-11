import React from 'react';
import { Navbar, Button, Card, Footer, Blockquote } from "flowbite-react";
import { buttonStyle, cardStyle, linkStyle, centerVertically, fadeIn,stepStyle, stepIconStyle, stepTitleStyle, stepDescriptionStyle, homeCardContainer, flexRowContainer, flexRowItem } from "../styles/gasserStyles"; 
import { Link } from 'react-router-dom';
import HomeCard from '../components/HomeCard';

const ComplaintManagement = () => {
    return ( 
        <div>
              <div className="flex flex-col items-center text-3xl font-bold mb-8 mt-10">
      <h1  className="text-4xl font-bold ">Complaint Management</h1>
      </div>

      <div className="flex flex-col justify-center space-x-6">

      <figure className="mx-auto max-w-screen-md text-center mb-10">
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
          "We at EasyTravel are committed to providing the best customer service and experience. If you have any complaints, please feel free to file them here."
        </p>
      </Blockquote>
      <figcaption className="mt-6 flex items-center justify-center space-x-3">
        <div className="flex items-center divide-x-2 divide-gray-500 dark:divide-gray-700">
          <cite className="pr-3 font-medium text-gray-900 dark:text-white">Human Relations Department</cite>
          <cite className="pl-3 text-sm text-gray-500 dark:text-gray-400">EasyTravel</cite>
        </div>
      </figcaption>
    </figure>

      <div className="flex flex-row justify-center space-x-6">
  


          <HomeCard
            title="File Complaint"
            description="File a new complaint"
            linkRoute="/complaint/create"
          />

        <HomeCard
            title="My Complaints"
            description="View all my complaints and their status"
            linkRoute="/complaint/myList"
          />
          </div>
          </div>

        </div>
     );
}
 
export default ComplaintManagement;