import React, { useState } from 'react';
import { registerUser } from '../services/api';
interface RegisterProps {
    onLoginClick: () => void;
}

const Register: React.FC<RegisterProps> = ({ onLoginClick }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }
        setLoading(true);
        try {
            await registerUser({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                confirm_password: formData.confirmPassword
            });
            setSuccess('Registration successful! Please check your email to verify your account.');
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dark:bg-dark-sidebar bg-white p-8 rounded-lg w-full max-w-md backdrop-blur-sm border border-gray-600 dark:border-gray-700 mx-auto mt-8">
            <h2 className="text-center text-2xl font-semibold text-primary mb-6">Register</h2>
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    {success}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="username" className="block mb-2 font-medium text-black dark:text-gray-200">
                        User name
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Examplename"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-600 dark:border-gray-600 rounded bg-gray-700 dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block mb-2 font-medium text-black dark:text-gray-200">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Example@gmail.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-600 dark:border-gray-600 rounded bg-gray-400 dark:bg-gray-700 text-black dark:text-white placeholder-black dark:placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block mb-2 font-medium text-black dark:text-gray-200">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Examplepassword"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-600 dark:border-gray-600 rounded bg-gray-400 dark:bg-gray-700 text-black dark:text-white placeholder-black dark:placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block mb-2 font-medium text-black dark:text-gray-200">
                        Confirm password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Re-typepassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-600 dark:border-gray-600 rounded bg-gray-400 dark:bg-gray-700 text-black dark:text-white placeholder-black dark:placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                    />
                </div>

                <button 
                type="submit" 
                disabled={loading || !!success}
                className="w-full p-3 bg-primary text-white border-none rounded font-medium cursor-pointer transition-colors mt-4 hover:bg-primary-hover disabled:opacity-50"
                >
                {loading ? 'Registering...' : 'Register'}
                </button>
            </form>

            <p className="text-center mt-6 text-black dark:text-gray-200">
                Already have an account?{' '}
                <button 
                    onClick={onLoginClick} 
                    className="bg-transparent border-none text-primary cursor-pointer underline hover:text-primary-hover transition-colors"
                    disabled={!!success}
                >
                    Log In
                </button>
            </p>
        </div>
    );
};

export default Register;