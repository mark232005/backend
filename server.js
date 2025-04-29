

import express from 'express'
import { toyService } from './services/toy.service.js'
import { loggerService } from './services/logger.service.js'

const app=express()



////////////////*Toys API*////////////////////////////////////
app.get('/api/toy',(req,res)=>{
    const { filterBy = {}, sortBy = {}} = req.query
    toyService.query(filterBy,sortBy).then(
        toys=>res.send(toys)).catch(
            err=>{
                loggerService.error('Cannot load toys',err)
                res.status(400).send('Cannot load toys')
            }
        )

})
app.get('/api/toy/:toyId',(req,res)=>{
    const {toyId}=req.params
    toyService.getById(toyId).then(
        toy=>res.send(toy)
    ).catch(err=>{
        loggerService.error('Cannot get toy',err)
        res.status(400).send(err)
    })
})
app.delete('/api/toy/:toyId',(req,res)=>{
    const {toyId}=req.params
    toyService.remove(toyId).then(
        ()=>res.send()
    ).catch(err=>{
        loggerService.error('Cannot delete toy',err)
        res.status(400).send('Cannot delete toy'+err)

    })

 
})



const port = process.env.PORT || 3030
app.listen(port, () => {
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
})
