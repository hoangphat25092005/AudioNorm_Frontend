import React, { useState } from 'react';
import './Login.css';

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
        // Handle login logic here
        console.log('Login data:', formData);
    };

    const handleGoogleLogin = () => {
        // Handle Google login logic here
        console.log('Google login clicked');
    };

    const handleForgotPassword = () => {
        // Handle forgot password logic here
        console.log('Forgot password clicked');
    };

    return (
        <div className="login-form">
            <h2 className="login-title">Log in</h2>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">User name</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Usernamehere"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Passwordhere"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="forgot-password">
                    <button type="button" onClick={handleForgotPassword} className="forgot-link">
                        Forgot password?
                    </button>
                </div>

                <button type="button" onClick={handleGoogleLogin} className="google-login-button">
                    <span className="google-icon">G</span>
                    Log in with google
                </button>

                <button type="submit" className="login-submit-button">
                    Log In
                </button>
            </form>

            <p className="register-link">
                Don't have an account? <button onClick={onRegisterClick} className="link-button">Register</button>
            </p>
        </div>
    );
};

export default Login;