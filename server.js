import cors from 'cors'
import http from 'http'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import { config } from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import restaurantRoutes from './routes/restaurantRoutes.js'
import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import menuRoutes from './routes/menuRoutes.js'

config() // Charge les variables d'environnement

const app = express()
const PORT = 8080
const server = http.createServer(app)

const mongoUri = process.env.MONGO_URI;


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, 'swagger.json'), 'utf-8'))


// Connect to the MongoDB database
mongoose
  .connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`)
  .then(() => {
    console.log('Connected to the database')
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error)
  })

  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to the database:', err))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/restaurant', restaurantRoutes)
app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/menu', menuRoutes)

// Serve static files from the "public" directory
app.use(express.static('public'))

app.use((req, res) => {
  res.status(404).json({ message: `API not found at ${req.url}` })
})

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}. API Documentation: http://localhost:${PORT}/api-docs/`)
})

export default app
