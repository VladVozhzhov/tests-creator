import React, { useMemo, useContext } from 'react';
import { Link } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import { Heart, Eye } from 'lucide-react';

const CreatorHallOfFame = () => {
  const { tests, loading } = useContext(DataContext);

  const creators = useMemo(() => {
    const map = {};
    tests.forEach(test => {
      if (!test.author) return;
      if (!map[test.author]) {
        map[test.author] = { likes: 0, visits: 0, count: 0 };
      }
      map[test.author].likes += test.likes || 0;
      map[test.author].visits += test.visits || 0;
      map[test.author].count += 1;
    });
    return Object.entries(map)
      .map(([author, stats]) => ({ author, ...stats }))
      .sort((a, b) => b.likes - a.likes || b.visits - a.visits);
  }, [tests]);

  if (loading) return null;
  if (!creators.length) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-center mb-6 text-yellow-600">Creator Hall of Fame</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {creators.slice(0, 3).map((creator, idx) => (
          <Link key={creator.author} className="bg-white rounded-lg shadow p-6 flex flex-col items-center w-64" to={`/test/user/${creator.author}`}>
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-700 mb-2">
              {creator.author[0]?.toUpperCase()}
            </div>
            <div className="text-lg font-semibold">{creator.author}</div>
            <div className="text-gray-500 text-sm mb-2">{creator.count} test{creator.count !== 1 ? 's' : ''}</div>
            <div className="flex gap-4 text-sm mt-2">
              <span className="flex flex-row items-center"><Heart size={16} className="text-red-500 mr-1" /> {creator.likes}</span>
              <span className="flex flex-row items-center"><Eye size={16} className="text-blue-500 mr-1"  /> {creator.visits}</span>
            </div>
            <div className="text-xs text-gray-400 mt-2">#{idx + 1} on leaderboard</div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CreatorHallOfFame;
