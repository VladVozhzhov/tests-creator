import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [selected, setSelected] = useState('Most Liked');
  const [tests, setTests] = useState([]);
  const [sortedTests, setSortedTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTests = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/test', { withCredentials: true });
        setTests(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setTests([]);
          setLoading(false);
        } else {
          setError('Failed to fetch tests');
          setLoading(false);
          console.error('Error fetching tests:', err);
        }
      }
    };

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/test', { withCredentials: true });
        setTests(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setTests([]);
          setLoading(false);
        } else {
          setError('Failed to fetch tests');
          setLoading(false);
          console.error('Error fetching tests:', err);
        }
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
        sorted = sorted.sort((a, b) => b.visits - a.visits);
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
    error,
    fetchTests,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};