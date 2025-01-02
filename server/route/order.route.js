import { Router } from 'express'
import auth from '../middleware/auth.js'
import { getOrderById,CashOnDeliveryOrderController, verifyPayment,getOrderDetailsController, paymentController, webhookStripe } from '../controllers/order.controller.js'

const orderRouter = Router()

orderRouter.post("/cash-on-delivery",auth,CashOnDeliveryOrderController)
orderRouter.post('/checkout',auth,paymentController)
orderRouter.post('/webhook',webhookStripe)
orderRouter.get("/verify-payment/:tx_ref", verifyPayment);
orderRouter.get("/order-list",auth,getOrderDetailsController)
orderRouter.get('/:orderId', getOrderById);

export default orderRouter