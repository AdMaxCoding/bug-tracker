import express from 'express'
import authRoutes from './routes/authRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import issueRoutes from './routes/issueRoutes.js'
import authMiddleware from './middleware/authMiddleware.js'

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(express.json())

// Root route for API status
app.get('/', (req, res) => {
  res.json({ status: 'Bug Tracker API running' })
})

// Routes
app.use('/auth', authRoutes)
app.use('/projects', authMiddleware, projectRoutes)
app.use('/issues', authMiddleware, issueRoutes)

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.listen(PORT, () => {
  console.log(`Server has started on port: ${PORT}`)
})
