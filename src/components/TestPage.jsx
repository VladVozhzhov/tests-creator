import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import hasAccessToken from '../utils/hasAccessToken';

const TestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchTest = async () => {
      try {
        setLoading(true);
        const access = hasAccessToken();
        const response = await axios.get(`/test/${id}`, {
          withCredentials: access,
        });
        setTest(response.data);

        if (access) {
          try {
            const statusRes = await axios.get(`/test/${id}/status`, {
              withCredentials: true,
            });
            if (statusRes.data.alreadySubmitted) {
              navigate(`/test/${id}/results`);
            }
          } catch (statusErr) {
            if (statusErr.response?.status !== 401 && statusErr.response?.status !== 403) {
              setError('Failed to fetch test status: ' + statusErr.message);
            }
          }
        }
      } catch (err) {
        setError('Failed to fetch test');
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [id, navigate]);

  const handleChange = (qIdx, value, type) => {
    setAnswers(prev => {
      if (type === 'checkbox') {
        const prevArr = prev[qIdx] || [];
        return {
          ...prev,
          [qIdx]: prevArr.includes(value)
            ? prevArr.filter(v => v !== value)
            : [...prevArr, value],
        };
      }
      return { ...prev, [qIdx]: value };
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (hasAccessToken()) {
      try {
        const response = await axios.post(
          `/test/${id}/submit`,
          { answers },
          { withCredentials: true }
        );
        if (response.data.alreadySubmitted) {
          setMessage('You have already completed this test!');
          return;
        }
        navigate(`/test/${id}/results`);
      } catch (err) {
        if (err.response?.data?.alreadySubmitted) {
          setMessage('You have already completed this test!');
        } else {
          setError(`Error submitting test: ${err.message}`);
        }
      }
    } else {
      // Save to localStorage for unauthenticated users
      const testResult = {
        testId: id,
        answers,
        date: new Date().toISOString(),
      };
      localStorage.setItem(`testResult_${id}`, JSON.stringify(testResult));
      navigate(`/test/${id}/results`);
      setMessage('Test submitted successfully!');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }
  if (!test) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <form
        className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 flex flex-col gap-8"
        onSubmit={handleSubmit}
      >
        <div>
          <h2 className="text-3xl font-bold text-purple-800">{test.name}</h2>
          {test.description && <p className="text-gray-700">{test.description}</p>}
        </div>

        {test.questions.map((question, idx) => (
          <div
            key={idx}
            className="bg-gray-50 rounded-lg shadow p-6 flex flex-col gap-4"
          >
            <span className="font-semibold text-lg">
              {idx + 1}. {question.content}
            </span>

            {question.inputType === 'radio' &&
              Object.entries(question.answersList).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`q-${idx}`}
                    value={key}
                    checked={answers[idx] === key}
                    onChange={() => handleChange(idx, key, 'radio')}
                    className="accent-purple-600"
                  />
                  <span>{label}</span>
                </label>
              ))}

            {question.inputType === 'checkbox' &&
              Object.entries(question.answersList).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name={`q-${idx}-${key}`}
                    value={key}
                    checked={Array.isArray(answers[idx]) && answers[idx].includes(key)}
                    onChange={() => handleChange(idx, key, 'checkbox')}
                    className="accent-purple-600"
                  />
                  <span>{label}</span>
                </label>
              ))}

            {question.inputType === 'text' && (
              <input
                type="text"
                value={answers[idx] || ''}
                onChange={e => handleChange(idx, e.target.value, 'text')}
                placeholder="Your answer..."
                className="border rounded px-3 py-2 focus:ring-2 focus:ring-purple-300"
              />
            )}
          </div>
        ))}

        {message && <div className="text-red-500">{message}</div>}

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
