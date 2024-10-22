// src/Categories.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
// import './Categories.css'; // Import the CSS file for styling

const Categories = () => {
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [updateOldName, setUpdateOldName] = useState('');
  const [updateNewName, setUpdateNewName] = useState('');
  const [deleteCategoryName, setDeleteCategoryName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/category'); // Ensure this is the correct URL
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
      alert('Failed to fetch categories.'); // Alert the user
    }
  };

  const createCategory = async () => {
    try {
      await axios.post('http://localhost:3000/api/category', { name: categoryName });
      alert('Category created!');
      fetchCategories();
      setCategoryName(''); // Clear the input field after creation
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
        if (error.response.status === 400) {
          alert(error.response.data.message); // Display backend error message
        } else {
          alert('An unexpected error occurred while creating the category.');
        }
      } else {
        alert('Failed to create category.'); // Generic error message
      }
    }
  };

  const deleteCategory = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/category/${deleteCategoryName}`);
      alert('Category deleted!');
      fetchCategories();
      setDeleteCategoryName(''); // Clear the input field after deletion
    } catch (error) {
      console.error('Error deleting category', error);
      alert('Failed to delete category,Category not found.'); // Alert the user
    }
  };

  const updateCategory = async () => {
    try {
      await axios.put(`http://localhost:3000/api/category/${updateOldName}`, { name: updateNewName });
      alert('Category updated!');
      fetchCategories();
      setUpdateOldName(''); // Clear the input field after update
      setUpdateNewName(''); // Clear the input field after update
    } catch (error) {
      console.error('Error updating category', error);
      alert('Failed to update category,Category not found.'); // Alert the user
    }
  };

  return (
    <div className="categories-container">
      <div className="form-section">
        <h2>Create Category</h2>
        <Link to="/home"><button>Back</button></Link>
        <input
          type="text"
          placeholder="Enter category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <button onClick={createCategory}>Create Category</button>
      </div>

      <div className="form-section">
        <h2>All Categories</h2>
        <button onClick={fetchCategories}>Read Categories</button>
        <ul>
          {categories.map((category) => (
            <li key={category._id}>{category.name}</li>
          ))}
        </ul>
      </div>

      <div className="form-section">
        <h2>Update Category</h2>
        <input
          type="text"
          placeholder="Old category name"
          value={updateOldName}
          onChange={(e) => setUpdateOldName(e.target.value)}
        />
        <input
          type="text"
          placeholder="New category name"
          value={updateNewName}
          onChange={(e) => setUpdateNewName(e.target.value)}
        />
        <button onClick={updateCategory}>Update</button>
      </div>

      <div className="form-section">
        <h2>Delete Category</h2>
        <input
          type="text"
          placeholder="Enter category name to delete"
          value={deleteCategoryName}
          onChange={(e) => setDeleteCategoryName(e.target.value)}
        />
        <button onClick={deleteCategory}>Delete Category</button>
      </div>
    </div>
  );
};

export default Categories;
