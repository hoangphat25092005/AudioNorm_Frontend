import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }
    console.log('API_URL:', API_URL);
  axios.get(`${API_URL}/verify/verify-email?token=${token}`)
      .then(res => {
        const data = res.data as { message?: string };
        setStatus('success');
        setMessage(data.message || 'Email verified successfully! You can now log in.');
      })
      .catch(err => {
        setStatus('error');
        setMessage(err.response?.data?.detail || 'Verification failed. The link may be invalid or expired.');
      });
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
        <p className={status === 'success' ? 'text-green-600' : status === 'error' ? 'text-red-600' : 'text-gray-700'}>
          {message}
        </p>
        {status === 'success' && (
          <a href="/login" className="mt-6 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Go to Login</a>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
