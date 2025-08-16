
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';

const API_URL = process.env.REACT_APP_API_URL;

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    if (!token) {
      setMessage('Invalid or missing token.');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      setLoading(false);
      return;
    }
    try {
      await axios.post(`${API_URL}/auth/reset-password`, { token, password });
      setMessage('Password reset successful! You can now log in.');
    } catch (err: any) {
      setMessage(err.response?.data?.detail || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex flex-col">
      <div className="w-full bg-white dark:bg-dark-sidebar border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-primary">
          Audio<span className="text-gray-900 dark:text-white">Norm</span>
        </h1>
        <Header onLoginClick={() => {}} />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="p-8 rounded-lg w-full max-w-md backdrop-blur-sm border border-gray-600 dark:border-gray-700 mt-8">
          <h2 className="text-center text-2xl font-semibold text-primary mb-6">Reset Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-2 font-medium text-black dark:text-gray-200">
                New Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter new password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-600 dark:border-gray-600 rounded bg-gray-700 dark:bg-gray-700 text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block mb-2 font-medium text-black dark:text-gray-200">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-600 dark:border-gray-600 rounded bg-gray-700 dark:bg-gray-700 text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-primary text-white border-none rounded font-medium cursor-pointer transition-colors mt-4 hover:bg-primary-hover disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
          {message && <p className="mt-4 text-gray-700 dark:text-gray-200">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
