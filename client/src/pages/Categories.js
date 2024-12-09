import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, Label, TextInput, Card } from "flowbite-react";
import { Tabs } from "flowbite-react";
import {
  HiOutlinePlusCircle,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineViewList,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import { buttonStyle } from "../styles/AshrafStyles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Categories = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [updateOldName, setUpdateOldName] = useState("");
  const [updateNewName, setUpdateNewName] = useState("");
  const [deleteCategoryName, setDeleteCategoryName] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getAllCategories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
      alert("Failed to fetch categories.");
    }
  };

  const createCategory = async () => {
    try {
      await axios.post("http://localhost:3000/api/category", { name: categoryName });
      toast.success("Category created successfully!");
      fetchCategories();
      setCategoryName("");
    } catch (error) {
      console.error("Error creating category", error);
      toast.error("Failed to create category.");
    }
  };

  const deleteCategory = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/category/${deleteCategoryName}`);
      toast.success("Category deleted successfully!");
      fetchCategories();
      setDeleteCategoryName("");
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting category", error);
      toast.error("Failed to delete category. Category not found.");
    }
  };

  const updateCategory = async () => {
    try {
      await axios.put(`http://localhost:3000/api/category/${updateOldName}`, { name: updateNewName });
      toast.success("Category updated successfully!");
      fetchCategories();
      setUpdateOldName("");
      setUpdateNewName("");
    } catch (error) {
      console.error("Error updating category", error);
      toast.error("Failed to update category. Category not found.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-center mb-6">Manage Categories</h1>

      {/* Back Button */}
      <Link to="/home">
        <Button className={`${buttonStyle} mb-5`}>Back</Button>
      </Link>

      {/* Tabs */}
      <Tabs aria-label="Category Management" variant="fullWidth" className="mb-4">
        {/* Create Category Tab */}
        <Tabs.Item title="Create" icon={HiOutlinePlusCircle}>
          <div className="space-y-4">
            <Label htmlFor="categoryName" className="block text-lg font-semibold">
              Enter Category Name
            </Label>
            <TextInput
              id="categoryName"
              name="categoryName"
              placeholder="Enter category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="mb-4"
            />
            <Button onClick={createCategory} className="w-full">
              Create Category
            </Button>
          </div>
        </Tabs.Item>

        {/* Read Categories Tab */}
        <Tabs.Item title="Read" icon={HiOutlineViewList}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card key={category._id} className="text-center shadow-md">
                <h3 className="text-lg font-semibold">{category.name}</h3>
              </Card>
            ))}
          </div>
        </Tabs.Item>

        {/* Update Category Tab */}
        <Tabs.Item title="Update" icon={HiOutlinePencilAlt}>
          <div className="space-y-4">
            <TextInput
              placeholder="Old category name"
              value={updateOldName}
              onChange={(e) => setUpdateOldName(e.target.value)}
              className="mb-4"
            />
            <TextInput
              placeholder="New category name"
              value={updateNewName}
              onChange={(e) => setUpdateNewName(e.target.value)}
              className="mb-4"
            />
            <Button onClick={updateCategory} className="w-full">
              Update Category
            </Button>
          </div>
        </Tabs.Item>

        {/* Delete Category Tab */}
        <Tabs.Item title="Delete" icon={HiOutlineTrash}>
          <div className="space-y-4">
            <TextInput
              placeholder="Enter category name to delete"
              value={deleteCategoryName}
              onChange={(e) => setDeleteCategoryName(e.target.value)}
              className="mb-4"
            />
            <Button color="failure" onClick={() => setIsDeleteModalOpen(true)} className="w-full">
              Delete Category
            </Button>
          </div>
        </Tabs.Item>
      </Tabs>

      {/* Delete Confirmation Modal */}
      <Modal show={isDeleteModalOpen} size="md" onClose={() => setIsDeleteModalOpen(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete the category "{deleteCategoryName}"?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={deleteCategory}>
                Yes, delete it
              </Button>
              <Button color="gray" onClick={() => setIsDeleteModalOpen(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Toast Notifications Container */}
      <ToastContainer />
    </div>
  );
};

export default Categories;
