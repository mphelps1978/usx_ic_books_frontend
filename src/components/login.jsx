// src/components/Login.jsx
import { React, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      {/* Changed: Compact card (~384px) with debug border, shadow, and rounded corners */}
      <div className="w-full max-w-sm bg-white rounded-lg shadow-xl p-6 border-2 border-red-500">
        {/* Changed: Compact title with QuickBooks-like blue */}
        <h1 className="text-2xl font-bold text-center mb-3 text-blue-600">Trucking Management</h1>
        {/* Changed: Form heading for focus */}
        <h2 className="text-lg font-medium text-center mb-3 text-gray-600">Sign In</h2>
        {/* Changed: Error message with subtle background */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-3 p-2 bg-red-50 rounded">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Changed: Compact email input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Email"
              required
            />
          </div>
          {/* Changed: Compact password input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Password"
              required
            />
          </div>
          {/* Changed: Compact, bold button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 focus:ring-1 focus:ring-blue-500"
          >
            Sign In
          </button>
          {/* Changed: Compact register link */}
          <p className="text-xs text-center text-gray-600 mt-2">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-600 hover:underline">
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;