import React, { useState } from 'react'
import axios from 'axios'
import { Box, Button, Input, VStack, useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const LogIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const toast = useToast()
  const navigate = useNavigate()

  const handleLogIn = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password
      })

      if (response && response.data) {
        console.log('response.data', response.data.data._id);
        
        // Storing user ID in localStorage
        localStorage.setItem('userId', response.data.data._id);
        
        // Optionally, you could store the entire user data if needed
        // localStorage.setItem('userData', JSON.stringify(response.data.data));

        toast({
          title: 'Account created!',
          description: response.data.message,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });

        navigate('/tasks');
      }
    } catch (error) {
      toast({
        title: 'Log in failed',
        description: error.response.data.message || 'An error occurred',
        status: 'error',
        duration: 2000,
        isClosable: true
      })
    }
  }

  return (
    <Box className='flex justify-center items-center h-screen bg-gray-200'>
      <VStack spacing={4} p={4} bg='white' boxShadow='lg' borderRadius='md'>
        <Input
          placeholder='Email'
          type='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <Input
          placeholder='Password'
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Button colorScheme='blue' onClick={handleLogIn}>
          Log In
        </Button>
      </VStack>
    </Box>
  )
}

export default LogIn
