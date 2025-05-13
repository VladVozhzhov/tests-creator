import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import hasAccessToken from '../utils/hasAccessToken';

const Total = () => {
  const { id } = useParams();
  const [liked, setLiked] = useState(false);
  const [test, setTest] = useState(null);
  const [results, setResults] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError('');
      if (hasAccessToken()) {
        try {
          const res = await axios.get(`/test/${id}/results`, { withCredentials: true });
          setTest(res.data.test);
          setResults(res.data.results);
          setAnswers(res.data.answers);
        } catch (err) {
          setError('Failed to fetch results');
        } finally {
          setLoading(false);
        }
      } else {
        try {
          const testRes = await axios.get(`/test/${id}`);
          setTest(testRes.data);

          const local = localStorage.getItem(`testResult_${id}`);
          if (!local) {
            setError('No local test result found.');
            setResults(null);
            setAnswers(null);
            setLoading(false);
            return;
          }
          const parsed = JSON.parse(local);
          const questionResults = (testRes.data.questions || []).map((question, idx) => {
            const userAnswer = parsed.answers[idx];
            let isCorrect = false;
            if (Array.isArray(question.correctAnswer)) {
              isCorrect =
                Array.isArray(userAnswer) &&
                question.correctAnswer.length === userAnswer.length &&
                question.correctAnswer.every(val => userAnswer.includes(val)) &&
                userAnswer.every(val => question.correctAnswer.includes(val));
            } else {
              isCorrect = String(question.correctAnswer) === String(userAnswer);
            }
            return {
              questionId: question._id,
              correct: isCorrect,
              pointsEarned: isCorrect ? (question.points || 1) : 0,
            };
          });
          setResults(questionResults);
          setAnswers(parsed.answers);
        } catch (err) {
          setError('Failed to load test or local result');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchResults();
  }, [id]);

  const handleLike = async () => {
    if (!test) return;
    setLikeLoading(true);
    try {
      const res = await axios.post(`/test/${id}/like`, {}, { withCredentials: true });
      setTest(prev => ({ ...prev, likes: res.data.likes }));
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setLiked(true);
        setTimeout(() => setLiked(false), 3000);
        return;
      }
      console.error(err)
    } finally {
      setLikeLoading(false);
    }
  };

  const getCorrectAnswer = (question) => {
    if (!question || !question.answersList) {
      return question?.correctAnswer || <span className="italic text-gray-400">No answer</span>;
    }
    if (Array.isArray(question.correctAnswer)) {
      return question.correctAnswer
        .map(key => question.answersList[String(key)] || key)
        .join(', ');
    }
    return question.answersList[String(question.correctAnswer)] || question.correctAnswer;
  };

  const getUserAnswer = (question, userAnswer) => {
    if (!question || !question.answersList) {
      return userAnswer || <span className="italic text-gray-400">No answer</span>;
    }
    if (Array.isArray(userAnswer)) {
      return userAnswer
        .map(key => question.answersList[String(key)] || key)
        .join(', ');
    }
    return question.answersList[String(userAnswer)] || userAnswer || <span className="italic text-gray-400">No answer</span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  if (!test) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        No test found.
      </div>
    );
  }
  if (!results) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        No results found for this test.
      </div>
    );
  }
  if (!answers || answers.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        No answers found for this test.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 flex flex-col gap-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-purple-800">{test.name}</h2>
            <p className="text-gray-700">{test.description}</p>
          </div>
          {liked && (<p className='text-lg'>You've already liked this test!</p>)}
          <button
            onClick={handleLike}
            disabled={likeLoading}
            className="flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-700 rounded shadow hover:bg-pink-200 transition disabled:opacity-50"
          >
            <span role="img" aria-label="like">❤️</span>
            {test.likes || 0}
            {likeLoading && <span className="ml-2 animate-spin">⏳</span>}
          </button>
        </div>
        {test.questions.map((question, index) => {
          const result = results.find(r => r.questionId === question._id);
          const isCorrect = result?.correct;
          const userAnswer = answers[index];
          return (
            <div key={question._id} className="bg-gray-50 rounded-lg shadow p-6 mb-4">
              <div className="mb-2">
                <span className="font-semibold text-lg">
                  {index + 1}. {question.content}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <div>
                  <span className="font-semibold">Your answer: </span>
                  <span className={isCorrect ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                    {getUserAnswer(question, userAnswer)}
                  </span>
                </div>
                {!isCorrect && (
                  <div>
                    <span className="font-semibold">Correct answer: </span>
                    <span className="text-green-700 font-bold">
                      {getCorrectAnswer(question)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div className="bg-gray-50 rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Test Results</h3>
          <p className="text-gray-700">
            You scored {
              test.questions.reduce((acc, q, idx) => {
                const r = results.find(r => r.questionId === q._id);
                return acc + (r && r.correct ? (Number(q.points) || 1) : 0);
              }, 0)
            } out of {
              test.questions.reduce((acc, q) => acc + (Number(q.points) || 1), 0)
            } points.
          </p>
          <p className="text-gray-700">Total questions: {test.questions.length}</p>
          <p className="text-gray-700">Correct answers: {results.filter(r => r.correct).length}</p>
          <p className="text-gray-700">Incorrect answers: {results.filter(r => !r.correct).length}</p>
        </div>
        <Link
          to={`/test`}
          className="mt-4 inline-block bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Total;
