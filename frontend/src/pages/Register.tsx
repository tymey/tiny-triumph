import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';

export const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register(username, password);
            navigate('/login');
        } catch {
            setError('Registration failed');
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 space-y-4">
            <h2 className="text-2xl font-bold">Register</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-2">
                <input
                    className="w-full p-2 border rounded"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    className="w-full p-2 border rounded"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded"
                >
                    Sign Up
                </button>
            </form>
            <p>
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 underline">
                    Log In
                </Link>
            </p>
        </div>
    );
};