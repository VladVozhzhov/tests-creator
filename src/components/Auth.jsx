import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!formData.username || !formData.password) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            await axios.post('/auth', formData, { withCredentials: true });
            navigate('/test');
            setFormData({ username: '', password: '' });
        } catch (err) {
            if (error.response && error.response.status === 401) {
              setError('Incorrect username or password');
              return;
            }
            if (err.response) {
                setError(err.response.data.message || 'An error occurred. Please try again.');
            } else {
                setError('Network error. Please check your connection.');
            }
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
                        Sign in to Test Creator
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                            create an account
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
                                className={"appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" + (error ? " border-red-500" : " border-gray-300")}
                                placeholder="Username"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    className={"appearance-none rounded-lg relative block w-full px-3 py-3 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pr-10" + (error ? " border-red-500" : " border-gray-300")}
                                    placeholder="Password"
                                />
                                <button className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={togglePasswordVisibility}>
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </button>
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
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                <svg className="h-5 w-5 text-indigo-300 group-hover:text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                            </span>
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Auth;