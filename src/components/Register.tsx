import React, { useState } from 'react';

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Registration data:', formData);
    };

    return (
        <div className="bg-dark-sidebar p-8 rounded-lg w-full max-w-md backdrop-blur-sm border border-gray-600 dark:border-gray-700 mx-auto mt-8">
            <h2 className="text-center text-2xl font-semibold text-primary mb-6">Register</h2>
            
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="username" className="block mb-2 font-medium text-gray-300 dark:text-gray-200">
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
                        className="w-full p-3 border border-gray-600 dark:border-gray-600 rounded bg-gray-700 dark:bg-gray-700 text-gray-100 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block mb-2 font-medium text-gray-300 dark:text-gray-200">
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
                        placeholder="Examplepassword"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-600 dark:border-gray-600 rounded bg-gray-700 dark:bg-gray-700 text-gray-100 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block mb-2 font-medium text-gray-300 dark:text-gray-200">
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
                        className="w-full p-3 border border-gray-600 dark:border-gray-600 rounded bg-gray-700 dark:bg-gray-700 text-gray-100 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                    />
                </div>

                <button 
                    type="submit" 
                    className="w-full p-3 bg-primary text-white border-none rounded font-medium cursor-pointer transition-colors mt-4 hover:bg-primary-hover"
                >
                    Register
                </button>
            </form>

            <p className="text-center mt-6 text-gray-300 dark:text-gray-200">
                Already have an account?{' '}
                <button 
                    onClick={onLoginClick} 
                    className="bg-transparent border-none text-primary cursor-pointer underline hover:text-primary-hover transition-colors"
                >
                    Log In
                </button>
            </p>
        </div>
    );
};

export default Register;