// src/FileUploadDownload.js
import React, { useState } from 'react';
import axios from 'axios';
import {saveAs} from 'file-saver'

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(`File uploaded successfully: ${response.data.file._id}`);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

  const handleDownload = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(`http://localhost:3000/api/files/download/filename/${fileName}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'downloaded_file.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file');
    }
  };

//   const handleDownload = async (filename) => {
//     try {
//       const response = await fetch(`http://localhost:3000/api/files/download/filename/${filename}`, {
//         method: 'GET',
//       });
  
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
  
//       const blob = await response.blob();
//       saveAs(blob, filename);
//     } catch (error) {
//       console.error('Error downloading file:', error);
//     }
//   };

  return (
    <div>
      <h1>PDF Upload and Download</h1>
      <form onSubmit={handleUpload}>
        <input type="file" accept="application/pdf" onChange={handleFileChange} required />
        <button type="submit">Upload PDF</button>
      </form>
      <br />
      <form onSubmit={handleDownload}>
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="Enter File ID"
          required
        />
        <button type="submit">Download PDF</button>
      </form>
    </div>
  );
};

export default FileUpload;