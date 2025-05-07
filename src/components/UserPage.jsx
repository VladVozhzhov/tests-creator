import React, { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

// Sorting logic copied from DataContext
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
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-10">
        <div className="w-20 h-20 rounded-full bg-indigo-200 flex items-center justify-center text-4xl font-bold text-indigo-700 mb-4">
          {name?.[0]?.toUpperCase()}
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{name}</h2>
        <p className="text-gray-500">{tests.length} test{tests.length !== 1 ? 's' : ''} created</p>
      </div>
      <section>
        <div className="flex flex-col items-center mb-8">
          <label className="text-lg text-gray-700 mb-2" htmlFor="sortby">Sort by:</label>
          <ul className="flex flex-row gap-4" id="sortby">
            {['Most Liked', 'Most Visited', 'Most Recent'].map((item) => (
              <li
                key={item}
                className={`flex items-center text-sm text-gray-700 cursor-pointer px-4 py-2 bg-white rounded-md shadow-sm hover:bg-gray-100 transition ${selected === item ? 'font-bold text-blue-500' : ''}`}
                onClick={() => setSelected(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <h3 className="text-2xl font-semibold mb-6">
          {selected === 'Most Liked' && 'Most Liked Tests'}
          {selected === 'Most Visited' && 'Most Visited Tests'}
          {selected === 'Most Recent' && 'Newest Tests'}
        </h3>
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
                className="block bg-white rounded-lg shadow hover:shadow-lg transition p-6"
              >
                <div className="flex flex-col gap-2">
                  <span className="text-xl font-bold text-purple-800">{test.name}</span>
                  <span className="text-gray-500 text-sm">
                    {test.questions?.length || 0} question{test.questions?.length !== 1 ? 's' : ''}
                  </span>
                  <div className="flex gap-4 text-sm text-gray-400 mt-2">
                    <span>Likes: {test.likes || 0}</span>
                    <span>Visits: {test.visits || 0}</span>
                  </div>
                  <span className="text-xs text-gray-400 mt-2">
                    Created: {new Date(test.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default UserPage
