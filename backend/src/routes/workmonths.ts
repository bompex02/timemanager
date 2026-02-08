import { Router } from 'express'
import { getWorkMonthByUser } from '../controllers/workmonthController.js'

const router = Router()

router.get('/user/:userId', getWorkMonthByUser)

export default router
