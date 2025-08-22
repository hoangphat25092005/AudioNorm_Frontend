import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { loginUser, getGoogleAuthUrl } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LoginProps {
    onRegisterClick: () => void;
    onLoginSuccess?: () => void;
}

const Login: React.FC<LoginProps> = ({ onRegisterClick, onLoginSuccess }) => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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
        setLoading(true);
        
        try {
            const response = await loginUser(formData);
            login(response.access_token); // Update auth context
            if (onLoginSuccess) onLoginSuccess();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = getGoogleAuthUrl();
    };

    const handleForgotPassword = () => {
        navigate('/forgot-password');
    };

    return (
        <div className="dark:bg-dark-sidebar bg-white p-8 rounded-lg w-full max-w-md backdrop-blur-sm border border-gray-600 dark:border-gray-700 mx-auto mt-8">
            <h2 className="text-center text-2xl font-semibold text-primary mb-6">Log in</h2>
            
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
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
                        placeholder="Usernamehere"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-600 dark:border-gray-600 rounded bg-gray-700 dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
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
                        placeholder="Passwordhere"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-600 dark:border-gray-600 rounded bg-gray-700 dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                    />
                </div>

                <div className="text-center mb-4">
                    <button 
                        type="button" 
                        onClick={handleForgotPassword} 
                        className="bg-transparent border-none text-black dark:text-gray-200 cursor-pointer text-sm underline hover:text-primary transition-colors"
                    >
                        Forgot password?
                    </button>
                </div>

                {/* <button  
                    type="button" 
                    onClick={handleGoogleLogin} 
                    className="w-full p-3 bg-gray-400 dark:bg-gray-600 text-black dark:text-white border border-gray-500 dark:border-gray-500 rounded font-medium cursor-pointer transition-colors mb-4 flex items-center justify-center gap-2 hover:bg-gray-500 dark:hover:bg-gray-500"
                >   
                        <span>
                            {FcGoogle({ className: "w-5 h-5" })}
                        </span>
                    Log in with Google
                </button>*/}

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full p-3 bg-primary text-white border-none rounded font-medium cursor-pointer transition-colors mt-4 hover:bg-primary-hover disabled:opacity-50"
                >
                    {loading ? 'Logging in...' : 'Log In'}
                </button>
            </form>

            <p className="text-center mt-6 text-black dark:text-gray-200">
                Don't have an account?{' '}
                <button 
                    onClick={onRegisterClick} 
                    className="bg-transparent border-none text-black dark:text-primary cursor-pointer underline hover:text-primary-hover transition-colors"
                >
                    Register
                </button>
            </p>
        </div>
    );
};

export default Login;