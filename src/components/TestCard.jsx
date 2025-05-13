import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, Clock, PenLine, Trash2 } from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import axios from 'axios'

const TestCard = ({ test, currentAuthor, onDelete }) => {
  const [showPopup, setShowPopup] = useState(false);
  const isOwner = test.author === currentAuthor;
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handlePopup = () => {
    setShowPopup(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/test/${id}`, {}, { withCredentials: true });
      setShowPopup(false);
      if (onDelete) onDelete(id);
    } catch(err) {
      console.error('Error deleting test:', err);
    }
  };

  return (
    <>
      {showPopup && (
        <ConfirmModal
          onConfirm={() => handleDelete(test._id)}
          onCancel={() => setShowPopup(false)}
        />
      )}
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
          <div className='flex flex-row items-center gap-2'>
            <Link className="mt-4 flex items-center z-10" to={`/test/user/${test.author}`}>
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
                {test.author[0]?.toUpperCase()}
              </div>
              <span className="ml-2 text-sm text-gray-600">{test.author}</span>
            </Link>
            {isOwner && (
              <div className="flex gap-6 items-center mt-4 flex-end ml-auto">
                <Link to={`/test/edit/${test._id}`} className="text-blue-600 hover:text-blue-700 transition duration-300"><PenLine /></Link>
                <button
                  onClick={handlePopup}
                  className="text-red-600 cursor-pointer hover:text-red-700 transition duration-300"
                >
                  <Trash2 />
                </button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </>
  );
};

export default TestCard;