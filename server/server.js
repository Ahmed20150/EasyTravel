const express = require('express');
const cors = require('cors');
const touristRoutes = require('./routes/touristRoutes'); // Add this line

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Your React app URL
  credentials: true // If using cookies
}));

app.use(express.json());

// Register the tourist routes
app.use('/tourist', touristRoutes); // Add this line

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});