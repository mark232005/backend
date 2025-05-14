import express from 'express'
import { addToy, getToy, getToys, removeToy, updateToy } from './toy.controller.js'


export const toyRoutes=express.Router()


toyRoutes.get('/',getToys)
toyRoutes.get('/:id',getToy)
toyRoutes.delete('/:id',removeToy)
toyRoutes.put('/:id',updateToy)
toyRoutes.post('/',addToy)