import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <motion.h1
                className="text-4xl font-bold text-blue-600"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Tiny Triumphs
            </motion.h1>
        </div>
    );
};

const App = () => {
    <AuthProvider>
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route path="/login" element={<Login />}/>
                <Route path="/register" element={<Register />}/>
            </Routes>
        </BrowserRouter>
    </AuthProvider>
};

export default App;
