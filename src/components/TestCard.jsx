import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, Clock } from 'lucide-react';

const TestCard = ({ test }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-5">
        <Link to={`/test/${test._id}`}>
          <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:underline">{test.name}</h3>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-2">{test.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Heart size={16} className="text-red-500 mr-1" />
            <span>{test.likes}</span>
          </div>
          <div className="flex items-center">
            <Eye size={16} className="text-blue-500 mr-1" />
            <span>{test.visits}</span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="text-green-500 mr-1" />
            <span>{formatDate(test.createdAt)}</span>
          </div>
        </div>
        <Link className="mt-4 flex items-center z-10" to={`/test/user/${test.author}`}>
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
            {test.author[0]?.toUpperCase()}
          </div>
          <span className="ml-2 text-sm text-gray-600">{test.author}</span>
        </Link>
      </div>
    </div>
  );
};

export default TestCard;