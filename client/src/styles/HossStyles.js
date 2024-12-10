// Page container with maximum width and padding
export const pageContainer = "max-w-7xl mx-auto px-4 py-6"; // Centered container with padding

// Header styles
export const header = "text-3xl font-bold text-center mb-8"; // Heading style

// Promo Code Section
export const promoCodeContainer = "mb-6 flex justify-between items-center"; // Container for promo code section
export const promoCodeInput = "border p-2 rounded-lg w-2/3"; // Promo code input field style
export const promoCodeButton = "bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"; // Promo code apply button

// Search, Filter, and Sort Section
export const searchFilterSortContainer = "mb-8 flex flex-wrap gap-6 justify-between items-center"; // Container for search, filter, and sort
export const searchInput = "border p-2 rounded-lg w-1/3"; // Search input field style
export const priceFilterContainer = "flex gap-4"; // Price filter section (min and max price)
export const priceInput = "border p-2 rounded-lg w-1/3"; // Price input field style
export const sortSelect = "border p-2 rounded-lg"; // Sorting dropdown

// Gift Form Section
export const giftFormContainer = "mb-8 p-6 bg-gray-50 rounded-lg shadow-md"; // Container for the gift form
export const giftFormTitle = "text-2xl font-semibold mb-4"; // Form title style
export const giftFormInput = "border p-2 rounded-md w-full mb-4"; // Input fields in the form
export const errorText = "text-red-600 text-sm mt-1"; // Error message style
export const giftFormButton = "bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors mt-4"; // Form button

// Gift Item Grid
export const giftItemGrid = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"; // Grid for displaying gift items

// Individual Gift Item Card
export const giftItemCard = "border p-4 rounded-lg shadow-lg"; // Card style for individual gift item

export const giftItemCardToggled = "border p-4 rounded-lg shadow-xl bg-gray-100 scale-105 transition-transform"; // Toggled style for the card




// Admin & Product Action Buttons
export const adminButtons = "flex gap-4 justify-between"; // Buttons for admin actions (Edit, Delete)
export const productButtons = "flex gap-4 justify-between"; // Buttons for product actions (Buy, Add to Wishlist, Add to Cart)

// Loader Text
export const loaderText = "text-center text-xl"; // Loader text style

// Modal Styles
export const modalContainer = "flex flex-col items-center"; // Modal container styling
export const modalHeader = "text-2xl font-semibold mb-4"; // Modal header style
export const modalButton = "bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"; // Modal buttons (Wallet, Credit Card, Close)

// Image Container and Image Style
export const imageContainer = "w-full h-64 overflow-hidden relative"; // Keep the container width 100%, height 16rem (64px)
export const imageStyle = "object-contain w-full h-full"; // Use object-contain to maintain the aspect ratio of the image

// Gift Item Card (for individual gift item details)
export const giftItemCardContainer = "border rounded-lg shadow-lg flex flex-col p-6"; // The card for gift item details
export const giftItemImageContainer = "w-full h-48 overflow-hidden mb-4"; // Image container specific to gift item card
export const giftItemTitle = "text-2xl font-semibold mb-2"; // Gift item title
export const giftItemPrice = "text-xl font-bold text-gray-800 mb-2"; // Price styling
export const giftItemDescription = "text-gray-700 mb-4"; // Description styling
export const giftItemDetails = "flex flex-col"; // Flex for aligning gift item details like quantity, seller, and sales

// Review Styles
export const reviewContainer = "mt-6"; // Container for reviews section
export const reviewCard = "bg-white p-4 shadow-lg rounded-lg mb-4"; // Individual review card
export const reviewHeader = "flex justify-between items-center mb-2"; // Review header with username and rating
export const reviewAuthor = "font-semibold text-lg"; // Review author styling
export const reviewRating = "text-sm text-gray-500"; // Review rating styling
export const reviewContent = "text-gray-700"; // Review content style

// Error and Loading States
export const loadingState = "text-center text-lg text-gray-500"; // Loading state text style


export const cardStyle = "w-full sm:w-1/2 md:w-1/3 hover:shadow-lg hover:scale-105 transition transform duration-300";

// for activityform
export const buttonContainer = "mb-6 flex justify-between items-center"; // Adjust spacing, centering, etc.

// Notifications Section
export const notificationContainer = "p-4 bg-gray-100 rounded shadow-md mb-6";
export const notificationHeader = "flex justify-between items-center mb-4";
export const notificationTitle = "text-lg font-semibold";
export const closeButton = "text-red-600 font-bold text-lg";

// Additional styles for improved layout

// Activity Section
export const activityCategory = "text-xl font-semibold text-gray-700";
export const activityLocation = "text-gray-600";
export const activityPrice = "text-gray-800 mt-2";
export const priceMin = "font-bold";
export const priceMax = "font-bold";

// Activity Creator and Flagged Info (Admin only)
export const activityCreator = "font-semibold text-gray-700";
export const activityCreatorEmail = "text-gray-500";
export const activityFlagged = "text-red-500 font-semibold";

// Button for Back
export const backButton = "bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500";

// General Button Styling for Notifications
export const showNotificationsButton = "bg-gray-300 text-black px-4 py-2 rounded-full";

// Activity Form Specific
export const activityDetails = "text-sm text-gray-600"; // Example of activityDetails style

// Updated Button Styles within Activity Card (Edit and Delete inside card)
export const activityActionButtons = "flex gap-4 justify-between items-center mt-4 w-full"; // Buttons for Edit, Delete, Flag
export const actionButton = "bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"; // Styled action buttons inside the card

// Updated cardBorderStyle with border, shadow, and hover effect
export const cardBorderStyle = "border-2 border-gray-300 rounded-lg shadow-xl transition-transform transform hover:scale-110 hover:shadow-2xl duration-300 p-6 w-96 h-80 flex flex-col justify-between"; 

// New inputField for form elements (wide with padding, focus ring)
export const inputField = "w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";

// Button style for form (full width, padding, hover transition)
export const buttonStyle = "w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-700 transition-colors duration-300";

// Style for the form container with spacing between sections
export const formContainer = "space-y-6"; 

// Select input field style
export const selectStyle = "border p-2 rounded-lg w-full"; 

// Wrapper for input fields
export const inputWrapper = "flex flex-col space-y-2";

// Form label styles
export const formLabel = "font-medium text-lg text-gray-700";

// Style for select field
export const selectField = "px-4 py-2 border border-gray-300 rounded-md shadow-md";

// Section title styling
export const sectionTitle = "text-2xl font-semibold text-gray-800 mb-4";

// Activity Form - Edit Section
export const activityEditContainer = "max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg"; // Container for the form

// Cancel button styling with gray background and hover effect
export const cancelButton = "px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition duration-300"; // Cancel button

// Save button with blue background and smooth hover and focus effect
export const saveButton = "px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300 ease-in-out"; // Save button


// Border section with padding and margin
export const borderedSection = "border-2 border-gray-300 rounded-lg p-6 mb-6"; // Style for bordered section with padding and margin


// Section container with margin and padding
export const sectionContainer = "mb-8 p-4"; // Style for the section container with margin and padding


export const toggleButton = {
    // Add your desired CSS properties here
    backgroundColor: "blue",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
  };
  
  export const editFormContainer = {
    // define the CSS styles here
    padding: '20px',
    backgroundColor: 'lightgray',
    // etc.
  };


