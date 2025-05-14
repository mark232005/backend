

import express from 'express'
import { loggerService } from './services/logger.service.js'
import cors from 'cors'
// import { authRoutes } from './api/auth/auth.routes.js'
import { toyRoutes } from './api/toy/toy.routes.js'

const app = express()
app.use(express.json())

// app.use(cookieParser()) // for res.cookies
// console.log('process.env.NODE_ENV:', process.env.NODE_ENV)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('public'))
} else {
    const corsOptions = {
        origin: [
            'http://127.0.0.1:3000',
            'http://localhost:3000',
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'http://localhost:5174',
            'http://127.0.0.1:5174',
        ],
        credentials: true,
    }
    app.use(cors(corsOptions))
}




const port = process.env.PORT || 3030
app.listen(port, () => {
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
})


//routes
// app.use('/api/auth',authRoutes)
app.use('/api/toy',toyRoutes)
