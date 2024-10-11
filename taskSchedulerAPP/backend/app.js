// app.js
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const chrono = require('chrono-node')
const nlp = require('compromise')
const schedule = require('node-schedule')
const User = require('./model/user.js') // Import the User model
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cookieParser())

// MongoDB URI
const MONGO_URI =
  'mongodb+srv://vanditverma34:Y54mDKAc0D1YIsXP@taskcluster.uffua.mongodb.net/'
app.use(
  cors({
    origin: '*'
  })
)

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected')
  })
  .catch(error => {
    console.log(`Error in connecting to the database: ${error}`)
  })

// For testing
app.get('/test', (req, res) => {
  return res.send('test')
})

// Signup Controller
app.post('/signup', async (req, res) => {
  let { username, email, password } = req.body

  // Convert password to a string
  password = password.toString()

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please enter all fields.' })
  }

  try {
    // Check if the user already exists in the database
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' })
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create a new user instance with the hashed password
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    })

    // Save the new user to the database
    await newUser.save()

    return res.status(201).json({ message: 'User registered successfully.' })
  } catch (err) {
    console.error('Server Error:', err) // Log the error for debugging
    return res
      .status(500)
      .json({ message: 'Server error', serverMessage: err.message })
  }
})

// Login Controller
app.post('/login', async (req, res) => {
  let { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Please enter all fields.' })
  }

  // Convert password to a string
  password = password.toString()

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' })
    }

    // Successful login
    res.status(200).json({ message: 'Login successful.', data: user })
    return // Ensures no further code execution
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
})

// Protected Route Example (Dashboard)
app.get('/dashboard', (req, res) => {
  // No JWT validation, only a placeholder message
  res.status(200).json({ message: 'Welcome to the dashboard!' })
})

// Logout Controller
app.post('/logout', (req, res) => {
  // No cookie clearing, just respond with a success message
  res.status(200).json({ message: 'Logged out successfully.' })
})

// Function to extract the task type and time from the user prompt
function extractTaskAndTime (prompt) {
  const parsedDate = chrono.parseDate(prompt) // Extract date and time

  let taskType = 'Task' // Default task type

  // Use compromise (nlp) to find a meaningful noun
  const doc = nlp(prompt)
  const nouns = doc.nouns().out('array')
  console.log(nouns)

  if (nouns.length > 0) {
    taskType = nouns[0]
  }

  return { taskType, taskTime: parsedDate }
}

// Function to add a task to the scheduler
function addTask (taskType, taskTime) {
  if (taskTime) {
    const scheduleTime = `${taskTime.getHours()}:${taskTime.getMinutes()}`

    schedule.scheduleJob(taskTime, function () {
      console.log(`Reminder: ${taskType} scheduled for ${scheduleTime}!`)
    })

    console.log(`Task scheduled: ${taskType} at ${scheduleTime}`)
  } else {
    console.log("Couldn't extract time from input.")
  }
}

// API Endpoint to accept user input and schedule the task
app.post('/schedule-task', async (req, res) => {
  const { userId, userPrompt } = req.body

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' })
  } else {
    console.log('User ID:', userId)
  }

  const user = await User.findById(userId)

  console.log(req.body)

  if (!userPrompt) {
    return res.status(400).json({ message: 'Please provide a task prompt.' })
  }

  // Extract task type and time from user prompt
  const { taskType, taskTime } = extractTaskAndTime(userPrompt)

  if (taskTime) {
    addTask(taskType, taskTime)

    user.tasks.push({ type: taskType, time: taskTime })

    // Save the user document
    await user.save()

    return res.status(201).json({
      message: ` ${taskType} scheduled at ${taskTime}  scheduled successfully.`
    })
  } else {
    return res
      .status(400)
      .json({ message: 'Failed to parse time. Please provide a valid time.' })
  }
})

// Fetch Task Route
app.get('/fetch-task', async (req, res) => {
  const { userId } = req.query // Extract userId from query parameters

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' })
  } else {
    console.log('User ID:', userId)
  }

  try {
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json({ tasks: user.tasks })
  } catch (err) {
    console.error('Server Error:', err)
    return res.status(500).json({ message: 'Server error' })
  }
})

// Start the server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
