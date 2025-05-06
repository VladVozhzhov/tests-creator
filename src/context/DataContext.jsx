import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [selected, setSelected] = useState('Most Liked');
  const [tests, setTests] = useState([]);
  const [sortedTests, setSortedTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3500/test', { withCredentials: true });
        setTests(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch tests');
        setLoading(false);
        console.error('Error fetching tests:', err);
      }
    };

    fetchTests();
  }, []);

  useEffect(() => {
    if (tests.length === 0) return;
    
    let sorted = [...tests];
    
    switch(selected) {
      case 'Most Liked':
        sorted = sorted.sort((a, b) => b.likes - a.likes);
        break;
      case 'Most Visited':
        sorted = sorted.sort((a, b) => b.views - a.views);
        break;
      case 'Most Recent':
        sorted = sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        sorted = sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    setSortedTests(sorted);
  }, [selected, tests]);

  const value = {
    selected,
    setSelected,
    tests,
    sortedTests,
    loading,
    error
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};