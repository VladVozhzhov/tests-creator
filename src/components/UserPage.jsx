import React, { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { Heart, Eye, Clock } from 'lucide-react';

const sortTests = (tests, selected) => {
  let sorted = [...tests]
  switch (selected) {
    case 'Most Liked':
      sorted = sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0))
      break
    case 'Most Visited':
      sorted = sorted.sort((a, b) => (b.visits || 0) - (a.visits || 0))
      break
    case 'Most Recent':
      sorted = sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      break
    default:
      sorted = sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
  return sorted
}

const UserPage = () => {
  const { name } = useParams()
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState('Most Liked')

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  useEffect(() => {
    const fetchUserTests = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await axios.get(`/test/by-username/${name}`, { withCredentials: true })
        setTests(res.data)
      } catch (err) {
        setError('Failed to load user tests')
      } finally {
        setLoading(false)
      }
    }
    fetchUserTests()
  }, [name])

  const sortedTests = useMemo(() => sortTests(tests, selected), [tests, selected])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex flex-col items-center mb-10 bg-gray-50 rounded-xl shadow-md hover:scale-[1.01] transition duration-300 p-8">
        <div className="w-20 h-20 rounded-full bg-indigo-200 flex items-center justify-center text-3xl font-bold text-indigo-700 mb-3 shadow-sm border-2 border-indigo-100">
          {name?.[0]?.toUpperCase()}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1 tracking-tight">
          {name}
        </h2>
        <p className="text-gray-500 text-base font-normal">
          {tests.length} test{tests.length !== 1 ? 's' : ''} created
        </p>
      </header>
      <main>
        <div className="bg-gray-50 rounded-lg p-6 mb-12 shadow-md hover:scale-[1.01] transition duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
              {selected === 'Most Liked' && 'Most Liked Tests'}
              {selected === 'Most Visited' && 'Most Visited Tests'}
              {selected === 'Most Recent' && 'Newest Tests'}
            </h3>
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
                    onClick={() => setSelected(item)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {sortedTests.length === 0 ? (
            <div className="text-gray-500 text-center py-10">
              No tests created yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedTests.map(test => (
                <Link
                  key={test._id}
                  to={`/test/${test._id}`}
                  className="block bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
                >
                  <div className="flex flex-col gap-2">
                    <span className="text-xl font-bold text-purple-800">{test.name}</span>
                    <span className="text-gray-500 text-sm">
                      {test.questions?.length || 0} question{test.questions?.length !== 1 ? 's' : ''}
                    </span>
                    <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
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
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default UserPage
