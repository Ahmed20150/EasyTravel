const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3000;
const Student = require("./routes/task1.route");

const cors = require('cors');
app.use(cors());


//connect student.routes.js to index.js
app.use('/student', Student);

app.get('/', (req, res) => {
  res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Dashboard</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .header {
            background-color: #4CAF50;
            color: white;
            text-align: center;
            padding: 1rem;
          }
          .container {
            margin: 2rem auto;
            max-width: 900px;
            background-color: white;
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          .section {
            margin-bottom: 1.5rem;
          }
          .section h2 {
            color: #333;
          }
          .section p {
            font-size: 1rem;
            color: #666;
          }
          .button {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            background-color: #4CAF50;
            color: white;
            border-radius: 5px;
            text-decoration: none;
            margin-top: 1rem;
          }
          .button:hover {
            background-color: #45a049;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          table, th, td {
            border: 1px solid #ddd;
          }
          th, td {
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #4CAF50;
            color: white;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Admin Dashboard - Student Management</h1>
        </div>
        <div class="container">
          <div class="section">
            <h2>Manage Students</h2>
            <p>View, add, update, or delete student information.</p>
            <a href="/students" class="button">View All Students</a>
            <a href="/add-student" class="button">Add New Student</a>
          </div>
  
          <div class="section">
            <h2>Recent Announcements</h2>
            <p>No new announcements at this time. Create or manage announcements for students.</p>
            <a href="/announcements" class="button">Manage Announcements</a>
          </div>
  
          <div class="section">
            <h2>Admin Tasks</h2>
            <ul>
              <li><a href="/reports">Generate Reports</a></li>
              <li><a href="/settings">Admin Settings</a></li>
            </ul>
          </div>
  
          <div class="section">
            <h2>Student Overview</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Major</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>John Doe</td>
                  <td>Computer Science</td>
                  <td>john.doe@example.com</td>
                  <td>
                    <a href="/edit-student/1" class="button">Edit</a>
                    <a href="/delete-student/1" class="button" style="background-color: #f44336;">Delete</a>
                  </td>
                </tr>
                <!-- Repeat this block for more students -->
              </tbody>
            </table>
          </div>
        </div>
      </body>
      </html>
    `);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

mongoose.connect("mongodb+srv://ahmed:ahmed123@acltasks.axyrr.mongodb.net/?retryWrites=true&w=majority&appName=ACLtasks").then(() => {

  console.log("Connected to the database!");
})
  .catch((err) => {
    console.log("Cannot connect to the database!", err); 
  });