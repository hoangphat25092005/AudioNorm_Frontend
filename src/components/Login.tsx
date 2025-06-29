import React, { useState } from 'react';

interface LoginProps {
    onRegisterClick: () => void;
}

const Login: React.FC<LoginProps> = ({ onRegisterClick }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login data:', formData);
    };

    const handleGoogleLogin = () => {
        console.log('Google login clicked');
    };

    const handleForgotPassword = () => {
        console.log('Forgot password clicked');
    };

    return (
        <div className="bg-dark-sidebar p-8 rounded-lg w-full max-w-md backdrop-blur-sm border border-gray-600 dark:border-gray-700 mx-auto mt-8">
            <h2 className="text-center text-2xl font-semibold text-primary mb-6">Log in</h2>
            
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="username" className="block mb-2 font-medium text-gray-300 dark:text-gray-200">
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
                        className="w-full p-3 border border-gray-600 dark:border-gray-600 rounded bg-gray-700 dark:bg-gray-700 text-gray-100 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block mb-2 font-medium text-gray-300 dark:text-gray-200">
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
                        className="w-full p-3 border border-gray-600 dark:border-gray-600 rounded bg-gray-700 dark:bg-gray-700 text-gray-100 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                    />
                </div>

                <div className="text-center mb-4">
                    <button 
                        type="button" 
                        onClick={handleForgotPassword} 
                        className="bg-transparent border-none text-gray-300 dark:text-gray-200 cursor-pointer text-sm underline hover:text-primary transition-colors"
                    >
                        Forgot password?
                    </button>
                </div>

                <button 
                    type="button" 
                    onClick={handleGoogleLogin} 
                    className="w-full p-3 bg-gray-600 dark:bg-gray-600 text-gray-100 dark:text-white border border-gray-500 dark:border-gray-500 rounded font-medium cursor-pointer transition-colors mb-4 flex items-center justify-center gap-2 hover:bg-gray-500 dark:hover:bg-gray-500"
                >
                    <span className="bg-blue-500 text-white w-5 h-5 rounded flex items-center justify-center text-xs font-bold">
                        G
                    </span>
                    Log in with google
                </button>

                <button 
                    type="submit" 
                    className="w-full p-3 bg-primary text-white border-none rounded font-medium cursor-pointer transition-colors mt-4 hover:bg-primary-hover"
                >
                    Log In
                </button>
            </form>

            <p className="text-center mt-6 text-gray-300 dark:text-gray-200">
                Don't have an account?{' '}
                <button 
                    onClick={onRegisterClick} 
                    className="bg-transparent border-none text-primary cursor-pointer underline hover:text-primary-hover transition-colors"
                >
                    Register
                </button>
            </p>
        </div>
    );
};

export default Login;