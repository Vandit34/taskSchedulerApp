import React, { useState, useEffect } from 'react'
import {
  Box,
  Checkbox,
  Input,
  VStack,
  HStack,
  Text,
  IconButton,
  Select,
  useToast,
  Divider,
  Tag
} from '@chakra-ui/react'
import { FaPaperPlane } from 'react-icons/fa'
import axios from 'axios'

const TaskScheduler = () => {
  const [tasks, setTasks] = useState([])
  const [taskText, setTaskText] = useState('')
  const [priority, setPriority] = useState('Medium')
  const toast = useToast()

  // Function to add a task
  const handleAddTask = async () => {
    if (taskText) {
      const newTask = { text: taskText, priority, completed: false }

      // Save the task in local state
      setTasks([...tasks, newTask])

      try {
        const response = await axios.post('http://localhost:5000/schedule-task', {
          userId: localStorage.getItem('userId'),
          userPrompt: taskText
        })

        if (response && response.data && response.data.message) {
          console.log(response.data.message)
        }

        // Clear the input fields
        setTaskText('')
        setPriority(priority)
        toast({
          title: 'Task added!',
          description: 'Your task has been added successfully.',
          status: 'success',
          duration: 2000,
          isClosable: true
        })
      } catch (error) {
        console.error('Error adding task:', error)
      }
    }
  }

  // Fetch tasks on initial render
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('userId')
        if (userId) {
          const response = await axios.get(
            `http://localhost:5000/fetch-task?userId=${userId}`
          )
          if (response && response.data && response.data.tasks) {
            setTasks(response.data.tasks)
          }
        } else {
          console.error('User ID not found in localStorage')
        }
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    }

    fetchData()
  }, [])

  // Handle task completion toggle
  const handleCheckboxChange = (index) => {
    const updatedTasks = tasks.map((task, idx) =>
      idx === index ? { ...task, completed: !task.completed } : task
    )
    setTasks(updatedTasks)
  }

  // Function to determine tag color based on priority
  const getTagColor = (priority) => {
    switch (priority) {
      case 'Urgent':
        return { color: 'white', bg: '#D8000C' } // Red
      case 'High':
        return { color: 'white', bg: '#FFA500' } // Orange
      case 'Medium':
        return { color: 'black', bg: '#FFD700' } // Yellow
      case 'Low':
        return { color: 'white', bg: '#4CAF50' } // Green
      default:
        return { color: 'gray', bg: 'lightgray' }
    }
  }

  return (
    <Box
      marginInline='2rem'
      marginTop='2rem'
      padding='20px'
      borderRadius='10px'
      bg='#E8C5E5'
      boxShadow='md'
    >
      <VStack spacing='20px' align='start' width='100%'>
        {/* Task Input Field */}
        <Input
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder='Add a new task...'
          focusBorderColor='#FF6F61'
          variant='outline'
          fontSize='lg'
          padding='15px 20px'
          height='60px'
          width='100%'
          borderColor='#FF3D00'
          borderWidth='2px'
          borderRadius='md'
          _hover={{ boxShadow: 'md' }}
          _focus={{ boxShadow: 'lg' }}
        />

        <HStack spacing='15px' width='100%'>
          {/* Priority Select */}
          <Select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            placeholder='Select Priority'
            size='lg'
            variant='outline'
            focusBorderColor='#FF6F61'
            width='100%'
            bg='#F0F4F8'
            borderColor='#FF3D00'
            borderWidth='2px'
            borderRadius='10px'
            color='black'
            fontWeight='bold'
            _placeholder={{ color: '#B0B0B0', fontWeight: 'normal' }}
            _focus={{
              borderColor: '#FF6F61',
              boxShadow: '0 0 0 1px #FF6F61'
            }}
            _hover={{
              borderColor: '#FF6F61',
              bg: 'linear-gradient(90deg, #FF6F61 0%, #FF3D00 100%)'
            }}
            margin='16px 0'
          >
            <option value='Urgent' style={{ backgroundColor: '#D8000C', color: 'white' }}>
              Urgent
            </option>
            <option value='High' style={{ backgroundColor: '#FFA500', color: 'white' }}>
              High
            </option>
            <option value='Medium' style={{ backgroundColor: '#FFD700', color: 'black' }}>
              Medium
            </option>
            <option value='Low' style={{ backgroundColor: '#4CAF50', color: 'white' }}>
              Low
            </option>
          </Select>

          {/* Add Task Button */}
          <IconButton
            icon={<FaPaperPlane />}
            bgColor='#FF3D00'
            colorScheme='red'
            aria-label='Add Task'
            onClick={handleAddTask}
            width='2.5rem'
            height='2.5rem'
            _hover={{ bg: '#FF6F61' }}
          />
        </HStack>
        <Divider />

        {/* Task List */}
        <VStack align='stretch' spacing='15px' width='100%'>
          {tasks.map((task, index) => {
            console.log(task)
            const tagColor = getTagColor(task.priority)
            return (
              <HStack
                key={index}
                spacing='15px'
                align='center'
                bg={task.completed ? '#FFA07A' : '#FF3D00'}
                p='10px'
                borderRadius='md'
                boxShadow='sm'
              >
                <Checkbox
                  isChecked={task.completed}
                  onChange={() => handleCheckboxChange(index)}
                  colorScheme='orange'
                  size='lg'
                  sx={{
                    transform: 'scale(1.5)',
                    marginRight: '15px',
                    marginLeft: '15px',
                    border: '0.1rem solid',
                    width: '1.5rem',
                    height: '1.5rem',
                    borderRadius: '4px',
                    padding: '0.1rem'
                  }}
                />
                <Text
                  as={task.completed ? 's' : undefined}
                  fontSize='lg'
                  flex='1'
                  padding='10px 15px'
                  borderRadius='md'
                  bg={task.completed ? '#FFA07A' : '#FF6F61'}
                  color={task.completed ? '#333333' : '#ffffff'}
                  boxShadow='sm'
                  _hover={{ boxShadow: 'md', cursor: 'pointer' }}
                  className='task-item'
                >
                  {task.text}
                  <br />
                  {/* Task type and scheduled time (if available) */}
                  {task.type && task.time && (
                    `Task scheduled: ${task.type} at ${new Date(task.time).toLocaleTimeString()}`
                  )}
                </Text>

                <Tag
                  size='lg'
                  variant='solid'
                  color={tagColor.color}
                  bg={tagColor.bg}
                  borderRadius='12px'
                  px='4'
                  py='2'
                  fontWeight='bold'
                >
                  {}
                </Tag>
              </HStack>
            )
          })}
        </VStack>
      </VStack>
    </Box>
  )
}

export default TaskScheduler
