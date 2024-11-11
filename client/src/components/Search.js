import React, { useState } from 'react';
import axios from 'axios';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/search`, {
        params: { query },
      });
      setResults(response.data);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Error searching for items. Please try again.');
      setResults([]);
    }
  };

  return (
    <div>
      <h1>Search</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, category, or tag"
      />
      <button onClick={handleSearch}>Search</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {results.map((result) => (
          <li key={result._id}>{result.name} - {result.category} - {result.tags.join(', ')}</li>
        ))}
      </ul>
    </div>
  );
};


// Example search request for museums by name
fetch('/api/museums/search?name=Eiffel Tower')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

export default Search;