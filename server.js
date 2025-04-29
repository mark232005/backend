

import express from 'express'
import { toyService } from './services/toy.service.js'
import { loggerService } from './services/logger.service.js'
import cors from 'cors'

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



////////////////*Toys API*////////////////////////////////////
app.get('/api/toy', (req, res) => {
    const { filterBy = {}, sortBy = {} } = req.query
    
    toyService.query(filterBy, sortBy).then(
        toys => res.send(toys)).catch(
            err => {
                loggerService.error('Cannot load toys', err)
                res.status(400).send('Cannot load toys')
            }
        )

})
app.get('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params
    toyService.getById(toyId).then(
        toy => res.send(toy)
    ).catch(err => {
        loggerService.error('Cannot get toy', err)
        res.status(400).send(err)
    })
})
app.delete('/api/toy/:toyId', (req, res) => {
    const { toyId } = req.params
    toyService.remove(toyId).then(
        () => res.send()
    ).catch(err => {
        loggerService.error('Cannot delete toy', err)
        res.status(400).send('Cannot delete toy' + err)

    })
})
app.put('/api/toy', (req, res) => {
    const { name, price, _id, inStock, imgUrl, labels } = req.body
    const toy = {
        name,
        price,
        _id,
        inStock,
        imgUrl,
        labels
    }
    toyService.save(toy).then(savedToy => res.send(savedToy)).catch(err=>{
        loggerService.error('Cannot edit toy', err)
        res.status(400).send('Cannot edit toy' + err)
    })
    
})
app.post('/api/toy',(req,res)=>{
    const { name, price,inStock, imgUrl, labels } = req.body
    const toy = {
        name,
        price,
        inStock,
        imgUrl,
        labels
    }

toyService.save(toy)
.then(toy=>res.send(toy))
.catch(err=>{
    loggerService.error('Cannot save toy', err)
    res.status(400).send('Cannot save toy' + err)

})
})



const port = process.env.PORT || 3030
app.listen(port, () => {
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
})
