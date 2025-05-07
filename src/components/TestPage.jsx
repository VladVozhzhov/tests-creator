import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TestPage = () => {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchTest = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/test/${id}`, { withCredentials: true });
        setTest(response.data);
      } catch (err) {
        setError('Failed to fetch test');
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [id]);

  const handleChange = (questionIndex, option, type) => {
    setAnswers(prev => {
      if (type === 'checkbox') {
        const prevArr = prev[questionIndex] || [];
        if (prevArr.includes(option)) {
          return { ...prev, [questionIndex]: prevArr.filter(o => o !== option) };
        } else {
          return { ...prev, [questionIndex]: [...prevArr, option] };
        }
      } else {
        return { ...prev, [questionIndex]: option };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/test/${id}/submit`, { answers }, { withCredentials: true });
      
      if (response.data.alreadySubmitted) {
        setMessage('You have already completed this test!');
        return;
      }
      setScore(response.data.score);
      setMaxScore(response.data.maxScore);
      setResults(response.data.results);
      
    } catch (error) {
      if (error.response?.data?.alreadySubmitted) {
        setMessage('You have already completed this test!');
      } else {
        setError('Error submitting test');
      }
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  if (!test) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <form
        className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 flex flex-col gap-8"
        onSubmit={handleSubmit}
      >
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2 text-purple-800">{test.name}</h2>
          <p className="text-gray-700">{test.description}</p>
        </div>
        {test.questions && test.questions.map((question, index) => (
          <div key={index} className="bg-gray-50 rounded-lg shadow p-6 mb-4">
            <div className="mb-4">
              <span className="font-semibold text-lg">
                {index + 1}. {question.content}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {Object.entries(question.answersList).map(([key, value]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={key}
                    checked={answers[index] === key}
                    onChange={() => handleChange(index, key, 'radio')}
                    className="accent-purple-600"
                  />
                  <span>{key}: {value}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        {message && <span className="text-red-500">{message}</span>}

        <button
          type="submit"
          className="bg-purple-700 text-white font-semibold py-3 rounded-lg shadow hover:bg-purple-800 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default TestPage;