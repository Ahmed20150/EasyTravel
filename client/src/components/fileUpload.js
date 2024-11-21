// src/FileUploadDownload.js
import React, { useState } from 'react';
import axios from 'axios';
import {saveAs} from 'file-saver'
import { useEffect } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [base64, setBase64] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64(reader.result.split(',')[1]); // Extract base64 string
    };
    reader.readAsDataURL(selectedFile);
  };

  

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/files/upload', {
        filename: file.name,
        contentType: file.type,
        base64: base64,
      });
      setUploadedFile(response.data.file);
      alert('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

  const deleteAll = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.delete('http://localhost:3000/api/files/deleteAll');
      alert(response.data);
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Error deletng');
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(`http://localhost:3000/api/files/getbasestring`, {
        params: { filename: fileName }
      });      
      setBase64(response.data.base64);
      setUploadedFile(response.data);
    } catch (error) {
      console.error('Error fetching file:', error);
      alert('Error fetching file');
    }

    // console.log(fileName);
  };




  return (
    <div>
      <h1>PDF Upload and Download</h1>
      <form onSubmit={handleUpload}>
        <input type="file" accept="application/pdf" onChange={handleFileChange} required />
        <button type="submit">Upload PDF</button>
      </form>
      <br />
      <form onSubmit={handleSearch}>
      <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="Enter filename"
          required
        />
        <button type="submit">Search</button>
        </form>
        <button onClick={deleteAll}>delete all </button>

        {base64 && (
        <div>
          {/* <h2>File Details</h2>
          <p>Filename: {uploadedFile.filename}</p>
          <p>Content Type: {uploadedFile.contentType}</p>
          <p>Size: {uploadedFile.length} bytes</p>
          <p>Uploaded At: {new Date(uploadedFile.createdAt).toLocaleString()}</p>
          <h2>Viewing: {uploadedFile.filename}</h2> */}
          <iframe
            src={`data:application/pdf;base64,${base64}`}
            width="100%"
            height="600px"
            title="PDF Viewer"
          />
        </div>
      )}
        {/* {base64 && (
        <div>
          <h2>Viewing: {fileName}</h2>
          <iframe
            src={`data:application/pdf;base64,${base64}`}
            width="100%"
            height="600px"
            title="PDF Viewer"
          />
        </div>
      )} */}
        
    </div> 
  );
};

export default FileUpload;