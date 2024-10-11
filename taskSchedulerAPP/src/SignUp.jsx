import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Input, VStack, useToast, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/signup', {
        username,
        email,
        password,
      });
      toast({
        title: 'Account created!',
        description: response.data.message,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Sign up failed',
        description: error.response?.data?.message || 'An error occurred',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // Navigate to login page
  const goToLogin = () => {
    navigate('/login');  // Change this route to wherever your login page is
  };

  return (
    <Box className="flex justify-center items-center h-screen bg-gray-200">
      <VStack spacing={4} p={4} bg="white" boxShadow="lg" borderRadius="md">
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button colorScheme="blue" onClick={handleSignUp}>
          Sign Up
        </Button>

        {/* Button to navigate to login */}
        <Text>Already have an account?</Text>
        <Button variant="outline" onClick={goToLogin}>
          Log In
        </Button>
      </VStack>
    </Box>
  );
};

export default SignUp;
