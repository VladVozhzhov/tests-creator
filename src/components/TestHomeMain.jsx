import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import TestCard from './TestCard';
import { PlusCircle } from 'lucide-react';

const TestHomeMain = () => {
  const { selected, sortedTests, loading, error } = useContext(DataContext);

  // Function to render grid of tests
  const renderTests = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
          <button className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600">
            Try Again
          </button>
        </div>
      );
    }

    if (sortedTests.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-500">No tests available</p>
          <Link to="/tests/create" className="mt-4 inline-block bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600">
            Create the first test
          </Link>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTests.map((test) => (
          <TestCard key={test._id} test={test} />
        ))}
      </div>
    );
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="bg-indigo-50 rounded-lg p-8 mb-12 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Create Your Own Test</h2>
        <p className="text-lg text-gray-700 mb-6">Join the fun and create your own test for others to take!</p>
        <Link 
          className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 inline-flex items-center"
          to="/test/create"
        >
          <PlusCircle size={20} className="mr-2" />
          Create Test
        </Link>
      </section>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {selected === 'Most Liked' && 'Most Liked Tests'}
            {selected === 'Most Visited' && 'Most Visited Tests'}
            {selected === 'Most Recent' && 'Newest Tests'}
          </h2>
        </div>
        
        {renderTests()}
      </section>
    </main>
  );
};

export default TestHomeMain;