import express from 'express'
import { addMsg, addToy, getToy, getToys, removeToy, updateToy } from './toy.controller.js'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'


export const toyRoutes = express.Router()


toyRoutes.get('/', log, getToys)
toyRoutes.get('/:id', getToy)
toyRoutes.delete('/:id', requireAuth, requireAdmin, removeToy)
toyRoutes.put('/:id', requireAuth, requireAdmin, updateToy)
toyRoutes.post('/', requireAuth, requireAdmin, addToy)
toyRoutes.post('/:id/msg', requireAuth, addMsg)