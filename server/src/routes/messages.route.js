import express from 'express'
import { get } from '../controllers/chat.controller'

const router = express.Router()

router.route('/')
  .get(
    get
  )

export default router
