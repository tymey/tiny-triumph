import React from 'react';
import { motion } from 'framer-motion';

function App() {
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

export default App;
