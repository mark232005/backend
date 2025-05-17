
import express from 'express'
import { getUser, getUsers, updateUser } from './user.controller.js'

export const userRoutes=express.Router()


userRoutes.get('/',getUsers)
userRoutes.get('/:userId',getUser)
userRoutes.put('/:userId',updateUser)