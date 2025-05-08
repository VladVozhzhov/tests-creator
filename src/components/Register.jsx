import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const { username, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!username || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      await axios.post('/register', { username, password });
      navigate('/auth');
      setFormData({ username: '', password: '', confirmPassword: '' });
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError(`User ${username} already exists`);
        return;
      }
      console.error('Error during registration:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <svg viewBox="0 0 200 200" className="mx-auto h-16 w-16">
            {/* Logo SVG */}
            <circle cx="100" cy="100" r="90" fill="#f2f6ff" />
            <circle cx="100" cy="100" r="80" fill="#e4eaff" />
            <path d="M60 40 L140 40 L140 170 L60 170 Z" fill="#ffffff" stroke="#4338ca" strokeWidth="3" />
            <path d="M75 30 C75 20, 125 20, 125 30 L125 48 L75 48 Z" fill="#ffffff" stroke="#4338ca" strokeWidth="3" />
            <rect x="95" y="22" width="10" height="16" rx="5" fill="#4338ca" />
            <g strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="75" y1="70" x2="125" y2="70" stroke="#e5e7eb" />
              <circle cx="80" cy="70" r="10" fill="#4ade80" />
              <path d="M75 70 L80 75 L85 65" stroke="white" strokeWidth="2" fill="none" />
              <line x1="75" y1="100" x2="125" y2="100" stroke="#e5e7eb" />
              <circle cx="80" cy="100" r="10" fill="#4ade80" />
              <path d="M75 100 L80 105 L85 95" stroke="white" strokeWidth="2" fill="none" />
              <line x1="75" y1="130" x2="125" y2="130" stroke="#e5e7eb" />
              <circle cx="80" cy="130" r="10" fill="#f87171" />
              <path d="M76 126 L84 134 M84 126 L76 134" stroke="white" strokeWidth="2" />
            </g>
          </svg>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/auth" className="font-medium text-indigo-600 hover:text-indigo-500">
              sign in to your account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4 p-2">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                type="text"
                autoComplete="username"
                className={"appearance-none rounded-lg relative block w-full px-3 py-3 border placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm pr-10 focus:ring-indigo-500 focus:border-indigo-500" + (error ? " border-red-500" : " border-gray-300")}
                placeholder="Username"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password (must be at least 8 characters long)
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={"appearance-none rounded-lg relative block w-full px-3 py-3 border placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm pr-10 focus:ring-indigo-500 focus:border-indigo-500" + (error ? " border-red-500" : " border-gray-300")}
                  placeholder="Password"
                />
                <div 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {showPassword ? (
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" 
                      />
                    ) : (
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                      />
                    )}
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={"appearance-none rounded-lg relative block w-full px-3 py-3 border placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm pr-10 focus:ring-indigo-500 focus:border-indigo-500" + (error ? " border-red-500" : " border-gray-300")}
                  placeholder="Confirm password"
                />
                <div 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {showConfirmPassword ? (
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" 
                      />
                    ) : (
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                      />
                    )}
                  </svg>
                </div>
              </div>
            </div>
            {error && (
              <div className="text-red-500 mt-2">
                {error}
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-indigo-300 group-hover:text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              Create account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;