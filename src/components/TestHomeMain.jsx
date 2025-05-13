import React, { useContext, useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import TestCard from './TestCard';
import { PlusCircle } from 'lucide-react';
import CreatorHallOfFame from './CreatorHallOfFame';
import hasAccessToken from '../utils/hasAccessToken';
import axios from 'axios';

const PAGE_SIZE = 9;

const TestHomeMain = () => {
  const { selected, setSelected, sortedTests, loading, error, fetchTests } = useContext(DataContext);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [currentAuthor, setCurrentAuthor] = useState(null);
  const [deletedTestId, setDeletedTestId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/auth/check', { withCredentials: true });
        setCurrentAuthor(response.data.user.UserInfo.username); 
      } catch (err) {
        setCurrentAuthor(null);
      }
    };
    fetchUser();
  }, []);

  const testsToShow = React.useMemo(() => {
    if (!searchTerm) return sortedTests;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return sortedTests.filter(test =>
      (test.name && test.name.toLowerCase().includes(lowerCaseSearchTerm))
    );
  }, [searchTerm, sortedTests]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selected]);

  const totalPages = Math.ceil(testsToShow.length / PAGE_SIZE);
  // Filter out deleted test from pagedTests
  const pagedTests = useMemo(() => {
    let filtered = testsToShow;
    if (deletedTestId) {
      filtered = filtered.filter(test => test._id !== deletedTestId);
    }
    return filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  }, [testsToShow, page, deletedTestId]);

  const handleSelect = (item) => {
    setSelected(item);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTestDeleted = (id) => {
    setDeletedTestId(id);
  };

  const renderTests = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
          <button 
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
            onClick={fetchTests}
          >
            Try Again
          </button>
        </div>
      );
    }

    if (testsToShow.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-500">No tests available</p>
          <Link to="/tests/create" className="mt-4 inline-block bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
            Create the first test
          </Link>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pagedTests.map((test) => (
            <TestCard
              key={test._id}
              test={test}
              currentAuthor={currentAuthor}
              onDelete={handleTestDeleted}
            />
          ))}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            <button
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                className={`px-3 py-1 rounded transition-colors ${page === idx + 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                onClick={() => setPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <main className="bg-white">
      <div className="container mx-auto px-4 pt-4 pb-10">
        <section className="bg-gray-50 rounded-lg p-8 mb-12 text-center shadow-md hover:scale-[1.01] transition duration-300">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Create Your Own Test</h2>
          <p className="text-lg text-gray-700 mb-6">Join the fun and create your own test for others to take!</p>
          <button
            className="cursor-pointer bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors inline-flex items-center"
            onClick={
              hasAccessToken()
                ? () => navigate('/test/create')
                : () => {
                    navigate('/auth');
                  }
            }
          >
            <PlusCircle size={20} className="mr-2" />
            Create Test
          </button>
        </section>

        <section className="bg-gray-50 rounded-lg p-6 mb-12 shadow-md hover:scale-[1.01] transition duration-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Search for Tests</h2>
          <input 
            className='border border-gray-300 rounded-md p-2 w-full mt-4 focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-300'
            type='text'
            onChange={handleSearch}
            value={searchTerm}
          />
        </section>

        <section className="bg-gray-50 rounded-lg p-6 mb-12 shadow-md hover:scale-[1.01] transition duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
              {selected === 'Most Liked' && 'Most Liked Tests'}
              {selected === 'Most Visited' && 'Most Visited Tests'}
              {selected === 'Most Recent' && 'Newest Tests'}
            </h2>
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-gray-700">Sort by:</span>
              <ul className="flex flex-wrap gap-2" id="sortby">
                {['Most Liked', 'Most Visited', 'Most Recent'].map((item) => (
                  <li
                    key={item}
                    className={`cursor-pointer px-4 py-2 rounded-md transition-colors ${
                      selected === item 
                        ? 'bg-purple-100 text-purple-800 font-medium' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => handleSelect(item)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {renderTests()}
        </section>

        <section>
          <CreatorHallOfFame />
        </section>
      </div>
    </main>
  );
};

export default TestHomeMain;