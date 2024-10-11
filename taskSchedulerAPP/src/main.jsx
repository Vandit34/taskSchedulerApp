import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import SignUp from './SignUp.jsx';
import LogIn from './Login.jsx';
import TaskScheduler from './App.jsx'; // Assuming this is the main app
import './index.css';

createRoot(document.getElementById('root')).render(
  <ChakraProvider>
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/tasks" element={<TaskScheduler />} />
      </Routes>
    </Router>
  </ChakraProvider>
);
