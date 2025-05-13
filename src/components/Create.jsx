import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { X, Check } from 'lucide-react';

const inputTypes = [
  { value: 'radio', label: 'Single choice' },
  { value: 'checkbox', label: 'Multiple choice' },
  { value: 'text', label: 'Text answer' }
];

const Create = () => {
  const { id } = useParams();
  const [testName, setTestName] = useState('');
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [questions, setQuestions] = useState([
    {
      content: '',
      inputType: 'radio',
      points: 1,
      options: [''],
      correctAnswer: null,
    }
  ]);

  useEffect(() => {
    if (id) {
      const fetchTest = async () => {
        try {
          const response = await axios.get(`/test/${id}`);
          const test = response.data;
          setTestName(test.name);
          const formattedQuestions = test.questions.map(q => ({
            content: q.content,
            inputType: q.inputType,
            points: q.points,
            options: q.answersList ? Object.values(q.answersList) : [],
            correctAnswer: q.correctAnswer
          }));
          setQuestions(formattedQuestions);
        } catch (err) {
          console.error("Failed to load test for editing:", err);
        }
      };
      fetchTest();
    }
  }, [id]);

  const handleQuestionChange = (idx, field, value) => {
    setQuestions(qs =>
      qs.map((q, i) => {
        if (i !== idx) return q;
        const updated = { ...q, [field]: value };
        if (field === 'inputType') {
          if (value === 'text') {
            updated.options = [];
            updated.correctAnswer = '';
          } else if (value === 'checkbox') {
            updated.options = q.options.length ? [...q.options] : [''];
            updated.correctAnswer = [];
          } else if (value === 'radio') {
            updated.options = q.options.length ? [...q.options] : [''];
            updated.correctAnswer = null;
          }
        }
        return updated;
      })
    );
  };

  const handleOptionChange = (qIdx, oIdx, value) => {
    setQuestions(qs =>
      qs.map((q, i) => {
        if (i !== qIdx) return q;
        const newOptions = q.options.map((opt, j) => (j === oIdx ? value : opt));
        return { ...q, options: newOptions };
      })
    );
  };

  const addOption = (qIdx) => {
    setQuestions(qs =>
      qs.map((q, i) =>
        i !== qIdx ? q : { ...q, options: [...q.options, ''] }
      )
    );
  };

  const removeOption = (qIdx, oIdx) => {
    setQuestions(qs =>
      qs.map((q, i) => {
        if (i !== qIdx) return q;
        const newOptions = q.options.filter((_, j) => j !== oIdx);
        let newCorrect = q.correctAnswer;
        if (q.inputType === 'checkbox') {
          newCorrect = (q.correctAnswer || [])
            .filter(j => j !== oIdx)
            .map(j => (j > oIdx ? j - 1 : j));
        } else if (q.inputType === 'radio') {
          if (q.correctAnswer === oIdx) newCorrect = null;
          else if (q.correctAnswer > oIdx) newCorrect = q.correctAnswer - 1;
        }
        return { ...q, options: newOptions, correctAnswer: newCorrect };
      })
    );
  };

  const addQuestion = () => {
    setQuestions(qs => [
      ...qs,
      { content: '', inputType: 'radio', points: 1, options: [''], correctAnswer: null }
    ]);
  };

  const removeQuestion = (idx) => {
    setQuestions(qs => qs.filter((_, i) => i !== idx));
  };

  const isOptionCorrect = (q, optIdx) => {
    if (q.inputType === 'radio') return q.correctAnswer === optIdx;
    if (q.inputType === 'checkbox') return Array.isArray(q.correctAnswer) && q.correctAnswer.includes(optIdx);
    return false;
  };

  const markCorrect = (qIdx, optIdx) => {
    setQuestions(qs =>
      qs.map((q, i) => {
        if (i !== qIdx) return q;
        if (q.inputType === 'radio') {
          return { ...q, correctAnswer: optIdx };
        } else if (q.inputType === 'checkbox') {
          const current = Array.isArray(q.correctAnswer) ? q.correctAnswer : [];
          const updated = current.includes(optIdx)
            ? current.filter(j => j !== optIdx)
            : [...current, optIdx];
          return { ...q, correctAnswer: updated };
        }
        return q;
      })
    );
  };

  const validateTest = () => {
    if (!testName.trim()) {
      return 'Test name is required.';
    }
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.content || !q.content.trim()) {
        return `Question ${i + 1}: Content is required.`;
      }
      if (q.inputType !== 'text' && (!q.options || q.options.some(opt => !opt || !opt.trim()))) {
        return `Question ${i + 1}: All options must have content.`;
      }
      if (
        (q.inputType === 'radio' && (q.correctAnswer === null || q.correctAnswer === undefined))
        || (q.inputType === 'checkbox' && (!Array.isArray(q.correctAnswer) || q.correctAnswer.length === 0))
        || (q.inputType === 'text' && (!q.correctAnswer || !q.correctAnswer.trim()))
      ) {
        return `Question ${i + 1}: Correct answer is required.`;
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const error = validateTest();
    if (error) {
      setMessage(error);
      return;
    }
    const payload = {
      name: testName,
      questions: questions.map(q => {
        const correctAnswer =
          q.inputType === 'radio' ? q.correctAnswer :
          q.inputType === 'checkbox' ? (Array.isArray(q.correctAnswer) ? q.correctAnswer : []) :
          q.correctAnswer;
        const answersList = q.inputType !== 'text'
          ? q.options.reduce((acc, opt, idx) => ({ ...acc, [idx]: opt }), {})
          : undefined;
        return { content: q.content, inputType: q.inputType, points: q.points, answersList, correctAnswer };
      })
    };

    try {
      if (id) {
        await axios.patch(`/test/${id}`, payload, { withCredentials: true });
      } else {
        await axios.post('/test', payload, { withCredentials: true });
      }
      setMessage(`Test ${id ? 'updated' : 'created'} successfully!`);
      setTimeout(() => {
        window.location.href = '/test';
      }, 1500);
      if (!id) {
        setTestName('');
        setQuestions([{ content: '', inputType: 'radio', points: 1, options: [''], correctAnswer: null }]);
      }
    } catch (err) {
      setMessage('Failed to save test.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 flex flex-col gap-8">
        <div className="flex flex-row justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-purple-800">
            {id ? 'Edit Test' : 'Create New Test'}
          </h2>
          <Link to="/test" className="text-xl bg-purple-300 hover:bg-purple-400 p-2 rounded-md transition duration-300">Go to home page</Link>
        </div>
        <div>
          <label className="block font-semibold text-gray-700">Test Name</label>
          <input
            className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-purple-300 transition"
            value={testName}
            onChange={e => setTestName(e.target.value)}
            placeholder="Enter test name"
          />
        </div>
        {questions.map((q, idx) => (
          <div key={idx} className="bg-gray-50 rounded-lg shadow p-6">
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-lg">Question {idx + 1}</span>
              {questions.length > 1 && <button type="button" className="text-red-500 hover:text-red-700 hover:underline cursor-pointer transition duration-300" onClick={() => removeQuestion(idx)}>Remove</button>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Content</label>
              <input
                className="border rounded px-3 py-2 w-full focus:ring-2 transition"
                value={q.content}
                onChange={e => handleQuestionChange(idx, 'content', e.target.value)}
                placeholder="Enter question"
              />
            </div>
            <div className="flex gap-4 mb-4">
              <div>
                <label className="block text-gray-700">Input Type</label>
                <select
                  className="border rounded px-3 py-2 focus:ring-2 transition"
                  value={q.inputType}
                  onChange={e => handleQuestionChange(idx, 'inputType', e.target.value)}
                >
                  {inputTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Points</label>
                <input
                  type="number"
                  min={1}
                  className="border rounded px-3 py-2 w-24 focus:ring-2 transition"
                  value={q.points}
                  onChange={e => handleQuestionChange(idx, 'points', Number(e.target.value))}
                />
              </div>
            </div>
            {q.inputType !== 'text' && (
              <div className="mb-4">
                <label className="block text-gray-700">Options</label>
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-2 mb-2">
                    <input
                      className="border rounded px-3 py-2 flex-1 focus:ring-2 transition"
                      value={opt}
                      onChange={e => handleOptionChange(idx, oIdx, e.target.value)}
                      placeholder={`Option ${oIdx + 1}`}
                    />
                    <button
                      type="button"
                      className={`px-2 py-1 rounded text-xs font-semibold border ${isOptionCorrect(q, oIdx)
                        ? 'bg-green-500 text-white border-green-600'
                        : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-green-100'}`}
                      onClick={() => markCorrect(idx, oIdx)}
                    >
                      {isOptionCorrect(q, oIdx) ? <Check /> : <X />}
                    </button>
                    {q.options.length > 1 && <button type="button" className="text-red-500 hover:text-red-700 hover:underline cursor-pointer transition duration-300" onClick={() => removeOption(idx, oIdx)}>Remove</button>}
                  </div>
                ))}
                <button type="button" className="text-blue-600" onClick={() => addOption(idx)}>Add Option</button>
              </div>
            )}
            {q.inputType === 'text' && (
              <div className="mb-4">
                <label className="block text-gray-700">Correct Answer</label>
                <input
                  className="border rounded px-3 py-2 w-full focus:ring-2 focus:border-green-400 transition"
                  value={q.correctAnswer}
                  onChange={e => handleQuestionChange(idx, 'correctAnswer', e.target.value)}
                  placeholder="Type the correct answer"
                />
              </div>
            )}
          </div>
        ))}
        <div className={`text-2xl font-bold ${message.startsWith('Test created') ? 'text-green-700' : 'text-red-600'}`}>{message}</div>
        <div className="flex gap-4">
          <button type="button" className="bg-blue-500 hover:bg-blue-500 cursor-pointer transition duration-300 text-white px-4 py-2 rounded" onClick={addQuestion}>Add Question</button>
          <button type="submit" className="bg-purple-700 hover:bg-purple-800 cursor-pointer transition duration-300 text-white px-4 py-2 rounded">
            {id ? 'Update Test' : 'Save Test'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Create;
